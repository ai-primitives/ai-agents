declare module '*.mdx' {
  import type { AgentConfig } from '../types/agent'
  const content: AgentConfig
  export default content
}
