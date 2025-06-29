"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useCache } from '@/context/cache';
import type { 
  User, 
  PaginatedQuery, 
  UserFilters,
  CreateUserData,
  UpdateUserData
} from '@/types';
import { PerfilUsuario } from '@/utils/enums';

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
 * Hook personalizado para gerenciar usuários
 * Integrado com cache multicamadas e API
 * Suporte a paginação, busca, filtros e ordenação
 * 
 * @example
 * ```tsx
 * const {
 *   users,
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
 *   createUser,
 *   updateUser,
 *   deleteUser,
 *   refresh
 * } = useUsers();
 * ```
 */
export const useUsers = () => {
  // Estados locais
  const [query, setQuery] = useState<PaginatedQuery>({
    ...DEFAULT_PAGINATION,
    ...DEFAULT_SORTING
  });
  const [filters, setFilters] = useState<UserFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiPagination, setApiPagination] = useState<{
    total: number;
    totalPages: number;
  } | null>(null);

  // Cache context
  const cache = useCache();

  /**
   * Constrói parâmetros da query para a API
   */
  const buildQueryParams = useCallback((customQuery?: Partial<PaginatedQuery>, customFilters?: UserFilters) => {
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

    if (currentQuery.search || searchTerm) {
      params.search = currentQuery.search || searchTerm;
    }

    if (currentFilters.perfil) {
      params.perfil = currentFilters.perfil;
    }

    if (currentFilters.active !== undefined) {
      params.active = String(currentFilters.active);
    }

    return params;
  }, [query, filters, searchTerm]);

  /**
   * Chave de cache baseada nos parâmetros atuais
   */
  const cacheKey = useMemo(() => {
    const params = buildQueryParams();
    return `users_${new URLSearchParams(params).toString()}`;
  }, [buildQueryParams]);

  /**
   * Busca dados da API
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar cache primeiro
      const cachedData = cache.get<User[]>(cacheKey);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      // Buscar dados da API
      const params = buildQueryParams();
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/users?${queryString}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar usuários');
      }

      const result = await response.json();
      
      // Se a API retornar paginação, usar os dados paginados
      // Senão, aplicar filtros e paginação localmente
      let userData: User[];
      if (Array.isArray(result)) {
        // Resposta sem paginação - aplicar filtros e paginação localmente
        userData = result;
        
        // Aplicar filtros localmente se necessário
        if (searchTerm) {
          userData = userData.filter(user => 
            user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (filters.perfil) {
          userData = userData.filter(user => user.perfil === filters.perfil);
        }
        
        // Aplicar ordenação
        userData.sort((a, b) => {
          const sortBy = query.sortBy || 'nome';
          const aValue = String(a[sortBy as keyof User] || '');
          const bValue = String(b[sortBy as keyof User] || '');
          
          const comparison = aValue.localeCompare(bValue);
          return query.sortOrder === 'desc' ? -comparison : comparison;
        });
        
        // Aplicar paginação local
        const startIndex = ((query.page || 1) - 1) * (query.limit || 10);
        userData = userData.slice(startIndex, startIndex + (query.limit || 10));
        
        // Limpar paginação da API
        setApiPagination(null);
      } else {
        // Resposta com paginação - usar dados da API
        userData = result.data || result;
        
        // Capturar informações de paginação da API
        if (result.pagination) {
          setApiPagination({
            total: result.pagination.total,
            totalPages: result.pagination.totalPages
          });
        } else {
          setApiPagination(null);
        }
      }

      setData(userData);
      
      // Salvar no cache
      cache.set(cacheKey, userData, 10 * 60 * 1000, ['users']); // 10 minutos
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [cache, cacheKey, buildQueryParams, query, filters, searchTerm]);

  /**
   * Configuração de paginação calculada
   */
  const pagination = useMemo(() => {
    const currentPage = query.page || 1;
    const currentLimit = query.limit || 10;
    
    return {
      page: currentPage,
      limit: currentLimit,
      total: apiPagination?.total || data.length,
      totalPages: apiPagination?.totalPages || Math.ceil(data.length / currentLimit)
    };
  }, [query.page, query.limit, data.length, apiPagination]);

  /**
   * Configuração de ordenação atual
   */
  const sorting = useMemo(() => ({
    sortBy: query.sortBy || 'nome',
    sortOrder: query.sortOrder || 'asc'
  }), [query.sortBy, query.sortOrder]);

  /**
   * Manipula mudança de página
   */
  const handlePageChange = useCallback((page: number) => {
    setQuery(prev => ({ ...prev, page }));
  }, []);

  /**
   * Manipula busca
   */
  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setQuery(prev => ({ 
      ...prev, 
      page: 1, // Reset para primeira página
      search: search || undefined 
    }));
  }, []);

  /**
   * Manipula mudança de filtros
   */
  const handleFilterChange = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setQuery(prev => ({ ...prev, page: 1 })); // Reset para primeira página
  }, []);

  /**
   * Manipula mudança de ordenação
   */
  const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setQuery(prev => ({ ...prev, sortBy, sortOrder }));
  }, []);

  /**
   * Atualiza os dados (refetch)
   */
  const refresh = useCallback(() => {
    // Limpar cache relacionado
    cache.remove(cacheKey);
    cache.invalidateByTag('users');
    // Refazer a requisição
    fetchUsers();
  }, [cache, cacheKey, fetchUsers]);

  /**
   * Cria um novo usuário
   */
  const createUser = useCallback(async (userData: CreateUserData): Promise<User | null> => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Erro ao criar usuário');
      }

      const newUser = await response.json() as User;
      
      // Invalidar cache e refrescar dados
      refresh();
      
      return newUser;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      setError(error instanceof Error ? error.message : 'Erro ao criar usuário');
      return null;
    }
  }, [refresh]);

  /**
   * Atualiza um usuário existente
   */
  const updateUser = useCallback(async (userId: string, userData: UpdateUserData): Promise<boolean> => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar usuário');
      }

      const updatedUser = await response.json() as User;
      
      // Atualizar cache otimisticamente
      const updatedData = data.map((user: User) => 
        user.id === userId ? updatedUser : user
      );
      setData(updatedData);
      cache.set(cacheKey, updatedData, 10 * 60 * 1000, ['users']);
      
      // Também limpar outros caches relacionados
      cache.invalidateByTag('users');
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      setError(error instanceof Error ? error.message : 'Erro ao atualizar usuário');
      return false;
    }
  }, [data, cache, cacheKey]);

  /**
   * Remove um usuário
   */
  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir usuário');
      }
      
      // Atualizar cache otimisticamente
      const updatedData = data.filter((user: User) => user.id !== userId);
      setData(updatedData);
      cache.set(cacheKey, updatedData, 10 * 60 * 1000, ['users']);
      
      // Também limpar outros caches relacionados
      cache.invalidateByTag('users');
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      setError(error instanceof Error ? error.message : 'Erro ao excluir usuário');
      return false;
    }
  }, [data, cache, cacheKey]);

  /**
   * Alterar própria senha do usuário
   */
  const changePassword = useCallback(async (
    userId: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          currentPassword,
          newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao alterar senha');
      }

      return true;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setError(error instanceof Error ? error.message : 'Erro ao alterar senha');
      return false;
    }
  }, []);

  /**
   * Alterar senha de outro usuário (apenas para administradores)
   */
  const changeUserPasswordAsAdmin = useCallback(async (
    targetUserId: string,
    adminUserId: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: targetUserId,
          adminUserId,
          newPassword,
          isAdminChange: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao alterar senha do usuário');
      }

      return true;
    } catch (error) {
      console.error('Erro ao alterar senha do usuário:', error);
      setError(error instanceof Error ? error.message : 'Erro ao alterar senha do usuário');
      return false;
    }
  }, []);

  /**
   * Utilitários para filtros rápidos
   */
  const filterByProfile = useCallback((perfil: PerfilUsuario) => {
    handleFilterChange({ perfil });
  }, [handleFilterChange]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
    setQuery(prev => ({ 
      ...prev, 
      page: 1, 
      search: undefined 
    }));
  }, []);

  // Effect para carregar dados quando query/filtros mudam
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    // Dados
    users: data,
    pagination,
    sorting,
    loading,
    error,
    
    // Estados
    searchTerm,
    filters,
    query,
    
    // Ações de navegação/filtro
    handlePageChange,
    handleSearch,
    handleFilterChange,
    handleSortChange,
    
    // CRUD operations
    createUser,
    updateUser,
    deleteUser,
    
    // Alteração de senhas
    changePassword,
    changeUserPasswordAsAdmin,
    
    // Utilitários
    refresh,
    filterByProfile,
    clearFilters,
    
    // Cache info
    cacheKey,
    hasCache: !!cache.get(cacheKey)
  };
};
