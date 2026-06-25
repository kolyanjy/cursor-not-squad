/**
 * Single source of truth for client-side runtime flags.
 *
 * When `VITE_USE_MOCK` is anything other than `'false'`, the app runs fully
 * client-side with canned responses and makes no Anthropic calls. Set
 * `VITE_USE_MOCK=false` (and provide `VITE_ANTHROPIC_API_KEY`) to talk to Claude.
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
