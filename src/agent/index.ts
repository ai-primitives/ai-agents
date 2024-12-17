import { createAIFunction, AIFunction } from '@agentic/core'
import { AgentConfig, AgentState } from '../types/agent'
import { z } from 'zod'
import { WolframAlphaClient } from '@agentic/wolfram-alpha'
import { WikipediaClient, wikipedia } from '@agentic/wikipedia'

type AgentInputs = Record<string, string | number | boolean>
type AgentOutputs = Record<string, unknown>

export class Agent {
  private config: AgentConfig
  private state: AgentState = 'idle'
  private aiFunction: AIFunction<z.ZodObject<z.ZodRawShape>, AgentOutputs> | null = null

  constructor(config: AgentConfig) {
    this.config = config
  }

  getState(): AgentState {
    return this.state
  }

  getName(): string {
    return this.config.name
  }

  getDescription(): string {
    return this.config.description
  }

  getTools(): string[] {
    return this.config.tools
  }

  async execute(inputs: AgentInputs) {
    this.state = 'processing'
    try {
      if (!this.aiFunction) {
        const inputSchema = z.object(
          Object.fromEntries(
            Object.entries(this.config.inputs).map(([key, type]) => [
              key,
              type === 'string' ? z.string() : type === 'number' ? z.number() : type === 'boolean' ? z.boolean() : z.unknown(),
            ]),
          ),
        )

        this.aiFunction = createAIFunction(
          {
            name: this.config.name,
            description: this.config.description,
            inputSchema,
            strict: true,
          },
          async (params) => {
            if (this.config.tools.includes('wolfram-alpha')) {
              const wolfram = new WolframAlphaClient()
              const result = await wolfram.ask(params.query as string)
              return { result }
            }

            if (this.config.tools.includes('wikipedia-search') || this.config.tools.includes('wikipedia-summary')) {
              const wikipedia = new WikipediaClient()
              const type = params.type as string

              if (type === 'search') {
                const searchOptions: wikipedia.SearchOptions = { query: params.query as string }
                const searchResults = await wikipedia.search(searchOptions)
                const firstResult = searchResults.pages[0]
                return {
                  result: {
                    title: firstResult.title,
                    content: firstResult.excerpt,
                    url: `https://wikipedia.org/wiki/${firstResult.key}`
                  }
                }
              }

              const summaryOptions: wikipedia.PageSummaryOptions = { title: params.query as string }
              const summary = await wikipedia.getPageSummary(summaryOptions)
              return {
                result: {
                  title: summary.title,
                  content: summary.extract,
                  url: summary.content_urls.desktop.page
                }
              }
            }

            return this.config.outputs
          },
        )
      }

      const result = await this.aiFunction.impl(inputs)
      this.state = 'complete'
      return result
    } catch (error) {
      this.state = 'error'
      throw error
    }
  }
}
