# UI specification

The Cursor Meetup frontend is a dark, glassmorphism-styled **landing page** built with React 19, Tailwind CSS 4, and shadcn-style primitives. This document describes the current UI and its design tokens.

---

## Design language

1. **Dark, deep background** — a near-black blue (oklch) base with an animated nebula/liquid shader.
2. **Glassmorphism** — translucent surfaces with blur, subtle gradients, and soft glows.
3. **Minimal chrome** — sticky header, centered hero, slim footer.
4. **Token-driven** — colors are CSS custom properties (oklch) consumed through Tailwind theme classes.

---

## Color tokens

Defined as CSS variables in [`frontend/src/index.css`](../../frontend/src/index.css) and used via Tailwind (`bg-background`, `text-foreground`, `text-primary`, …).

| Token | Value (oklch) | Usage |
|-------|---------------|-------|
| `--background` | `0.12 0.02 265` | Page background (deep blue-black) |
| `--foreground` | `0.98 0.01 265` | Primary text |
| `--card` | `0.16 0.02 265` | Card surface |
| `--primary` | `0.72 0.14 230` | Accent (CTA, icon highlight, ring) |
| `--muted-foreground` | `0.68 0.02 265` | Secondary text, nav links |
| `--destructive` | `0.55 0.2 25` | Error states |
| `--border` | `white / 12%` | Hairline borders |
| `--radius` | `0.75rem` | Base corner radius |

A `dark` custom variant is declared, and surfaces frequently use `white/5`–`white/25` overlays for the glass effect.

---

## Layout

The page is a full-height flex column ([`HomePage.tsx`](../../frontend/src/components/HomePage.tsx)):

```
┌───────────────────────────────────────────────┐
│  Header (sticky, blurred)                      │
│  [▣ Cursor Meetup]   Features Stack Status     │
│                          [Docs] [Get started →]│
├───────────────────────────────────────────────┤
│                                                │
│              ╭───────────────╮                 │
│              │  glass card    │   ← hero       │
│              │  (nebula glow) │                 │
│              ╰───────────────╯                 │
│                                                │
├───────────────────────────────────────────────┤
│        UA Dev Team · Cursor Meetup 2026        │
└───────────────────────────────────────────────┘
        InteractiveNebulaShader (-z-10 background)
```

| Region | Details |
|--------|---------|
| **Background** | `InteractiveNebulaShader` (three.js) behind everything, plus a top-to-bottom background gradient overlay |
| **Header** | Sticky, `backdrop-blur`, brand with `Terminal` icon, nav links (`Features`, `Stack`, `Status`), `Docs` ghost button, `Get started` primary button with `ArrowRight` |
| **Hero** | Centered glass `Card` (~`w-64`–`w-72`, `h-[min(70vh,32rem)]`) with gradient borders and a primary-colored blur glow |
| **Footer** | Slim, blurred, centered credit line |

---

## Components

| Component | Responsibility |
|-----------|----------------|
| `HomePage` | Full landing layout (header, hero, footer, shader) |
| `ui/button` | CVA-based button (variants: default, ghost; sizes) |
| `ui/card` | Surface primitive used for the hero |
| `ui/badge` | Status/label pill |
| `ui/liquid-shader` | `InteractiveNebulaShader` three.js background |
| `HealthStatus` | Async API status indicator (loading / success / error). Built and ready, but not currently mounted in `HomePage` |

Primitives follow the shadcn "new-york" style (`components.json`); icons come from `lucide-react`.

---

## Conventions

- Compose conditional classes with `cn()` from [`@/lib/utils`](../../frontend/src/lib/utils.ts).
- Prefer theme tokens (`bg-background`, `text-muted-foreground`) over hardcoded colors.
- Decorative layers use `aria-hidden` and `pointer-events-none`.

---

## Related documentation

- [Frontend development](../development/frontend.md)
- [Product overview](../product/overview.md)
- [Architecture overview](../architecture/overview.md)
