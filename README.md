# ai-agents

[![npm version](https://badge.fury.io/js/ai-agents.svg)](https://www.npmjs.com/package/ai-agents)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript library for building AI agents with MDX-based definitions and React visualizations.

## Features

- 🤖 Strongly-typed TypeScript API for AI agent development
- 📝 MDX-based agent definitions with structured frontmatter
- 🔧 Integration with tools from [agentic.so](https://agentic.so)
- 🎨 React components for agent visualization with state management
- 🔄 Support for imports/exports and executable code in agent definitions
- 🛠️ Built on [Vercel AI SDK](https://sdk.vercel.ai) and [mdxld](https://mdx.org.ai)

## Installation

```bash
pnpm add ai-agents
```

## Usage

### TypeScript API

```typescript
import { Agent } from 'ai-agents'

// Create a strongly-typed agent definition
const agent = new Agent({
  name: 'SearchAgent',
  tools: ['search', 'calculate'],
  inputs: {
    query: 'string',
    context: 'object'
  },
  outputs: {
    result: 'string',
    confidence: 'number'
  }
})
```

### MDX Agent Definition

```mdx
---
name: SearchAgent
tools:
  - search
  - calculate
inputs:
  - name: query
    type: string
  - name: context
    type: object
outputs:
  - name: result
    type: string
  - name: confidence
    type: number
---

import { Search } from 'agentic'

// Define agent processing logic
export const process = async ({ query, context }) => {
  const searchResult = await Search.execute(query)
  return {
    result: searchResult.text,
    confidence: searchResult.score
  }
}

// Define agent visualization component
export default function AgentVisualization({ state }) {
  return (
    <div className='agent-container'>
      {state === 'idle' && <IdleState />}
      {state === 'processing' && <ProcessingState />}
      {state === 'complete' && <CompleteState />}
      {state === 'error' && <ErrorState />}
    </div>
  )
}
```

## Agent States

The React component exported from your MDX file serves as a visualization of your agent. It receives the current state and can render different views:

- `idle`: Initial state, waiting for input
- `processing`: Agent is actively processing
- `complete`: Agent has finished processing
- `error`: Error state with details

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the package
pnpm build

# Lint the code
pnpm lint

# Format the code
pnpm format
```

## Contributing

Please read our [Contributing Guide](./CONTRIBUTING.md) to learn about our development process.

## License

MIT © [AI Primitives](https://mdx.org.ai)

## Dependencies

This package integrates the following key dependencies:

- [ai](https://www.npmjs.com/package/ai) - Vercel AI SDK for TypeScript/JavaScript
- [mdxld](https://www.npmjs.com/package/mdxld) - MDX parser with YAML-LD frontmatter support
- [agentic](https://agentic.so) - TypeScript AI agent tools and utilities
- React for component visualization
