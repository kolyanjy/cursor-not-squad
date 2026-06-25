import { useCallback, useEffect, useRef, useState } from 'react'

import { generateActivities } from '@/api/activities'
import { streamAssistantReply, type ChatMessage } from '@/api/chat'
import { USE_MOCK } from '@/api/config'
import type { SwipeCardItem } from '@/components/ui/tinder-like-swipe'

export type ChatStatus = 'idle' | 'thinking' | 'streaming'

export interface UseChatResult {
  messages: ChatMessage[]
  status: ChatStatus
  error: string | null
  /** Cards generated from the conversation; empty until the first reply. */
  activities: SwipeCardItem[]
  /** True while a fresh deck is being generated for the latest message. */
  activitiesLoading: boolean
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
  const [activities, setActivities] = useState<SwipeCardItem[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState(false)

  // Mirror of `messages` so `send` can read the latest history without being
  // re-created on every keystroke-driven render.
  const messagesRef = useRef<ChatMessage[]>(messages)
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const controllerRef = useRef<AbortController | null>(null)
  // Monotonic id so only the most recent deck request can apply its result —
  // the generation call outlives the chat stream and survives reset/stop.
  const activityRequestRef = useRef(0)

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

    // Generate a fresh swipe deck from the same conversation, in parallel with
    // the streamed reply. Skipped in mock mode, where the seed deck is shown.
    if (!USE_MOCK) {
      const requestId = ++activityRequestRef.current
      setActivitiesLoading(true)
      void (async () => {
        try {
          const cards = await generateActivities(history, { signal: controller.signal })
          if (activityRequestRef.current === requestId) setActivities(cards)
        } catch {
          // Non-fatal: keep whatever deck is already on screen.
        } finally {
          if (activityRequestRef.current === requestId) setActivitiesLoading(false)
        }
      })()
    }

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
    activityRequestRef.current++
    setStatus('idle')
    setActivitiesLoading(false)
  }, [])

  const reset = useCallback(() => {
    controllerRef.current?.abort()
    controllerRef.current = null
    activityRequestRef.current++
    setMessages([])
    setStatus('idle')
    setError(null)
    setActivities([])
    setActivitiesLoading(false)
  }, [])

  return { messages, status, error, activities, activitiesLoading, send, stop, reset }
}
