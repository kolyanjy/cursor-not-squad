import { ArrowRight, Heart, Terminal, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SwipeableCardStack } from '@/components/ui/tinder-like-swipe'
import { InteractiveNebulaShader } from '@/components/ui/liquid-shader'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Stack', href: '#stack' },
  { label: 'Status', href: '#status' },
] as const

const swipeCards = [
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1170&q=80',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=735&q=80',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=662&q=80',
] as const

export function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <InteractiveNebulaShader disableCenterDimming className="-z-10" />

      <div className="pointer-events-none absolute inset-0 -z-[9] bg-gradient-to-b from-background/20 via-background/60 to-background" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-background/40 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex size-8 items-center justify-center rounded-lg border border-white/15 bg-white/10">
                <Terminal className="size-4 text-primary" />
              </span>
              Cursor Meetup
            </a>

            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Docs
              </Button>
              <Button size="sm">
                Get started
                <ArrowRight />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="relative h-[min(70vh,32rem)] w-64 sm:w-72">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-[1.35rem] bg-gradient-to-b from-white/25 via-white/10 to-white/5 opacity-60"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-primary/20 blur-3xl"
            />

            <SwipeableCardStack
              images={[...swipeCards]}
              borderRadius={20}
              rightIcon={<Heart className="size-20 text-emerald-400 drop-shadow-lg" strokeWidth={1.5} />}
              leftIcon={<X className="size-20 text-red-400 drop-shadow-lg" strokeWidth={1.5} />}
              className="relative z-10"
            />
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
