import {
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'

import { HealthStatus } from '@/components/HealthStatus'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { InteractiveNebulaShader } from '@/components/ui/liquid-shader'

const features = [
  {
    icon: Sparkles,
    title: 'AI-native workflow',
    description:
      'Build faster with Cursor agents, MCP integrations, and reusable UI from 21st.dev.',
  },
  {
    icon: Layers,
    title: 'Full-stack by design',
    description:
      'React + TypeScript on the front, FastAPI on the back — connected through a typed API client.',
  },
  {
    icon: Zap,
    title: 'Ship without dashboards',
    description:
      'Tools that solve real problems through CLIs, ambient signals, and focused interfaces.',
  },
] as const

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Stack', href: '#stack' },
  { label: 'Status', href: '#status' },
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

        <main className="flex-1">
          <section className="mx-auto max-w-6xl px-6 pb-20 pt-24 md:pt-32">
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/10 text-primary">
                <Sparkles className="size-3" />
                Cursor Meetup 2026
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
                Build tools that feel{' '}
                <span className="bg-gradient-to-r from-sky-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                  impossible
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                A full-stack starter for the meetup — React, Tailwind, shadcn/ui, and a
                liquid nebula shader. No dashboard required.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button size="lg">
                  Explore the stack
                  <ArrowRight />
                </Button>
                <Button variant="outline" size="lg">
                  View API docs
                </Button>
              </div>
            </div>
          </section>

          <section id="features" className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-10 max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight">Why this stack</h2>
              <p className="mt-3 text-muted-foreground">
                Everything you need to prototype, demo, and ship in a single session.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="transition-colors hover:bg-white/[0.07]">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                      <feature.icon className="size-5 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          <section id="stack" className="mx-auto max-w-6xl px-6 py-16">
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2">
                <CardHeader className="p-8">
                  <Badge variant="secondary" className="mb-4 w-fit">
                    <Cpu className="size-3" />
                    Architecture
                  </Badge>
                  <CardTitle className="text-2xl">React + FastAPI</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Vite proxies <code className="rounded bg-white/10 px-1.5 py-0.5 text-foreground">/api</code>{' '}
                    to the Python backend. Components live in{' '}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-foreground">src/components/ui</code>{' '}
                    following the shadcn convention.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center p-8 pt-0 md:pt-8">
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
                    alt="Developer workspace with code on screen"
                    className="aspect-[4/3] w-full rounded-lg object-cover ring-1 ring-white/10"
                    loading="lazy"
                  />
                </CardContent>
              </div>
            </Card>
          </section>

          <section id="status" className="mx-auto max-w-6xl px-6 py-16">
            <Card>
              <CardHeader>
                <CardTitle>System status</CardTitle>
                <CardDescription>
                  Live health check against the FastAPI backend.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HealthStatus />
              </CardContent>
            </Card>
          </section>
        </main>

        <footer className="border-t border-white/10 bg-background/40 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
            <p>Cursor Meetup — built with React, Tailwind &amp; 21st.dev</p>
            <p>FastAPI · Vite · shadcn/ui · Three.js</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
