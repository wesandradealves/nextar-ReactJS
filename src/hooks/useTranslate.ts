import { useCallback, useRef } from 'react';

type CacheKey = string;
type TranslationCache = Record<CacheKey, string>;

export function useTranslate(language: string) {
  const cache = useRef<TranslationCache>({});

  const translate = useCallback(async (text: string): Promise<string> => {
    const key = `${language}:${text}`;
    if (cache.current[key]) return cache.current[key];

    const res = await fetch(`/api/translate?text=${encodeURIComponent(text)}&to=${language}`);
    const data = await res.json();
    if (data.translated) cache.current[key] = data.translated;
    return data.translated || text;
  }, [language]);

  return { translate };
}
