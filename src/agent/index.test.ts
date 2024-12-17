import { describe, it, expect, vi } from 'vitest'
import { Agent } from './index'
import { AgentConfig } from '../types/agent'

describe('Agent', () => {
  const mockConfig: AgentConfig = {
    name: 'Test Agent',
    description: 'A test agent for unit testing',
    tools: ['tool1', 'tool2'],
    inputs: { input1: 'string' },
    outputs: { output1: 'string' }
  }

  it('should initialize with correct state', () => {
    const agent = new Agent(mockConfig)
    expect(agent.getState()).toBe('idle')
    expect(agent.getName()).toBe(mockConfig.name)
    expect(agent.getDescription()).toBe(mockConfig.description)
    expect(agent.getTools()).toEqual(mockConfig.tools)
  })

  it('should transition states during execution', async () => {
    const agent = new Agent(mockConfig)
    const mockResult = { output1: 'test result' }

    vi.mock('@agentic/core', () => ({
      generateObject: vi.fn().mockResolvedValue(mockResult)
    }))

    const executionPromise = agent.execute({ input1: 'test input' })
    expect(agent.getState()).toBe('processing')

    const result = await executionPromise
    expect(agent.getState()).toBe('complete')
    expect(result).toEqual(mockResult)
  })

  it('should handle execution errors', async () => {
    const agent = new Agent(mockConfig)
    const mockError = new Error('Test error')

    vi.mock('@agentic/core', () => ({
      generateObject: vi.fn().mockRejectedValue(mockError)
    }))

    await expect(agent.execute({ input1: 'test input' })).rejects.toThrow(mockError)
    expect(agent.getState()).toBe('error')
  })

  it('should pass correct parameters to generateObject', async () => {
    const agent = new Agent(mockConfig)
    const mockInputs = { input1: 'test input' }
    const generateObject = vi.fn().mockResolvedValue({ output1: 'test result' })

    vi.mock('@agentic/core', () => ({ generateObject }))

    await agent.execute(mockInputs)

    expect(generateObject).toHaveBeenCalledWith({
      tools: mockConfig.tools,
      inputs: mockInputs,
      outputs: mockConfig.outputs
    })
  })
})
