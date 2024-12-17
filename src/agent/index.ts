import { generateObject } from '@agentic/core'
import { AgentConfig, AgentState } from '../types/agent'

export class Agent {
  private config: AgentConfig
  private state: AgentState = 'idle'

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

  async execute(inputs: Record<string, any>) {
    this.state = 'processing'
    try {
      const result = await generateObject({
        tools: this.config.tools,
        inputs,
        outputs: this.config.outputs
      })
      this.state = 'complete'
      return result
    } catch (error) {
      this.state = 'error'
      throw error
    }
  }
}
