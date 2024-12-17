import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Agent } from '../agent'
import { AgentView } from './AgentView'
import { AgentConfig } from '../types/agent'

describe('AgentView', () => {
  const mockConfig: AgentConfig = {
    name: 'Test Agent',
    description: 'A test agent for unit testing',
    tools: ['tool1', 'tool2'],
    inputs: { input1: 'string' },
    outputs: { output1: 'string' }
  }

  it('should render agent information correctly', () => {
    const agent = new Agent(mockConfig)
    render(<AgentView agent={agent} />)

    expect(screen.getByText('Test Agent')).toBeInTheDocument()
    expect(screen.getByText('A test agent for unit testing')).toBeInTheDocument()
    expect(screen.getByText('tool1')).toBeInTheDocument()
    expect(screen.getByText('tool2')).toBeInTheDocument()
  })

  it('should display idle state by default', () => {
    const agent = new Agent(mockConfig)
    render(<AgentView agent={agent} />)

    expect(screen.getByText('Ready')).toBeInTheDocument()
    expect(screen.getByText('⚪')).toBeInTheDocument()
  })

  it('should display processing state', async () => {
    const agent = new Agent(mockConfig)
    vi.mock('@agentic/core', () => ({
      generateObject: vi.fn().mockImplementation(() => new Promise(() => {}))
    }))

    agent.execute({ input1: 'test' })
    render(<AgentView agent={agent} />)

    expect(screen.getByText('Processing...')).toBeInTheDocument()
    expect(screen.getByText('⚙️')).toBeInTheDocument()
  })

  it('should display error state', async () => {
    const agent = new Agent(mockConfig)
    vi.mock('@agentic/core', () => ({
      generateObject: vi.fn().mockRejectedValue(new Error('Test error'))
    }))

    try {
      await agent.execute({ input1: 'test' })
    } catch (error) {
      // Error state will be set
    }
    render(<AgentView agent={agent} />)

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('❌')).toBeInTheDocument()
  })

  it('should display complete state after successful execution', async () => {
    const agent = new Agent(mockConfig)
    vi.mock('@agentic/core', () => ({
      generateObject: vi.fn().mockResolvedValue({ output1: 'success' })
    }))

    await agent.execute({ input1: 'test' })
    render(<AgentView agent={agent} />)

    expect(screen.getByText('Complete')).toBeInTheDocument()
    expect(screen.getByText('✅')).toBeInTheDocument()
  })
})
