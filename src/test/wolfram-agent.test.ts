import { describe, it, expect, vi } from 'vitest'
import { Agent } from '../agent'
import { WolframAlphaClient } from '@agentic/wolfram-alpha'
import wolframAgent from '../../examples/wolfram-agent.mdx'

type WolframResult = {
  result: {
    answer: string
    details: string
  }
}

vi.mock('@agentic/wolfram-alpha', () => ({
  WolframAlphaClient: vi.fn().mockImplementation(() => ({
    search: vi.fn().mockResolvedValue({
      answer: '42',
      details: 'The answer to life, universe, and everything'
    })
  }))
}))

describe('Wolfram Alpha Agent', () => {
  it('should process computational queries', async () => {
    const agent = new Agent(wolframAgent)
    const result = await agent.execute({
      query: 'what is the meaning of life?'
    }) as WolframResult

    expect(result.result.answer).toBe('42')
    expect(result.result.details).toBe('The answer to life, universe, and everything')
  })

  it('should handle errors gracefully', async () => {
    vi.mocked(WolframAlphaClient).mockImplementationOnce(() => ({
      search: vi.fn().mockRejectedValue(new Error('API Error'))
    }))

    const agent = new Agent(wolframAgent)
    await expect(agent.execute({
      query: 'invalid query'
    })).rejects.toThrow('API Error')
  })
})
