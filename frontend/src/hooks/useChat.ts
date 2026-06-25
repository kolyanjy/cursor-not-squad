import { useCallback, useEffect, useRef, useState } from 'react'

import { streamAssistantReply, type ChatMessage } from '@/api/chat'

export type ChatStatus = 'idle' | 'thinking' | 'streaming'

export interface UseChatResult {
  messages: ChatMessage[]
  status: ChatStatus
  error: string | null
  /** Append a user message and stream the assistant's reply. No-op while busy. */
  send: (text: string) => void
  /** Cancel an in-flight reply, keeping whatever streamed so far. */
  stop: () => void
  /** Clear the conversation and cancel any in-flight reply. */
  reset: () => void
}

function createId(): string {
  return crypto.randomUUID()
}

export function useChat(): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<ChatStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  // Mirror of `messages` so `send` can read the latest history without being
  // re-created on every keystroke-driven render.
  const messagesRef = useRef<ChatMessage[]>(messages)
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const controllerRef = useRef<AbortController | null>(null)

  const send = useCallback((raw: string) => {
    const text = raw.trim()
    if (!text || controllerRef.current) return

    const userMessage: ChatMessage = { id: createId(), role: 'user', content: text }
    const assistantId = createId()
    const history = [...messagesRef.current, userMessage]

    setError(null)
    setMessages((prev) => [...prev, userMessage])
    setStatus('thinking')

    const controller = new AbortController()
    controllerRef.current = controller

    void (async () => {
      let receiving = false
      try {
        for await (const chunk of streamAssistantReply(history, {
          signal: controller.signal,
        })) {
          if (!receiving) {
            receiving = true
            setStatus('streaming')
            setMessages((prev) => [
              ...prev,
              { id: assistantId, role: 'assistant', content: chunk },
            ])
          } else {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === assistantId
                  ? { ...message, content: message.content + chunk }
                  : message,
              ),
            )
          }
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Something went wrong')
        }
      } finally {
        controllerRef.current = null
        setStatus('idle')
      }
    })()
  }, [])

  const stop = useCallback(() => {
    controllerRef.current?.abort()
    controllerRef.current = null
    setStatus('idle')
  }, [])

  const reset = useCallback(() => {
    controllerRef.current?.abort()
    controllerRef.current = null
    setMessages([])
    setStatus('idle')
    setError(null)
  }, [])

  return { messages, status, error, send, stop, reset }
}
