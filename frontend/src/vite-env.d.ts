/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEON_AUTH_URL: string
  // Base URL of the FastAPI backend. Leave empty when the frontend and backend
  // are served from the same origin (the root vercel.json rewrites /api there).
  readonly VITE_BACKEND_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
