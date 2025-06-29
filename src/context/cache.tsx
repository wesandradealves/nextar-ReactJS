'use client';

import React, { createContext, useContext, useCallback, useRef, useMemo } from 'react';

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
  tags: string[];
}

interface CacheContextType {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, data: T, ttl?: number, tags?: string[]) => void;
  remove: (key: string) => void;
  clear: () => void;
  invalidateByTag: (tag: string) => void;
  has: (key: string) => boolean;
  getStats: () => { size: number; hits: number; misses: number };
}

const CacheContext = createContext<CacheContextType | null>(null);

interface CacheProviderProps {
  children: React.ReactNode;
  defaultTTL?: number;
  maxEntries?: number;
}

export default function CacheProvider({ 
  children, 
  defaultTTL = parseInt(process.env.CACHE_DEFAULT_TTL || '300000'), // 5 minutes
  maxEntries = parseInt(process.env.CACHE_MAX_ENTRIES || '1000')
}: CacheProviderProps) {
  const cache = useRef<Map<string, CacheEntry>>(new Map());
  const stats = useRef({ hits: 0, misses: 0 });

  const isExpired = useCallback((entry: CacheEntry): boolean => {
    return Date.now() - entry.timestamp > entry.ttl;
  }, []);

  const get = useCallback(<T,>(key: string): T | null => {
    const entry = cache.current.get(key);
    
    if (!entry) {
      stats.current.misses++;
      return null;
    }

    if (isExpired(entry)) {
      cache.current.delete(key);
      stats.current.misses++;
      return null;
    }

    stats.current.hits++;
    return entry.data as T;
  }, [isExpired]);

  const set = useCallback(<T,>(
    key: string, 
    data: T, 
    ttl: number = defaultTTL, 
    tags: string[] = []
  ): void => {
    // Remove oldest entries if cache is full
    if (cache.current.size >= maxEntries) {
      const oldestKey = cache.current.keys().next().value;
      if (oldestKey) {
        cache.current.delete(oldestKey);
      }
    }

    cache.current.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      tags
    });
  }, [defaultTTL, maxEntries]);

  const remove = useCallback((key: string): void => {
    cache.current.delete(key);
  }, []);

  const clear = useCallback((): void => {
    cache.current.clear();
    stats.current = { hits: 0, misses: 0 };
  }, []);

  const invalidateByTag = useCallback((tag: string): void => {
    const keysToRemove: string[] = [];
    
    cache.current.forEach((entry, key) => {
      if (entry.tags.includes(tag)) {
        keysToRemove.push(key);
      }
    });

    keysToRemove.forEach(key => cache.current.delete(key));
  }, []);

  const has = useCallback((key: string): boolean => {
    const entry = cache.current.get(key);
    return entry ? !isExpired(entry) : false;
  }, [isExpired]);

  const getStats = useCallback(() => ({
    size: cache.current.size,
    hits: stats.current.hits,
    misses: stats.current.misses
  }), []);

  const value = useMemo(() => ({
    get,
    set,
    remove,
    clear,
    invalidateByTag,
    has,
    getStats
  }), [get, set, remove, clear, invalidateByTag, has, getStats]);

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
}

export const useCache = (): CacheContextType => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};
