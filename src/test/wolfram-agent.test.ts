import { describe, it, expect, vi } from 'vitest'
import { Agent } from '../agent'
import { WolframAlphaClient } from '@agentic/wolfram-alpha'

vi.mock('@agentic/wolfram-alpha', () => ({
  WolframAlphaClient: vi.fn().mockImplementation(() => ({
    ask: vi.fn().mockImplementation((query) => {
      if (query === 'what is 2+2') {
        return Promise.resolve('4')
      }
      throw new Error('Invalid query')
    })
  }))
}))

const wolframAgent = {
  name: 'WolframAgent',
  description: 'An AI agent that performs computational queries using Wolfram Alpha',
  tools: ['wolfram-alpha'],
  inputs: {
    query: 'string'
  },
  outputs: {
    result: 'string'
  }
}

// Type for execute result
type WolframResult = {
  result: string
}

describe('WolframAgent', () => {
  it('should process computational queries', async () => {
    const agent = new Agent(wolframAgent)
    const result = await agent.execute({
      query: 'what is 2+2'
    }) as WolframResult

    expect(result.result).toBe('4')
  })

  it('should handle invalid queries', async () => {
    const agent = new Agent(wolframAgent)
    await expect(agent.execute({
      query: 'invalid query'
    })).rejects.toThrow('Invalid query')
  })
})
