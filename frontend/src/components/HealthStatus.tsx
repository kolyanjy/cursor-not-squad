import { useEffect, useState } from 'react'
import { fetchHealth, type HealthResponse } from '../api/client'

type LoadState =
  | { kind: 'loading' }
  | { kind: 'success'; data: HealthResponse }
  | { kind: 'error'; message: string }

export function HealthStatus() {
  const [state, setState] = useState<LoadState>({ kind: 'loading' })

  useEffect(() => {
    let cancelled = false

    fetchHealth()
      .then((data) => {
        if (!cancelled) {
          setState({ kind: 'success', data })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : 'Failed to reach API'
          setState({ kind: 'error', message })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  switch (state.kind) {
    case 'loading':
      return <p className="status">Checking API…</p>
    case 'success':
      return (
        <p className="status status--ok">
          {state.data.message} ({state.data.status})
        </p>
      )
    case 'error':
      return <p className="status status--error">{state.message}</p>
    default: {
      const _exhaustive: never = state
      return _exhaustive
    }
  }
}
