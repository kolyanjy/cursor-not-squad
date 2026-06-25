import type { SwipeCardItem } from '@/components/ui/tinder-like-swipe'

import { MODEL, getAnthropic } from '@/api/anthropic'
import type { ChatMessage } from '@/api/chat'
import { ACTIVITIES_SYSTEM } from '@/api/prompts'
import { ACTIVITY_ICON_NAMES, activityIcon } from '@/lib/activity-icons'

/** Card gradients reused from the seed deck, cycled across generated cards. */
const CARD_GRADIENTS = [
  'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-900',
  'bg-gradient-to-br from-rose-500 via-red-600 to-rose-900',
  'bg-gradient-to-br from-amber-400 via-orange-500 to-red-700',
  'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800',
  'bg-gradient-to-br from-fuchsia-500 via-purple-600 to-violet-900',
  'bg-gradient-to-br from-orange-500 via-red-500 to-rose-800',
  'bg-gradient-to-br from-slate-600 via-indigo-700 to-slate-900',
  'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-900',
  'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-700',
  'bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-900',
]

// Structured-output schema: the first text block is then guaranteed-parseable
// JSON. The "exactly 10" count lives in the prompt (array length constraints
// aren't enforced by structured outputs) and is clamped below.
const ACTIVITIES_SCHEMA: Record<string, unknown> = {
  type: 'object',
  properties: {
    activities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          icon: { type: 'string', enum: ACTIVITY_ICON_NAMES },
        },
        required: ['title', 'description', 'icon'],
        additionalProperties: false,
      },
    },
  },
  required: ['activities'],
  additionalProperties: false,
}

interface RawActivity {
  title: string
  description: string
  icon?: string
}

export interface GenerateActivitiesOptions {
  signal?: AbortSignal
}

/**
 * Turn the conversation so far into up to 10 swipeable evening activities,
 * tailored to the user's vibe via {@link ACTIVITIES_SYSTEM}.
 */
export async function generateActivities(
  history: ChatMessage[],
  options: GenerateActivitiesOptions = {},
): Promise<SwipeCardItem[]> {
  const response = await getAnthropic().messages.create(
    {
      model: MODEL,
      max_tokens: 2048,
      system: ACTIVITIES_SYSTEM,
      messages: history.map(({ role, content }) => ({ role, content })),
      output_config: {
        format: { type: 'json_schema', schema: ACTIVITIES_SCHEMA },
      },
    },
    { signal: options.signal },
  )

  const text = response.content.find((block) => block.type === 'text')?.text
  if (!text) throw new Error('Claude returned no activities')

  const parsed = JSON.parse(text) as { activities?: RawActivity[] }
  const activities = (parsed.activities ?? [])
    .filter((activity) => activity?.title && activity?.description)
    .slice(0, 10)

  return activities.map((activity, index) => ({
    id: `${slugify(activity.title)}-${index}`,
    title: activity.title.trim(),
    description: activity.description.trim(),
    gradientClassName: CARD_GRADIENTS[index % CARD_GRADIENTS.length],
    icon: activityIcon(activity.icon),
  }))
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'activity'
  )
}
