import { useCallback, useState, useEffect } from 'react';
import { useCache } from '../context/cache';

export interface UseApiOptions {
  cacheKey?: string;
  ttl?: number;
  tags?: string[];
  skipCache?: boolean;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

export const useApi = <T,>(
  fetcher: () => Promise<T>,
  options: UseApiOptions = {}
) => {
  const cache = useCache();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    cacheKey,
    ttl = 5 * 60 * 1000, // 5 minutes
    tags = [],
    skipCache = false
  } = options;

  const fetchData = useCallback(async (): Promise<T> => {
    // Check cache first
    if (cacheKey && !skipCache) {
      const cachedData = cache.get<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    // Fetch fresh data
    const freshData = await fetcher();

    // Cache the result
    if (cacheKey && !skipCache) {
      cache.set(cacheKey, freshData, ttl, tags);
    }

    return freshData;
  }, [fetcher, cache, cacheKey, skipCache, ttl, tags]);

  const execute = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const result = await fetchData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchData, loading]);

  const clearCache = useCallback(() => {
    if (cacheKey) {
      cache.remove(cacheKey);
    }
  }, [cache, cacheKey]);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    data,
    loading,
    error,
    refetch: execute,
    clearCache
  };
};

export const useChamados = () => {
  return useApi(
    async () => {
      const response = await fetch('/api/chamados');
      if (!response.ok) throw new Error('Failed to fetch chamados');
      return response.json();
    },
    {
      cacheKey: 'chamados',
      ttl: 10 * 60 * 1000, // 10 minutes
      tags: ['chamados', 'tickets']
    }
  );
};

export const useUsuarios = () => {
  return useApi(
    async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    {
      cacheKey: 'users',
      ttl: 15 * 60 * 1000, // 15 minutes
      tags: ['users', 'auth']
    }
  );
};

export const useEquipamentos = () => {
  return useApi(
    async () => {
      const response = await fetch('/api/equipamentos');
      if (!response.ok) throw new Error('Failed to fetch equipamentos');
      return response.json();
    },
    {
      cacheKey: 'equipamentos',
      ttl: 30 * 60 * 1000, // 30 minutes
      tags: ['equipamentos', 'assets']
    }
  );
};

export const useSetores = () => {
  return useApi(
    async () => {
      const response = await fetch('/api/setores');
      if (!response.ok) throw new Error('Failed to fetch setores');
      return response.json();
    },
    {
      cacheKey: 'setores',
      ttl: 60 * 60 * 1000, // 1 hour
      tags: ['setores', 'departments']
    }
  );
};

export const useDashboard = () => {
  return useApi(
    async () => {
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json();
    },
    {
      cacheKey: 'dashboard',
      ttl: 2 * 60 * 1000, // 2 minutes
      tags: ['dashboard', 'stats']
    }
  );
};
