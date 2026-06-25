/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** When not `'false'`, the app runs fully client-side with no backend. */
  readonly VITE_USE_MOCK?: string
  /** Base URL for the REST backend (used when mock mode is off). */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
