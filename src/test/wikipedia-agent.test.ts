import { describe, it, expect, vi } from 'vitest'
import { Agent } from '../agent'
import { WikipediaClient } from '@agentic/wikipedia'

vi.mock('@agentic/wikipedia', () => ({
  WikipediaClient: vi.fn().mockImplementation(() => ({
    search: vi.fn().mockImplementation(() => {
      return Promise.resolve({
        pages: [{
          title: 'Test Article',
          excerpt: 'Test content preview',
          key: 'Test_Article'
        }]
      })
    }),
    getPageSummary: vi.fn().mockImplementation(() => {
      return Promise.resolve({
        title: 'Test Article',
        extract: 'Full article content',
        content_urls: {
          desktop: {
            page: 'https://wikipedia.org/wiki/Test_Article'
          }
        }
      })
    })
  }))
}))

const wikipediaAgent = {
  name: 'WikipediaAgent',
  description: 'An AI agent that searches Wikipedia and retrieves article summaries',
  tools: ['wikipedia-search', 'wikipedia-summary'],
  inputs: {
    query: 'string',
    type: 'string'
  },
  outputs: {
    result: {
      title: 'string',
      content: 'string',
      url: 'string'
    }
  }
}

// Type for execute result
type WikipediaResult = {
  result: {
    title: string
    content: string
    url: string
  }
}

describe('WikipediaAgent', () => {
  it('should handle search queries', async () => {
    const agent = new Agent(wikipediaAgent)
    const result = await agent.execute({
      query: 'test query',
      type: 'search'
    }) as WikipediaResult

    expect(result.result.title).toBe('Test Article')
    expect(result.result.content).toBe('Test content preview')
    expect(result.result.url).toBe('https://wikipedia.org/wiki/Test_Article')
  })

  it('should handle summary requests', async () => {
    const agent = new Agent(wikipediaAgent)
    const result = await agent.execute({
      query: 'Test_Article',
      type: 'summary'
    }) as WikipediaResult

    expect(result.result.title).toBe('Test Article')
    expect(result.result.content).toBe('Full article content')
    expect(result.result.url).toBe('https://wikipedia.org/wiki/Test_Article')
  })
})
