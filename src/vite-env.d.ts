/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YOUTUBE_VIDEO_ID: string
  readonly VITE_CALENDLY_URL: string
  readonly VITE_BREVO_API_URL: string
  readonly VITE_META_PIXEL_ID?: string
  readonly VITE_GA_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}