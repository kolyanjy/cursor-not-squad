import Anthropic from '@anthropic-ai/sdk'

/** Always use the latest, most capable Opus model for the concierge. */
export const MODEL = 'claude-opus-4-8'

let client: Anthropic | null = null

/**
 * Lazily build a browser-side Anthropic client (memoised across calls).
 *
 * ⚠️ This talks to the Anthropic API **directly from the browser**, so the key
 * in `VITE_ANTHROPIC_API_KEY` is bundled into the client and visible to anyone
 * who opens the app or inspects network traffic. That is acceptable for a local
 * hackathon demo only — for anything public, proxy these calls through a small
 * backend and keep the key server-side.
 */
export function getAnthropic(): Anthropic {
  if (client) return client

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'Missing VITE_ANTHROPIC_API_KEY — add it to frontend/.env.local and set VITE_USE_MOCK=false.',
    )
  }

  client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  return client
}
