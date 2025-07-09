/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_GITHUB_OWNER: string
    readonly VITE_GITHUB_REPO: string
    readonly VITE_GITHUB_TOKEN: string
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_GOOGLE_CLIENT_ID: string
    readonly VITE_GOOGLE_CLIENT_SECRET: string
    readonly PROD: boolean
    readonly DEV: boolean
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      PORT?: string
      DATABASE_URL?: string
      JWT_SECRET?: string
      GOOGLE_CLIENT_ID?: string
      GOOGLE_CLIENT_SECRET?: string
      GITHUB_TOKEN?: string
      SUPABASE_URL?: string
      SUPABASE_ANON_KEY?: string
    }
  }
}

export {} 