import { Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

export function AssistantAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative flex size-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-primary/35 to-primary/5',
        className,
      )}
    >
      <span aria-hidden className="absolute inset-0 rounded-full bg-primary/25 blur-md" />
      <Sparkles className="relative size-4 text-primary" strokeWidth={2} />
    </span>
  )
}
