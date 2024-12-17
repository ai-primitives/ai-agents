import { describe, it, expect, vi } from 'vitest'
import { Agent } from '../agent'
import { WikipediaClient } from '@agentic/wikipedia'
import wikipediaAgent from '../../examples/wikipedia-agent.mdx'

type WikiResult = {
  result: {
    title: string
    content: string
    url: string
  }
}

vi.mock('@agentic/wikipedia', () => ({
  WikipediaClient: vi.fn().mockImplementation(() => ({
    ky: {},
    apiBaseUrl: 'https://en.wikipedia.org/api/rest_v1',
    apiUserAgent: 'WikipediaAgent/1.0',
    functions: {},
    search: vi.fn().mockResolvedValue([{
      title: 'Test Article',
      snippet: 'Test content',
      url: 'https://wikipedia.org/Test_Article'
    }]),
    getPageSummary: vi.fn().mockResolvedValue({
      title: 'Test Article',
      extract: 'Full article content',
      url: 'https://wikipedia.org/Test_Article'
    })
  }))
}))

describe('Wikipedia Agent', () => {
  it('should handle search queries', async () => {
    const agent = new Agent(wikipediaAgent)
    const result = await agent.execute({
      query: 'test query',
      type: 'search'
    }) as WikiResult

    expect(result.result.title).toBe('Test Article')
    expect(result.result.content).toBe('Test content')
    expect(result.result.url).toBe('https://wikipedia.org/Test_Article')
  })

  it('should handle summary requests', async () => {
    const agent = new Agent(wikipediaAgent)
    const result = await agent.execute({
      query: 'Test_Article',
      type: 'summary'
    }) as WikiResult

    expect(result.result.title).toBe('Test Article')
    expect(result.result.content).toBe('Full article content')
    expect(result.result.url).toBe('https://wikipedia.org/Test_Article')
  })

  it('should handle API errors', async () => {
    vi.mocked(WikipediaClient).mockImplementationOnce(() => ({
      search: vi.fn().mockRejectedValue(new Error('Search failed')),
      getPageSummary: vi.fn().mockRejectedValue(new Error('Summary failed'))
    }))

    const agent = new Agent(wikipediaAgent)
    await expect(agent.execute({
      query: 'error test',
      type: 'search'
    })).rejects.toThrow('Search failed')
  })
})
