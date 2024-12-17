import { z } from 'zod'

/**
 * Schema for AI Agent configuration using frontmatter data
 */
export const AgentConfigSchema = z.object({
  name: z.string().describe('Name of the AI agent'),
  description: z.string().describe('Description of the agent\'s purpose and capabilities'),
  tools: z.array(z.string()).describe('List of tool identifiers the agent can use'),
  inputs: z.record(z.string(), z.any()).describe('Input specifications with variable types'),
  outputs: z.record(z.string(), z.any()).describe('Output specifications with expected types'),
})

/**
 * Type definition for AI Agent configuration
 */
export type AgentConfig = z.infer<typeof AgentConfigSchema>

/**
 * Possible states of an AI Agent during execution
 */
export type AgentState = 'idle' | 'processing' | 'complete' | 'error'
