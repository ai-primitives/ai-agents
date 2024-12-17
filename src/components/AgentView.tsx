import React from 'react'
import { Agent } from '../agent'
import './AgentView.css'

interface AgentViewProps {
  agent: Agent
}

export function AgentView({ agent }: AgentViewProps) {
  const state = agent.getState()

  return (
    <div className="agent-view">
      <div className={`agent-status ${state}`}>
        <div className="agent-header">
          <h2>{agent.getName()}</h2>
          <p className="description">{agent.getDescription()}</p>
        </div>

        <div className="agent-state">
          {state === 'idle' && (
            <div className="state-idle">
              <span className="status-icon">⚪</span>
              <span>Ready</span>
            </div>
          )}

          {state === 'processing' && (
            <div className="state-processing">
              <span className="status-icon spinning">⚙️</span>
              <span>Processing...</span>
            </div>
          )}

          {state === 'complete' && (
            <div className="state-complete">
              <span className="status-icon">✅</span>
              <span>Complete</span>
            </div>
          )}

          {state === 'error' && (
            <div className="state-error">
              <span className="status-icon">❌</span>
              <span>Error</span>
            </div>
          )}
        </div>

        <div className="agent-tools">
          <h3>Available Tools</h3>
          <ul>
            {agent.getTools().map((tool, index) => (
              <li key={index}>{tool}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
