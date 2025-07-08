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
import { exportToCSV } from '@/utils/export';

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10
};

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
  const [query, setQuery] = useState<PaginatedQuery>({
    ...DEFAULT_PAGINATION,
    ...DEFAULT_SORTING
  });
  const [filters, setFilters] = useState<UserFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiPagination, setApiPagination] = useState<{
    total: number;
    totalPages: number;
  } | null>(null);

  const cache = useCache();
  
  const toast = useToast();

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

  const cacheKey = useMemo(() => {
    const params = buildQueryParams();
    return `users_${new URLSearchParams(params).toString()}`;
  }, [buildQueryParams]);

  const fetchAllUsers = useCallback(async () => {
    const allUsersKey = 'users_all';
    let allUsersData = cache.get<User[]>(allUsersKey);
    
    if (!allUsersData) {
      try {
        const allUsersResponse = await fetch('/api/users?page=1&limit=1000'); // Buscar todos
        if (allUsersResponse.ok) {
          const allUsersResult = await allUsersResponse.json();
          allUsersData = Array.isArray(allUsersResult) ? allUsersResult : allUsersResult.data || [];
          cache.set(allUsersKey, allUsersData, 10 * 60 * 1000, ['users']);
        } else {
          allUsersData = [];
        }
      } catch (error) {
        console.error('Erro ao buscar todos os usuários:', error);
        allUsersData = [];
      }
    }
    
    setAllUsers(allUsersData || []);
  }, [cache]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cachedData = cache.get<User[]>(cacheKey);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      const params = buildQueryParams();
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/users?${queryString}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar usuários');
      }

      const result = await response.json();
      
      let userData: User[];
      if (Array.isArray(result)) {
        userData = result;
        
        if (searchTerm && searchTerm.trim()) {
          userData = userData.filter(user => 
            user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (filters.perfil) {
          userData = userData.filter(user => user.perfil === filters.perfil);
        }
        
        userData.sort((a, b) => {
          const sortBy = query.sortBy || 'nome';
          const aValue = String(a[sortBy as keyof User] || '');
          const bValue = String(b[sortBy as keyof User] || '');
          
          const comparison = aValue.localeCompare(bValue);
          return query.sortOrder === 'desc' ? -comparison : comparison;
        });
        
        const startIndex = ((query.page || 1) - 1) * (query.limit || 10);
        userData = userData.slice(startIndex, startIndex + (query.limit || 10));
        
        setApiPagination(null);
      } else {
        userData = result.data || result;
        
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
      
      cache.set(cacheKey, userData, 10 * 60 * 1000, ['users']);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [cache, cacheKey, buildQueryParams, query, filters, searchTerm]);

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

  const sorting = useMemo(() => ({
    sortBy: query.sortBy || 'nome',
    sortOrder: query.sortOrder || 'asc'
  }), [query.sortBy, query.sortOrder]);

  const handlePageChange = useCallback((page: number) => {
    setQuery(prev => ({ ...prev, page }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setQuery(prev => ({ 
      ...prev, 
      page: 1,
      search: search || undefined 
    }));
    
    if (!search || !search.trim()) {
      cache.invalidateByTag('users');
    }
  }, [cache]);

  const handleFilterChange = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setQuery(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setQuery(prev => ({ ...prev, sortBy, sortOrder }));
  }, []);

  const refresh = useCallback(() => {
    cache.remove(cacheKey);
    cache.invalidateByTag('users');
    fetchAllUsers();
    fetchUsers();
  }, [cache, cacheKey, fetchUsers, fetchAllUsers]);

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
      
      refresh();
      
      toast.success(
        'Usuário criado com sucesso!',
        `${newUser.nome} foi adicionado ao sistema`
      );
      
      return newUser;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar usuário';
      setError(errorMessage);
      
      toast.error(
        'Erro ao criar usuário',
        errorMessage
      );
      
      return null;
    }
  }, [refresh, toast]);

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
      
      const updatedData = data.map((user: User) => 
        user.id === userId ? updatedUser : user
      );
      setData(updatedData);
      cache.set(cacheKey, updatedData, 10 * 60 * 1000, ['users']);
      
      cache.invalidateByTag('users');
      
      toast.success(
        'Usuário atualizado com sucesso!',
        `As informações de ${updatedUser.nome} foram salvas`
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar usuário';
      setError(errorMessage);
      
      toast.error(
        'Erro ao atualizar usuário',
        errorMessage
      );
      
      return false;
    }
  }, [data, cache, cacheKey, toast]);

  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir usuário');
      }
      
      const deletedUser = data.find((user: User) => user.id === userId);
      
      const updatedData = data.filter((user: User) => user.id !== userId);
      setData(updatedData);
      cache.set(cacheKey, updatedData, 10 * 60 * 1000, ['users']);
      
      cache.invalidateByTag('users');
      
      toast.success(
        'Usuário excluído com sucesso!',
        deletedUser ? `${deletedUser.nome} foi removido do sistema` : 'Usuário removido do sistema'
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir usuário';
      setError(errorMessage);
      
      toast.error(
        'Erro ao excluir usuário',
        errorMessage
      );
      
      return false;
    }
  }, [data, cache, cacheKey, toast]);

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

      toast.success(
        'Senha alterada com sucesso!',
        'Sua senha foi atualizada'
      );

      return true;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao alterar senha';
      setError(errorMessage);
      
      toast.error(
        'Erro ao alterar senha',
        errorMessage
      );
      
      return false;
    }
  }, [toast]);

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
      
      toast.error(
        'Erro ao alterar senha do usuário',
        errorMessage
      );
      
      return false;
    }
  }, [toast]);

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
    cache.invalidateByTag('users');
  }, [cache]);

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

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * Exporta usuários para CSV
   * @returns {boolean} Sucesso da operação
   */
  const exportUsersCSV = useCallback(async () => {
    try {
      setLoading(true);
      
      let usersToExport = allUsers;
      if (!usersToExport || usersToExport.length === 0) {
        const response = await fetch('/api/users?limit=1000');
        if (!response.ok) {
          throw new Error('Erro ao buscar usuários para exportação');
        }
        const result = await response.json();
        usersToExport = result.data;
      }
      
      const sanitizedUsers = usersToExport.map((user: User) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { senha, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      exportToCSV(sanitizedUsers, {
        filename: 'usuarios-sistema',
        headers: {
          id: 'ID',
          nome: 'Nome',
          email: 'E-mail',
          perfil: 'Perfil',
          setor: 'Setor',
          ativo: 'Ativo',
          ultimoLogin: 'Último Login',
          createdAt: 'Data de Criação',
          updatedAt: 'Última Atualização'
        },
        formatters: {
          ativo: (value: unknown) => value === true ? 'Sim' : 'Não',
          perfil: (value: unknown) => {
            const perfilMap: Record<string, string> = {
              'gestao': 'Gestão',
              'agente': 'Agente de Manutenção',
              'pesquisador': 'Pesquisador'
            };
            return perfilMap[String(value)] || String(value);
          },
          ultimoLogin: (value: unknown) => value ? new Date(String(value)).toLocaleString('pt-BR') : 'Nunca',
          createdAt: (value: unknown) => value ? new Date(String(value)).toLocaleDateString('pt-BR') : '',
          updatedAt: (value: unknown) => value ? new Date(String(value)).toLocaleDateString('pt-BR') : ''
        }
      });
      
      toast.success(
        'Exportação concluída',
        'Os usuários foram exportados com sucesso'
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao exportar usuários:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao exportar usuários';
      
      toast.error(
        'Erro na exportação',
        errorMessage
      );
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [allUsers, toast]);

  return {
    users: data,
    allUsers,
    userStats,
    pagination,
    sorting,
    loading,
    error,
    
    searchTerm,
    filters,
    query,
    
    handlePageChange,
    handleSearch,
    handleFilterChange,
    handleSortChange,
    
    createUser,
    updateUser,
    deleteUser,
    
    changePassword,
    changeUserPasswordAsAdmin,
    
    refresh,
    filterByProfile,
    clearFilters,
    
    cacheKey,
    hasCache: !!cache.get(cacheKey),
    
    exportUsersCSV
  };
};
