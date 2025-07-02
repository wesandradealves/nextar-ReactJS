"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useCache } from '@/context/cache';
import { useToast } from '@/hooks/useToast';
import type { 
  Equipamento, 
  PaginatedQuery, 
  EquipamentoFilters,
  CreateEquipamentoData,
  UpdateEquipamentoData
} from '@/types';

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
 * Hook personalizado para gerenciar equipamentos
 * Integrado com cache multicamadas e API
 * Suporte a paginação, busca, filtros e ordenação
 * 
 * @example
 * ```tsx
 * const {
 *   equipamentos,
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
 *   createEquipamento,
 *   updateEquipamento,
 *   deleteEquipamento,
 *   refresh
 * } = useEquipamentos();
 * ```
 */
export const useEquipamentos = () => {
  // Estados locais
  const [query, setQuery] = useState<PaginatedQuery>({
    ...DEFAULT_PAGINATION,
    ...DEFAULT_SORTING
  });
  const [filters, setFilters] = useState<EquipamentoFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<Equipamento[]>([]);
  const [allEquipamentos, setAllEquipamentos] = useState<Equipamento[]>([]); // Todos os equipamentos para estatísticas
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
  const buildQueryParams = useCallback((customQuery?: Partial<PaginatedQuery>, customFilters?: EquipamentoFilters) => {
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
    if (currentFilters.setorId) {
      params.setorId = currentFilters.setorId;
    }

    if (currentFilters.ativo !== undefined) {
      params.ativo = String(currentFilters.ativo);
    }

    return params;
  }, [query, filters, searchTerm]);

  /**
   * Carrega equipamentos da API
   */
  const fetchEquipamentos = useCallback(async (customQuery?: Partial<PaginatedQuery>, customFilters?: EquipamentoFilters) => {
    try {
      setLoading(true);
      setError(null);

      const params = buildQueryParams(customQuery, customFilters);
      const queryString = new URLSearchParams(params).toString();
      const cacheKey = `equipamentos_${queryString}`;

      // Verificar cache primeiro
      const cachedData = cache.get<{
        data: Equipamento[];
        pagination: { total: number; totalPages: number };
      }>(cacheKey);

      if (cachedData) {
        setData(cachedData.data);
        setApiPagination(cachedData.pagination);
        setLoading(false);
        return cachedData.data;
      }

      // Fazer requisição para API
      const response = await fetch(`/api/equipamentos?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      setData(result.data || []);
      setApiPagination(result.pagination || { total: 0, totalPages: 0 });

      // Cache por 15 minutos (equipamentos mudam menos frequentemente)
      cache.set(cacheKey, {
        data: result.data,
        pagination: result.pagination
      }, 15 * 60 * 1000, ['equipamentos']);

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error(`Erro ao carregar equipamentos: ${errorMessage}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams, cache, toast]);

  /**
   * Carrega todos os equipamentos para estatísticas
   */
  const fetchAllEquipamentos = useCallback(async () => {
    try {
      const cacheKey = 'equipamentos_all';
      const cachedData = cache.get<Equipamento[]>(cacheKey);

      if (cachedData) {
        setAllEquipamentos(cachedData);
        return cachedData;
      }

      const response = await fetch('/api/equipamentos?all=true');
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const equipamentos = result.data || result;
      
      setAllEquipamentos(equipamentos);

      // Cache por 10 minutos para estatísticas
      cache.set(cacheKey, equipamentos, 10 * 60 * 1000, ['equipamentos']);

      return equipamentos;
    } catch (err) {
      console.error('Erro ao carregar todos os equipamentos:', err);
      return [];
    }
  }, [cache]);

  /**
   * Carregamento inicial
   */
  useEffect(() => {
    fetchEquipamentos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Carregamento de todos os equipamentos para estatísticas
   */
  useEffect(() => {
    fetchAllEquipamentos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Cria um novo equipamento
   */
  const createEquipamento = useCallback(async (equipamentoData: CreateEquipamentoData): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await fetch('/api/equipamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(equipamentoData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao criar equipamento');
      }

      // Invalidar cache
      cache.invalidateByTag('equipamentos');
      
      // Recarregar dados
      await Promise.all([fetchEquipamentos(), fetchAllEquipamentos()]);

      toast.success('Equipamento criado com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(`Erro ao criar equipamento: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cache, fetchEquipamentos, fetchAllEquipamentos, toast]);

  /**
   * Atualiza um equipamento existente
   */
  const updateEquipamento = useCallback(async (id: string, equipamentoData: UpdateEquipamentoData): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await fetch(`/api/equipamentos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(equipamentoData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao atualizar equipamento');
      }

      // Invalidar cache
      cache.invalidateByTag('equipamentos');
      
      // Recarregar dados
      await Promise.all([fetchEquipamentos(), fetchAllEquipamentos()]);

      toast.success('Equipamento atualizado com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(`Erro ao atualizar equipamento: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cache, fetchEquipamentos, fetchAllEquipamentos, toast]);

  /**
   * Exclui um equipamento
   */
  const deleteEquipamento = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await fetch(`/api/equipamentos/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao excluir equipamento');
      }

      // Invalidar cache
      cache.invalidateByTag('equipamentos');
      
      // Recarregar dados
      await Promise.all([fetchEquipamentos(), fetchAllEquipamentos()]);

      toast.success('Equipamento excluído com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(`Erro ao excluir equipamento: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cache, fetchEquipamentos, fetchAllEquipamentos, toast]);

  /**
   * Manipula mudança de página
   */
  const handlePageChange = useCallback((page: number) => {
    setQuery(prev => ({ ...prev, page }));
    fetchEquipamentos({ page });
  }, [fetchEquipamentos]);

  /**
   * Manipula busca
   */
  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setQuery(prev => ({ ...prev, page: 1, search }));
    
    if (search && search.trim()) {
      fetchEquipamentos({ page: 1, search });
    } else {
      // Busca vazia - retorna todos
      fetchEquipamentos({ page: 1, search: undefined });
    }
  }, [fetchEquipamentos]);

  /**
   * Manipula mudança de ordenação
   */
  const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setQuery(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
    fetchEquipamentos({ page: 1, sortBy, sortOrder });
  }, [fetchEquipamentos]);

  /**
   * Filtra por setor
   */
  const filterBySetor = useCallback((setorId: string) => {
    const newFilters = { ...filters, setorId };
    setFilters(newFilters);
    setQuery(prev => ({ ...prev, page: 1 }));
    fetchEquipamentos({ page: 1 }, newFilters);
  }, [filters, fetchEquipamentos]);

  /**
   * Filtra por status ativo/inativo
   */
  const filterByStatus = useCallback((ativo: boolean) => {
    const newFilters = { ...filters, ativo };
    setFilters(newFilters);
    setQuery(prev => ({ ...prev, page: 1 }));
    fetchEquipamentos({ page: 1 }, newFilters);
  }, [filters, fetchEquipamentos]);

  /**
   * Limpa todos os filtros
   */
  const clearFilters = useCallback(() => {
    setFilters({});
    setQuery({ ...DEFAULT_PAGINATION, ...DEFAULT_SORTING });
    fetchEquipamentos({ ...DEFAULT_PAGINATION, ...DEFAULT_SORTING }, {});
  }, [fetchEquipamentos]);

  /**
   * Recarrega dados
   */
  const refresh = useCallback(() => {
    // Invalidar cache relacionado a equipamentos
    cache.invalidateByTag('equipamentos');
    
    // Recarregar dados
    Promise.all([fetchEquipamentos(), fetchAllEquipamentos()]);
  }, [cache, fetchEquipamentos, fetchAllEquipamentos]);

  /**
   * Configuração de paginação para o componente
   */
  const pagination = useMemo(() => {
    if (!apiPagination) {
      return {
        page: query.page || 1,
        limit: query.limit || 10,
        total: 0,
        totalPages: 0
      };
    }

    return {
      page: query.page || 1,
      limit: query.limit || 10,
      total: apiPagination.total,
      totalPages: apiPagination.totalPages
    };
  }, [apiPagination, query]);

  /**
   * Configuração de ordenação para o componente
   */
  const sorting = useMemo(() => ({
    sortBy: query.sortBy,
    sortOrder: query.sortOrder
  }), [query.sortBy, query.sortOrder]);

  /**
   * Estatísticas dos equipamentos
   */
  const equipamentoStats = useMemo(() => {
    const stats = {
      total: allEquipamentos.length,
      ativos: allEquipamentos.filter(eq => eq.ativo).length,
      inativos: allEquipamentos.filter(eq => !eq.ativo).length,
      manutencaoVencida: 0,
      manutencaoProxima: 0
    };

    const hoje = new Date();
    const proximosMeses = new Date();
    proximosMeses.setMonth(hoje.getMonth() + 1); // Próximo mês

    allEquipamentos.forEach(equipamento => {
      const proximaManutencao = new Date(equipamento.proximaManutencao);
      
      if (proximaManutencao < hoje) {
        stats.manutencaoVencida++;
      } else if (proximaManutencao <= proximosMeses) {
        stats.manutencaoProxima++;
      }
    });

    return stats;
  }, [allEquipamentos]);

  return {
    // Dados
    equipamentos: data,
    allEquipamentos,
    equipamentoStats,
    
    // Estados
    loading,
    error,
    searchTerm,
    filters,
    
    // Configuração
    pagination,
    sorting,
    
    // Handlers
    handlePageChange,
    handleSearch,
    handleSortChange,
    filterBySetor,
    filterByStatus,
    clearFilters,
    refresh,
    
    // CRUD operations
    createEquipamento,
    updateEquipamento,
    deleteEquipamento
  };
};
