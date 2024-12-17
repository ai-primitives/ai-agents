import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Agent } from '../agent'
import { AgentView } from './AgentView'
import { AgentConfig } from '../types/agent'
import { createAIFunction, AIFunction } from '@agentic/core'
import { z } from 'zod'

type InputSchema = z.ZodObject<{ input1: z.ZodString }, 'strip'>
type OutputType = { output1: string }

vi.mock('@agentic/core', () => ({
  createAIFunction: vi.fn(),
}))

describe('AgentView', () => {
  let agent: Agent
  const mockConfig: AgentConfig = {
    name: 'Test Agent',
    description: 'A test agent for unit testing',
    tools: ['tool1', 'tool2'],
    inputs: { input1: 'string' },
    outputs: { output1: 'string' },
  }

  const createMockAIFunction = (returnValue: any) => {
    const impl = vi.fn().mockResolvedValue(returnValue)
    return {
      inputSchema: z.object({ input1: z.string() }),
      impl,
      parseInput: vi.fn(),
      spec: {
        name: 'mockFunction',
        description: 'Mock function for testing',
        parameters: { type: 'object', properties: {} },
      },
    } as unknown as AIFunction<InputSchema, any>
  }

  beforeEach(() => {
    vi.resetAllMocks()
    agent = new Agent(mockConfig)
  })

  it('should render agent information correctly', () => {
    render(<AgentView agent={agent} />)

    expect(screen.getByText('Test Agent')).toBeInTheDocument()
    expect(screen.getByText('A test agent for unit testing')).toBeInTheDocument()
    expect(screen.getByText('tool1')).toBeInTheDocument()
    expect(screen.getByText('tool2')).toBeInTheDocument()
  })

  it('should display idle state by default', () => {
    render(<AgentView agent={agent} />)

    expect(screen.getByText('Ready')).toBeInTheDocument()
    expect(screen.getByText('⚪')).toBeInTheDocument()
  })

  it('should display processing state', async () => {
    const neverResolve = new Promise(() => {})
    const mockAIFunction = createMockAIFunction({ output1: '' })
    mockAIFunction.impl = vi.fn().mockImplementation(() => neverResolve)
    vi.mocked(createAIFunction).mockReturnValue(mockAIFunction)

    agent.execute({ input1: 'test' })
    render(<AgentView agent={agent} />)

    await waitFor(() => {
      expect(screen.getByText('Processing...')).toBeInTheDocument()
      expect(screen.getByText('⚙️')).toBeInTheDocument()
    })
  })

  it('should display error state', async () => {
    const mockError = new Error('Test error')
    const mockAIFunction = createMockAIFunction({ output1: '' })
    const errorImpl = vi.fn().mockRejectedValue(mockError)
    mockAIFunction.impl = errorImpl
    vi.mocked(createAIFunction).mockReturnValue(mockAIFunction)

    try {
      await agent.execute({ input1: 'test' })
    } catch (error) {
      // Expected error
    }

    render(<AgentView agent={agent} />)
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('❌')).toBeInTheDocument()
    })
  })

  it('should display complete state after successful execution', async () => {
    const mockResult = { output1: 'success' }
    const mockAIFunction = createMockAIFunction(mockResult)
    vi.mocked(createAIFunction).mockReturnValue(mockAIFunction)

    await agent.execute({ input1: 'test' })
    render(<AgentView agent={agent} />)

    expect(screen.getByText('Complete')).toBeInTheDocument()
    expect(screen.getByText('✅')).toBeInTheDocument()
  })
})
