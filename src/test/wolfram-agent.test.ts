import { describe, it, expect, vi } from 'vitest'
import { Agent } from '../agent'
import { WolframAlphaClient } from '@agentic/wolfram-alpha'

vi.mock('@agentic/wolfram-alpha', () => ({
  WolframAlphaClient: vi.fn().mockImplementation(() => ({
    search: vi.fn().mockImplementation((query) => {
      if (query === 'what is 2+2') {
        return Promise.resolve({
          answer: '4',
          details: 'Basic arithmetic calculation'
        })
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
    result: {
      answer: 'string',
      details: 'string'
    }
  }
}

// Type for execute result
type WolframResult = {
  result: {
    answer: string
    details: string
  }
}

describe('WolframAgent', () => {
  it('should process computational queries', async () => {
    const agent = new Agent(wolframAgent)
    const result = await agent.execute({
      query: 'what is 2+2'
    }) as WolframResult

    expect(result.result.answer).toBe('4')
    expect(result.result.details).toBe('Basic arithmetic calculation')
  })

  it('should handle invalid queries', async () => {
    const agent = new Agent(wolframAgent)
    await expect(agent.execute({
      query: 'invalid query'
    })).rejects.toThrow('Invalid query')
  })
})
