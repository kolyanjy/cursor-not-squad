import type { SwipeCardItem } from '@/components/ui/tinder-like-swipe'
import { activityIcon } from '@/lib/activity-icons'

/**
 * Seed deck of evening activities. The chat is the landing experience; once the
 * concierge turns a vibe into suggestions, these power the swipe deck
 * (Nope / Tonight / Again).
 */
export const eveningActivities: SwipeCardItem[] = [
  {
    id: 'rooftop-jazz',
    title: 'Rooftop Jazz',
    description: 'Live quartet, city lights, and a slow drink as the sun goes down.',
    gradientClassName: 'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-900',
    icon: activityIcon('Music'),
  },
  {
    id: 'wine-tasting',
    title: 'Wine Tasting',
    description: 'Small-batch reds and natural wines with a local sommelier.',
    gradientClassName: 'bg-gradient-to-br from-rose-500 via-red-600 to-rose-900',
    icon: activityIcon('Wine'),
  },
  {
    id: 'night-market',
    title: 'Night Market',
    description: 'Street food stalls, neon signs, and a lazy walk through the lanes.',
    gradientClassName: 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-700',
    icon: activityIcon('ShoppingBag'),
  },
  {
    id: 'moonlight-kayak',
    title: 'Moonlight Kayak',
    description: 'Paddle under the stars with lanterns reflecting on calm water.',
    gradientClassName: 'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800',
    icon: activityIcon('Sailboat'),
  },
  {
    id: 'open-air-cinema',
    title: 'Open-Air Cinema',
    description: 'Blankets, popcorn, and a cult classic projected on a warehouse wall.',
    gradientClassName: 'bg-gradient-to-br from-fuchsia-500 via-purple-600 to-violet-900',
    icon: activityIcon('Film'),
  },
  {
    id: 'salsa-night',
    title: 'Salsa Night',
    description: 'Beginner lesson at 8, then dance until the DJ calls last song.',
    gradientClassName: 'bg-gradient-to-br from-orange-500 via-red-500 to-rose-800',
    icon: activityIcon('PartyPopper'),
  },
  {
    id: 'stargazing',
    title: 'Stargazing Picnic',
    description: 'Thermos tea, constellations app, and a quiet hill away from the glow.',
    gradientClassName: 'bg-gradient-to-br from-slate-600 via-indigo-700 to-slate-900',
    icon: activityIcon('Telescope'),
  },
  {
    id: 'cocktail-crawl',
    title: 'Cocktail Crawl',
    description: 'Three speakeasies, one signature drink each — no rush between stops.',
    gradientClassName: 'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-900',
    icon: activityIcon('Martini'),
  },
  {
    id: 'ramen-run',
    title: 'Late-Night Ramen',
    description: 'The spot that only opens after midnight. Rich broth, extra noodles.',
    gradientClassName: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-700',
    icon: activityIcon('Soup'),
  },
  {
    id: 'vinyl-bar',
    title: 'Vinyl & Vibes',
    description: 'Crates of records, whiskey sours, and whoever picks the next side.',
    gradientClassName: 'bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-900',
    icon: activityIcon('Disc3'),
  },
]
