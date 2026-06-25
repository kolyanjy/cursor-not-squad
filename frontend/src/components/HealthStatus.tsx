import { useEffect, useState } from 'react'
import { Activity, CheckCircle2, Loader2, XCircle } from 'lucide-react'

import { fetchHealth, type HealthResponse } from '@/api/client'
import { cn } from '@/lib/utils'

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
      return (
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Checking API…
        </div>
      )
    case 'success':
      return (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>
            {state.data.message}{' '}
            <span className={cn('font-mono text-emerald-300/80')}>({state.data.status})</span>
          </span>
          <Activity className="ml-auto size-4 text-emerald-400/60" />
        </div>
      )
    case 'error':
      return (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <XCircle className="size-4 shrink-0" />
          {state.message}
        </div>
      )
    default: {
      const _exhaustive: never = state
      return _exhaustive
    }
  }
}
