import { motion } from 'framer-motion'
import { User } from 'lucide-react'

import type { ChatMessage } from '@/api/chat'
import { cn } from '@/lib/utils'

import { AssistantAvatar } from './assistant-avatar'

interface ChatMessageItemProps {
  message: ChatMessage
  /** When true, renders a blinking caret to signal the reply is still arriving. */
  isStreaming?: boolean
}

export function ChatMessageItem({ message, isStreaming = false }: ChatMessageItemProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('flex items-start gap-3', isUser && 'flex-row-reverse')}
    >
      {isUser ? <UserAvatar /> : <AssistantAvatar />}

      <div
        className={cn(
          'max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-tr-sm border border-primary/25 bg-primary/15 text-foreground'
            : 'rounded-tl-sm border border-white/10 bg-white/[0.04] text-foreground/90',
        )}
      >
        {message.content}
        {isStreaming ? (
          <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-primary align-middle" />
        ) : null}
      </div>
    </motion.div>
  )
}

function UserAvatar() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10">
      <User className="size-4 text-foreground/70" strokeWidth={2} />
    </span>
  )
}
