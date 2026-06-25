import { Heart, Sparkles, SquarePen, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import { AIChat } from '@/components/AIChat'
import { Button } from '@/components/ui/button'
import { InteractiveNebulaShader } from '@/components/ui/liquid-shader'
import {
  SwipeableCardStack,
  type SwipeableCardStackHandle,
  type SwipeCardItem,
} from '@/components/ui/tinder-like-swipe'
import { eveningActivities } from '@/data/activities'
import { useChat } from '@/hooks/useChat'

export function HomePage() {
  const { messages, status, error, activities, activitiesLoading, send, stop, reset } = useChat()
  const cardStackRef = useRef<SwipeableCardStackHandle>(null)
  const [tonight, setTonight] = useState<SwipeCardItem[]>([])
  const hasConversation = messages.length > 0
  // Show the AI-generated deck once it exists; until then, the seed deck.
  const deck = activities.length > 0 ? activities : eveningActivities

  const handleSwipe = useCallback((item: SwipeCardItem, direction: 'left' | 'right') => {
    if (direction !== 'right') return
    setTonight((prev) => (prev.some((p) => p.id === item.id) ? prev : [...prev, item]))
  }, [])

  const removeFromTonight = useCallback((id: string) => {
    setTonight((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const handleNewChat = useCallback(() => {
    reset()
    setTonight([])
  }, [reset])

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <InteractiveNebulaShader disableCenterDimming className="-z-10" />

      <div className="pointer-events-none absolute inset-0 -z-[9] bg-gradient-to-b from-background/20 via-background/60 to-background" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 shrink-0 border-b border-white/10 bg-background/40 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4 sm:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex size-8 items-center justify-center rounded-lg border border-white/15 bg-white/10">
                <Sparkles className="size-4 text-primary" />
              </span>
              TonightPick
            </a>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewChat}
              disabled={!hasConversation}
              className="gap-1.5"
            >
              <SquarePen />
              New chat
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center gap-12 px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex h-[68vh] max-h-[680px] min-h-[460px] w-full max-w-2xl flex-col">
            <AIChat
              messages={messages}
              status={status}
              error={error}
              onSend={send}
              onStop={stop}
            />
          </div>

          <section className="flex flex-col items-center gap-8">
            <div className="relative h-[min(70vh,34rem)] w-[min(100%,18rem)] sm:w-80 md:w-[22rem]">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-[1.35rem] bg-gradient-to-b from-white/25 via-white/10 to-white/5 opacity-60"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-primary/20 blur-3xl"
              />

              <SwipeableCardStack
                ref={cardStackRef}
                items={deck}
                borderRadius={20}
                rightIcon={<Heart className="size-20 text-emerald-400 drop-shadow-lg" strokeWidth={1.5} />}
                leftIcon={<X className="size-20 text-red-400 drop-shadow-lg" strokeWidth={1.5} />}
                className="relative z-10"
                onSwipe={handleSwipe}
              />

              {activitiesLoading ? (
                <div className="pointer-events-none absolute inset-x-0 -bottom-7 z-20 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="size-3.5 animate-pulse text-primary" />
                  Lining up tonight&apos;s picks…
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => cardStackRef.current?.swipeTop('right')}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-6 text-sm font-medium text-foreground shadow-[0_8px_20px_rgba(0,0,0,0.25)] backdrop-blur-2xl backdrop-saturate-150 transition-colors hover:bg-white/[0.12] active:scale-[0.98]"
            >
              <Heart className="size-4 shrink-0 text-emerald-400" strokeWidth={2} />
              Tonight
            </button>

            {tonight.length > 0 ? (
              <div className="w-full max-w-sm">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Heart className="size-4 text-emerald-400" strokeWidth={2} />
                  Tonight
                  <span className="text-muted-foreground/60">· {tonight.length}</span>
                </h2>

                <ul className="flex flex-col gap-2">
                  {tonight.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm"
                    >
                      <Heart
                        className="mt-0.5 size-4 shrink-0 text-emerald-400"
                        strokeWidth={2}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromTonight(item.id)}
                        aria-label={`Remove ${item.title} from Tonight`}
                        className="-mr-1 flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-white/10 hover:text-foreground"
                      >
                        <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        </main>
      </div>
    </div>
  )
}
