"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useCache } from '@/context/cache';
import { useToast } from '@/hooks/useToast';
import type { 
  Setor, 
  PaginatedQuery, 
  SetorFilters,
  CreateSetorData,
  UpdateSetorData
} from '@/types';
import { CATEGORIAS_CIENTIFICAS } from '@/utils/enums';

/**
 * Configuração padrão para paginação
 */
const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10
};

/**
 * Configuração padrão para ordenação
 */
const DEFAULT_SORTING = {
  sortBy: 'nome',
  sortOrder: 'asc' as const
};

/**
 * Hook personalizado para gerenciar setores
 * Integrado com cache multicamadas e API
 * Suporte a paginação, busca, filtros e ordenação
 * 
 * @example
 * ```tsx
 * const {
 *   setores,
 *   pagination,
 *   loading,
 *   error,
 *   searchTerm,
 *   filters,
 *   sorting,
 *   handlePageChange,
 *   handleSearch,
 *   handleFilterChange,
 *   handleSortChange,
 *   createSetor,
 *   updateSetor,
 *   deleteSetor,
 *   refresh
 * } = useSetores();
 * ```
 */
export const useSetores = () => {
  // Estados locais
  const [query, setQuery] = useState<PaginatedQuery>({
    ...DEFAULT_PAGINATION,
    ...DEFAULT_SORTING
  });
  const [filters, setFilters] = useState<SetorFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<Setor[]>([]);
  const [allSetores, setAllSetores] = useState<Setor[]>([]); // Todos os setores para estatísticas
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiPagination, setApiPagination] = useState<{
    total: number;
    totalPages: number;
  } | null>(null);

  // Cache context
  const cache = useCache();
  
  // Toast helpers
  const toast = useToast();

  /**
   * Constrói parâmetros da query para a API
   */
  const buildQueryParams = useCallback((customQuery?: Partial<PaginatedQuery>, customFilters?: SetorFilters) => {
    const currentQuery = { ...query, ...customQuery };
    const currentFilters = { ...filters, ...customFilters };
    
    const params: Record<string, string> = {
      page: String(currentQuery.page || 1),
      limit: String(currentQuery.limit || 10)
    };

    if (currentQuery.sortBy) {
      params.sortBy = currentQuery.sortBy;
      params.sortOrder = currentQuery.sortOrder || 'asc';
    }

    const searchValue = currentQuery.search || searchTerm;
    if (searchValue && searchValue.trim()) {
      params.search = searchValue;
    }

    // Filtros específicos
    if (currentFilters.categoria) {
      params.categoria = currentFilters.categoria;
    }

    if (currentFilters.ativo !== undefined) {
      params.ativo = String(currentFilters.ativo);
    }

    return params;
  }, [query, filters, searchTerm]);

  /**
   * Carrega setores da API
   */
  const fetchSetores = useCallback(async (customQuery?: Partial<PaginatedQuery>, customFilters?: SetorFilters) => {
    try {
      setLoading(true);
      setError(null);

      const params = buildQueryParams(customQuery, customFilters);
      const queryString = new URLSearchParams(params).toString();
      const cacheKey = `setores_${queryString}`;

      // Verificar cache primeiro
      const cachedData = cache.get<{
        data: Setor[];
        pagination: { total: number; totalPages: number };
      }>(cacheKey);

      if (cachedData) {
        setData(cachedData.data);
        setApiPagination(cachedData.pagination);
        setLoading(false);
        return cachedData.data;
      }

      // Fazer requisição para API
      const response = await fetch(`/api/setores?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      setData(result.data || []);
      setApiPagination(result.pagination || { total: 0, totalPages: 0 });

      // Armazenar no cache por 5 minutos
      cache.set(cacheKey, {
        data: result.data || [],
        pagination: result.pagination || { total: 0, totalPages: 0 }
      }, 5 * 60 * 1000, ['setores']);

      return result.data || [];

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar setores';
      setError(errorMessage);
      toast.error(`Erro ao carregar setores: ${errorMessage}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams, cache, toast]);

  /**
   * Carrega todos os setores para estatísticas
   */
  const fetchAllSetores = useCallback(async () => {
    try {
      const cacheKey = 'all_setores';
      const cachedData = cache.get<Setor[]>(cacheKey);

      if (cachedData) {
        setAllSetores(cachedData);
        return cachedData;
      }

      const response = await fetch('/api/setores?all=true');
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const allData = result.data || [];
      
      setAllSetores(allData);
      cache.set(cacheKey, allData, 5 * 60 * 1000, ['setores']);

      return allData;
    } catch (err) {
      console.error('Erro ao carregar todos os setores:', err);
      return [];
    }
  }, [cache]);

  /**
   * Cria um novo setor
   */
  const createSetor = useCallback(async (setorData: CreateSetorData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/setores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setorData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }

      const newSetor = await response.json();

      // Limpar cache relacionado
      cache.invalidateByTag('setores');

      // Recarregar dados
      await Promise.all([
        fetchSetores(),
        fetchAllSetores()
      ]);

      toast.success('Setor criado com sucesso!');
      return newSetor;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao criar setor';
      setError(errorMessage);
      toast.error(`Erro ao criar setor: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cache, fetchSetores, fetchAllSetores, toast]);

  /**
   * Atualiza um setor existente
   */
  const updateSetor = useCallback(async (setorId: string, setorData: UpdateSetorData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/setores/${setorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setorData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }

      const updatedSetor = await response.json();

      // Limpar cache relacionado
      cache.invalidateByTag('setores');

      // Recarregar dados
      await Promise.all([
        fetchSetores(),
        fetchAllSetores()
      ]);

      toast.success('Setor atualizado com sucesso!');
      return updatedSetor;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao atualizar setor';
      setError(errorMessage);
      toast.error(`Erro ao atualizar setor: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cache, fetchSetores, fetchAllSetores, toast]);

  /**
   * Exclui um setor
   */
  const deleteSetor = useCallback(async (setorId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/setores/${setorId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }

      // Limpar cache relacionado
      cache.invalidateByTag('setores');

      // Recarregar dados
      await Promise.all([
        fetchSetores(),
        fetchAllSetores()
      ]);

      toast.success('Setor excluído com sucesso!');
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao excluir setor';
      setError(errorMessage);
      toast.error(`Erro ao excluir setor: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cache, fetchSetores, fetchAllSetores, toast]);

  /**
   * Manipula mudança de página
   */
  const handlePageChange = useCallback((page: number) => {
    setQuery(prev => ({ ...prev, page }));
  }, []);

  /**
   * Manipula busca/pesquisa
   */
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setQuery(prev => ({ ...prev, page: 1, search: term }));
  }, []);

  /**
   * Manipula mudança de ordenação
   */
  const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setQuery(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
  }, []);

  /**
   * Filtra por categoria
   */
  const filterByCategoria = useCallback((categoria?: string) => {
    setFilters(prev => ({ ...prev, categoria }));
    setQuery(prev => ({ ...prev, page: 1 }));
  }, []);

  /**
   * Filtra por status ativo/inativo
   */
  const filterByStatus = useCallback((ativo?: boolean) => {
    setFilters(prev => ({ ...prev, ativo }));
    setQuery(prev => ({ ...prev, page: 1 }));
  }, []);

  /**
   * Limpa todos os filtros
   */
  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
    setQuery({ ...DEFAULT_PAGINATION, ...DEFAULT_SORTING });
  }, []);

  /**
   * Recarrega dados manualmente
   */
  const refresh = useCallback(() => {
    cache.invalidateByTag('setores');
    return Promise.all([
      fetchSetores(),
      fetchAllSetores()
    ]);
  }, [cache, fetchSetores, fetchAllSetores]);

  // Carregar dados na inicialização e quando query/filtros mudarem
  useEffect(() => {
    fetchSetores();
  }, [fetchSetores]);

  useEffect(() => {
    fetchAllSetores();
  }, [fetchAllSetores]);

  /**
   * Estatísticas calculadas
   */
  const setorStats = useMemo(() => {
    const total = allSetores.length;
    const ativos = allSetores.filter(setor => setor.ativo).length;
    const inativos = total - ativos;

    // Contagem por categoria
    const categoriaStats: Record<string, number> = {};
    CATEGORIAS_CIENTIFICAS.forEach(categoria => {
      categoriaStats[categoria] = allSetores.filter(setor => setor.categoria === categoria).length;
    });

    return {
      total,
      ativos,
      inativos,
      ...categoriaStats
    };
  }, [allSetores]);

  /**
   * Informações de paginação calculadas
   */
  const pagination = useMemo(() => {
    const currentPage = query.page || 1;
    const itemsPerPage = query.limit || 10;
    
    if (!apiPagination) {
      return {
        page: currentPage,
        limit: itemsPerPage,
        total: data.length,
        totalPages: 1
      };
    }

    return {
      page: currentPage,
      limit: itemsPerPage,
      total: apiPagination.total,
      totalPages: apiPagination.totalPages
    };
  }, [query, apiPagination, data.length]);

  /**
   * Informações de ordenação atuais
   */
  const sorting = useMemo(() => ({
    sortBy: query.sortBy || 'nome',
    sortOrder: query.sortOrder || 'asc'
  }), [query.sortBy, query.sortOrder]);

  return {
    // Dados
    setores: data,
    allSetores,
    setorStats,
    
    // Estados
    loading,
    error,
    searchTerm,
    filters,
    pagination,
    sorting,
    
    // Ações
    handlePageChange,
    handleSearch,
    handleSortChange,
    filterByCategoria,
    filterByStatus,
    clearFilters,
    createSetor,
    updateSetor,
    deleteSetor,
    refresh
  };
};
