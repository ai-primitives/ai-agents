import { createAIFunction, AIFunction } from '@agentic/core'
import { AgentConfig, AgentState } from '../types/agent'
import { z } from 'zod'

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
            return {
              ...this.config.outputs,
              ...params,
            }
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
