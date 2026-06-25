import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, TriangleAlert } from 'lucide-react'
import { useEffect, useRef } from 'react'

import type { ChatMessage } from '@/api/chat'
import { ChatInput } from '@/components/ui/chat/chat-input'
import { ChatMessageItem } from '@/components/ui/chat/chat-message'
import { ThinkingIndicator } from '@/components/ui/chat/thinking-indicator'
import type { ChatStatus } from '@/hooks/useChat'

export interface AIChatProps {
  messages: ChatMessage[]
  status: ChatStatus
  error: string | null
  onSend: (text: string) => void
  onStop: () => void
}

export function AIChat({ messages, status, error, onSend, onStop }: AIChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const isEmpty = messages.length === 0
  const lastMessage = messages[messages.length - 1]

  // Keep the latest content in view as messages arrive / tokens stream in.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, status])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-6 p-4 sm:p-6">
            {messages.map((message) => (
              <ChatMessageItem
                key={message.id}
                message={message}
                isStreaming={
                  status === 'streaming' &&
                  message.id === lastMessage?.id &&
                  message.role === 'assistant'
                }
              />
            ))}

            <AnimatePresence>
              {status === 'thinking' ? <ThinkingIndicator key="thinking" /> : null}
            </AnimatePresence>

            {error ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-200">
                <TriangleAlert className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-white/10 bg-white/[0.02] p-3 sm:p-4">
        <ChatInput busy={status !== 'idle'} onSend={onSend} onStop={onStop} />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex min-h-full flex-col items-center justify-center px-5 py-10 text-center"
    >
      <span className="relative flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-primary/35 to-primary/5">
        <span aria-hidden className="absolute inset-0 rounded-2xl bg-primary/25 blur-xl" />
        <Sparkles className="relative size-7 text-primary" strokeWidth={1.75} />
      </span>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
        What are we doing tonight?
      </h1>
      <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Tell me the vibe and I&apos;ll line up a few ideas you can swipe through —
        no endless scrolling, no dashboards.
      </p>
    </motion.div>
  )
}
