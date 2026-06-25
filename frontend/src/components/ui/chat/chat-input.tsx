import { ArrowUp, Square } from 'lucide-react'
import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

const MAX_HEIGHT = 160

interface ChatInputProps {
  onSend: (text: string) => void
  onStop: () => void
  /** True while the assistant is thinking or streaming — swaps Send for Stop. */
  busy: boolean
  placeholder?: string
}

export function ChatInput({ onSend, onStop, busy, placeholder }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const canSend = value.trim().length > 0

  function resize() {
    const element = textareaRef.current
    if (!element) return
    element.style.height = 'auto'
    element.style.height = `${Math.min(element.scrollHeight, MAX_HEIGHT)}px`
  }

  function submit() {
    if (!canSend || busy) return
    onSend(value)
    setValue('')
    requestAnimationFrame(() => {
      const element = textareaRef.current
      if (element) element.style.height = 'auto'
    })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    submit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-end gap-2 rounded-2xl border border-white/12 bg-white/[0.05] p-2 pl-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-colors focus-within:border-primary/40 focus-within:bg-white/[0.07]">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            resize()
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? 'Tell me the vibe…'}
          aria-label="Message TonightPick"
          className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />

        {busy ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-foreground transition-colors hover:bg-white/15 active:scale-95"
          >
            <Square className="size-3.5 fill-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-xl transition-all',
              canSend
                ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-95'
                : 'bg-white/10 text-muted-foreground',
            )}
          >
            <ArrowUp className="size-4" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </form>
  )
}
