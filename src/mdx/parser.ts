import { parse } from 'mdxld'
import { AgentConfigSchema } from '../types/agent'
import type { z } from 'zod'

/**
 * Parses an MDX file containing an AI Agent definition
 * Validates the frontmatter data against the AgentConfigSchema
 *
 * @param content - Raw MDX content string
 * @returns Object containing validated config and content
 * @throws {Error} If frontmatter validation fails
 */
export async function parseAgentMDX(content: string) {
  try {
    const mdx = parse(content)

    // Validate frontmatter data against schema
    const config = AgentConfigSchema.parse(mdx.data)

    return {
      config,
      content: mdx.content,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse agent MDX: ${error.message}`)
    }
    throw error
  }
}

/**
 * Type definition for parsed MDX agent result
 */
export type ParsedAgentMDX = {
  config: z.infer<typeof AgentConfigSchema>
  content: string
}
