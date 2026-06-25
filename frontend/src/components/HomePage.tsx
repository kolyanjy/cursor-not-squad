import { Heart, Terminal, X } from 'lucide-react'
import { useRef } from 'react'

import {
  SwipeableCardStack,
  type SwipeableCardStackHandle,
  type SwipeCardItem,
} from '@/components/ui/tinder-like-swipe'
import { InteractiveNebulaShader } from '@/components/ui/liquid-shader'

const eveningActivities: SwipeCardItem[] = [
  {
    id: 'rooftop-jazz',
    title: 'Rooftop Jazz',
    description: 'Live quartet, city lights, and a slow drink as the sun goes down.',
    gradientClassName: 'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-900',
  },
  {
    id: 'wine-tasting',
    title: 'Wine Tasting',
    description: 'Small-batch reds and natural wines with a local sommelier.',
    gradientClassName: 'bg-gradient-to-br from-rose-500 via-red-600 to-rose-900',
  },
  {
    id: 'night-market',
    title: 'Night Market',
    description: 'Street food stalls, neon signs, and a lazy walk through the lanes.',
    gradientClassName: 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-700',
  },
  {
    id: 'moonlight-kayak',
    title: 'Moonlight Kayak',
    description: 'Paddle under the stars with lanterns reflecting on calm water.',
    gradientClassName: 'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800',
  },
  {
    id: 'open-air-cinema',
    title: 'Open-Air Cinema',
    description: 'Blankets, popcorn, and a cult classic projected on a warehouse wall.',
    gradientClassName: 'bg-gradient-to-br from-fuchsia-500 via-purple-600 to-violet-900',
  },
  {
    id: 'salsa-night',
    title: 'Salsa Night',
    description: 'Beginner lesson at 8, then dance until the DJ calls last song.',
    gradientClassName: 'bg-gradient-to-br from-orange-500 via-red-500 to-rose-800',
  },
  {
    id: 'stargazing',
    title: 'Stargazing Picnic',
    description: 'Thermos tea, constellations app, and a quiet hill away from the glow.',
    gradientClassName: 'bg-gradient-to-br from-slate-600 via-indigo-700 to-slate-900',
  },
  {
    id: 'cocktail-crawl',
    title: 'Cocktail Crawl',
    description: 'Three speakeasies, one signature drink each — no rush between stops.',
    gradientClassName: 'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-900',
  },
  {
    id: 'ramen-run',
    title: 'Late-Night Ramen',
    description: 'The spot that only opens after midnight. Rich broth, extra noodles.',
    gradientClassName: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-700',
  },
  {
    id: 'vinyl-bar',
    title: 'Vinyl & Vibes',
    description: 'Crates of records, whiskey sours, and whoever picks the next side.',
    gradientClassName: 'bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-900',
  },
]

export function HomePage() {
  const cardStackRef = useRef<SwipeableCardStackHandle>(null)

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <InteractiveNebulaShader disableCenterDimming className="-z-10" />

      <div className="pointer-events-none absolute inset-0 -z-[9] bg-gradient-to-b from-background/20 via-background/60 to-background" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-background/40 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
            <a href="/" className="flex items-center">
              <span className="flex size-8 items-center justify-center rounded-lg border border-white/15 bg-white/10">
                <Terminal className="size-4 text-primary" />
              </span>
            </a>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="flex flex-col items-center gap-8">
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
                items={eveningActivities}
                borderRadius={20}
                rightIcon={<Heart className="size-20 text-emerald-400 drop-shadow-lg" strokeWidth={1.5} />}
                leftIcon={<X className="size-20 text-red-400 drop-shadow-lg" strokeWidth={1.5} />}
                className="relative z-10"
              />
            </div>

            <button
              type="button"
              onClick={() => cardStackRef.current?.swipeTop('right')}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-6 text-sm font-medium text-foreground shadow-[0_8px_20px_rgba(0,0,0,0.25)] backdrop-blur-2xl backdrop-saturate-150 transition-colors hover:bg-white/[0.12] active:scale-[0.98]"
            >
              <Heart className="size-4 shrink-0 text-emerald-400" strokeWidth={2} />
              Tonight
            </button>
          </div>
        </main>

        <footer className="border-t border-white/10 bg-background/40 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl justify-center px-6 py-8 text-sm text-muted-foreground">
            <p>UA Dev Team · Cursor Meetup 2026</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
