/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_BASE: string;
  // Add other environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
