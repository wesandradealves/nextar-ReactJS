"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useCache } from '@/context/cache';
import { useToast } from '@/hooks/useToast';
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
  const [allUsers, setAllUsers] = useState<User[]>([]); // Todos os usuários para estatísticas
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

    const searchValue = currentQuery.search || searchTerm;
    if (searchValue && searchValue.trim()) {
      params.search = searchValue;
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

      // Primeiro, buscar TODOS os usuários para estatísticas (sem filtros)
      const allUsersKey = 'users_all';
      let allUsersData = cache.get<User[]>(allUsersKey);
      
      if (!allUsersData) {
        const allUsersResponse = await fetch('/api/users?page=1&limit=1000'); // Buscar todos
        if (allUsersResponse.ok) {
          const allUsersResult = await allUsersResponse.json();
          allUsersData = Array.isArray(allUsersResult) ? allUsersResult : allUsersResult.data || [];
          // Cache por 5 minutos para estatísticas
          cache.set(allUsersKey, allUsersData, 5 * 60 * 1000, ['users']);
        } else {
          allUsersData = [];
        }
      }
      
      // Atualizar dados completos para estatísticas
      setAllUsers(allUsersData || []);

      // Agora buscar dados filtrados/paginados
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
        if (searchTerm && searchTerm.trim()) {
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
    
    // Se a busca foi limpa, invalidar cache para garantir que todos os dados sejam carregados
    if (!search || !search.trim()) {
      cache.invalidateByTag('users');
    }
  }, [cache]);

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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar usuário');
      }

      const newUser = await response.json() as User;
      
      // Invalidar cache e refrescar dados
      refresh();
      
      // Toast de sucesso
      toast.success(
        'Usuário criado com sucesso!',
        `${newUser.nome} foi adicionado ao sistema`
      );
      
      return newUser;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar usuário';
      setError(errorMessage);
      
      // Toast de erro
      toast.error(
        'Erro ao criar usuário',
        errorMessage
      );
      
      return null;
    }
  }, [refresh, toast]);

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
      
      // Toast de sucesso
      toast.success(
        'Usuário atualizado com sucesso!',
        `As informações de ${updatedUser.nome} foram salvas`
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar usuário';
      setError(errorMessage);
      
      // Toast de erro
      toast.error(
        'Erro ao atualizar usuário',
        errorMessage
      );
      
      return false;
    }
  }, [data, cache, cacheKey, toast]);

  /**
   * Remove um usuário
   */
  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir usuário');
      }
      
      // Buscar nome do usuário para o toast
      const deletedUser = data.find((user: User) => user.id === userId);
      
      // Atualizar cache otimisticamente
      const updatedData = data.filter((user: User) => user.id !== userId);
      setData(updatedData);
      cache.set(cacheKey, updatedData, 10 * 60 * 1000, ['users']);
      
      // Também limpar outros caches relacionados
      cache.invalidateByTag('users');
      
      // Toast de sucesso
      toast.success(
        'Usuário excluído com sucesso!',
        deletedUser ? `${deletedUser.nome} foi removido do sistema` : 'Usuário removido do sistema'
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir usuário';
      setError(errorMessage);
      
      // Toast de erro
      toast.error(
        'Erro ao excluir usuário',
        errorMessage
      );
      
      return false;
    }
  }, [data, cache, cacheKey, toast]);

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

      // Toast de sucesso
      toast.success(
        'Senha alterada com sucesso!',
        'Sua senha foi atualizada'
      );

      return true;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao alterar senha';
      setError(errorMessage);
      
      // Toast de erro
      toast.error(
        'Erro ao alterar senha',
        errorMessage
      );
      
      return false;
    }
  }, [toast]);

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

      const responseData = await response.json();
      
      // Toast de sucesso
      toast.success(
        'Senha alterada com sucesso!',
        responseData.targetUser ? 
          `Senha de ${responseData.targetUser.nome} foi alterada` : 
          'Senha do usuário foi alterada'
      );

      return true;
    } catch (error) {
      console.error('Erro ao alterar senha do usuário:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao alterar senha do usuário';
      setError(errorMessage);
      
      // Toast de erro
      toast.error(
        'Erro ao alterar senha do usuário',
        errorMessage
      );
      
      return false;
    }
  }, [toast]);

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
    // Invalidar cache para forçar nova busca
    cache.invalidateByTag('users');
  }, [cache]);

  /**
   * Estatísticas calculadas baseadas em TODOS os usuários (não filtrados)
   */
  const userStats = useMemo(() => {
    if (!allUsers.length) return { 
      total: 0, 
      ativos: 0, 
      inativos: 0, 
      pesquisadores: 0, 
      agentes: 0, 
      gestores: 0 
    };
    
    return {
      total: allUsers.length,
      ativos: allUsers.filter(u => u.ativo).length,
      inativos: allUsers.filter(u => !u.ativo).length,
      pesquisadores: allUsers.filter(u => u.perfil === PerfilUsuario.PESQUISADOR).length,
      agentes: allUsers.filter(u => u.perfil === PerfilUsuario.AGENTE).length,
      gestores: allUsers.filter(u => u.perfil === PerfilUsuario.GESTAO).length
    };
  }, [allUsers]);

  // Effect para carregar dados quando query/filtros mudam
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    // Dados
    users: data,
    allUsers,
    userStats,
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
