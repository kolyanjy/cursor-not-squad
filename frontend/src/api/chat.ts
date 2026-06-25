export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const API_BASE = import.meta.env.VITE_API_URL ?? ''

export interface StreamReplyOptions {
  signal?: AbortSignal
}

/**
 * Streams the assistant's reply as a sequence of text chunks.
 *
 * In mock mode (the default — the app ships without a backend) it fabricates a
 * contextual concierge reply with a realistic "thinking" pause followed by
 * token-by-token streaming. When a real backend is wired up
 * (`VITE_USE_MOCK=false`) it reads a streamed text response from `POST /chat`.
 */
export async function* streamAssistantReply(
  history: ChatMessage[],
  options: StreamReplyOptions = {},
): AsyncGenerator<string, void, unknown> {
  if (USE_MOCK) {
    yield* streamMockReply(history, options.signal)
    return
  }

  yield* streamBackendReply(history, options.signal)
}

// --- Mock -------------------------------------------------------------------

const DEFAULT_REPLY = `Love that. Give me a second to read the room…

Here's where my head's at:

• Catch the late showing of something you'd never pick alone
• Walk somewhere new with one good playlist and zero plan
• Hunt down a dish you can't pronounce

Want me to turn a vibe into cards you can swipe through — Nope, Tonight, or Again?`

const MOCK_REPLIES: ReadonlyArray<{ match: RegExp; reply: string }> = [
  {
    match: /chill|relax|quiet|cozy|cosy|home|tired|low.?key|calm|rest/i,
    reply: `A slow night in — say no more.

• A slow-burn film with takeout from that spot you keep meaning to try
• A bath-and-book reset with your phone in another room
• A two-player board game if you've got company

Want me to line these up as cards you can swipe through?`,
  },
  {
    match: /friend|group|social|party|out|crowd|people|hang/i,
    reply: `Out with the crew it is. A few I'd put in rotation:

• A dive bar with a back-room pool table
• Trivia night — loud, dumb, competitive in the best way
• Late-night street food crawl, no reservations needed

Should I drop these into the swipe deck?`,
  },
  {
    match: /date|romantic|partner|girlfriend|boyfriend|crush|love/i,
    reply: `Date night — let's make it feel deliberate.

• Rooftop drinks somewhere with a skyline
• A tiny pasta place with one waiter and no menu
• A gallery-then-wine wander through the old quarter

Want me to turn these into cards you can swipe on together?`,
  },
  {
    match: /food|eat|dinner|hungry|restaurant|cuisine|meal|taste/i,
    reply: `Now we're talking. Going by appetite, not algorithms:

• Something spicy enough to make you talk about it tomorrow
• A natural-wine bar with small plates you split
• Dessert first — find the city's best slice and build a night around it

Shall I plate these up as swipeable cards?`,
  },
  {
    match: /active|sport|energy|adventure|walk|run|move|outdoor|gym/i,
    reply: `Got energy to burn — let's spend it.

• A sunset run along the water, nowhere to be after
• Climbing gym, beginners welcome, bruises optional
• A long aimless city walk with a destination snack

Want these as cards to swipe through?`,
  },
  {
    match: /surprise|random|anything|whatever|dunno|don.?t know|idk|undecided/i,
    reply: `Decision fatigue — I've got you. Here's a wildcard set:

• Say yes to the first thing on the deck, no take-backs
• A spot two neighbourhoods over you've never had a reason to visit
• Whatever's open latest within a short walk

Deal me in — want me to start the swipe deck?`,
  },
] as const

function pickMockReply(history: ChatMessage[]): string {
  const lastUser = [...history].reverse().find((message) => message.role === 'user')
  const text = lastUser?.content ?? ''
  return MOCK_REPLIES.find((entry) => entry.match.test(text))?.reply ?? DEFAULT_REPLY
}

async function* streamMockReply(
  history: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string, void, unknown> {
  // The "thinking" pause the UI shows before the first token lands.
  await delay(650 + Math.random() * 650, signal)

  const reply = pickMockReply(history)
  // Stream word-by-word (keeping trailing whitespace) for a natural cadence.
  const tokens = reply.match(/\S+\s*/g) ?? [reply]

  for (const token of tokens) {
    await delay(16 + Math.random() * 46, signal)
    yield token
  }
}

// --- Backend (used when VITE_USE_MOCK=false) --------------------------------

async function* streamBackendReply(
  history: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string, void, unknown> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: history.map(({ role, content }) => ({ role, content })),
    }),
    signal,
  })

  if (!response.ok || !response.body) {
    throw new Error(`Chat request failed: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      if (chunk) yield chunk
    }
  } finally {
    reader.releaseLock()
  }
}

// --- Helpers ----------------------------------------------------------------

class AbortError extends Error {
  constructor() {
    super('Aborted')
    this.name = 'AbortError'
  }
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new AbortError())
      return
    }

    const onAbort = () => {
      clearTimeout(timer)
      reject(new AbortError())
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)

    signal?.addEventListener('abort', onAbort, { once: true })
  })
}
