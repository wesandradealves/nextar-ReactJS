declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    CACHE_DEBUG: 'true' | 'false';
    CACHE_DEFAULT_TTL: string;
    CACHE_MAX_ENTRIES: string;
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_APP_VERSION: string;
  }
}
