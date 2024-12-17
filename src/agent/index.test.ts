import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Agent } from './index'
import { AgentConfig } from '../types/agent'
import { createAIFunction, AIFunction } from '@agentic/core'
import { z } from 'zod'

type InputSchema = z.ZodObject<{ input1: z.ZodString }, 'strip'>
type TestOutputs = { output1: string }

vi.mock('@agentic/core', () => ({
  createAIFunction: vi.fn(),
}))

describe('Agent', () => {
  let agent: Agent
  const mockConfig: AgentConfig = {
    name: 'Test Agent',
    description: 'A test agent',
    tools: ['tool1', 'tool2'],
    inputs: { input1: 'string' },
    outputs: { output1: 'string' },
  }

  const createMockAIFunction = (returnValue: TestOutputs) => {
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
    } as unknown as AIFunction<InputSchema, TestOutputs>
  }

  beforeEach(() => {
    vi.resetAllMocks()
    agent = new Agent(mockConfig)
  })

  it('should initialize with correct configuration', () => {
    expect(agent.getName()).toBe('Test Agent')
    expect(agent.getDescription()).toBe('A test agent')
    expect(agent.getTools()).toEqual(['tool1', 'tool2'])
  })

  it('should execute successfully with valid inputs', async () => {
    const mockResult = { output1: 'success' }
    const mockAIFunction = createMockAIFunction(mockResult)
    vi.mocked(createAIFunction).mockReturnValue(mockAIFunction)

    const result = await agent.execute({ input1: 'test' })
    expect(result).toEqual(mockResult)
  })

  it('should handle execution errors', async () => {
    const mockError = new Error('Test error')
    const mockAIFunction = createMockAIFunction({ output1: '' })
    mockAIFunction.impl = vi.fn().mockRejectedValue(mockError)
    vi.mocked(createAIFunction).mockReturnValue(mockAIFunction)

    await expect(agent.execute({ input1: 'test' })).rejects.toThrow('Test error')
  })
})
