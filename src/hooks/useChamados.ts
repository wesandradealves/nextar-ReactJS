"use client";

import { useState, useCallback, useEffect } from 'react';
import { useCache } from '@/context/cache';
import { useToast } from '@/hooks/useToast';
import type { Chamado, User, CreateChamadoData, UpdateChamadoData } from '@/types';
import { PerfilUsuario } from '@/utils/enums';
import { resources } from '@/services/resources';

/**
 * Configuração padrão para filtros
 * @decorator @immutable - Objeto congelado, nunca deve ser modificado diretamente
 * @constant {ChamadoFilters}
 */
const DEFAULT_FILTERS = {
  tipo: '',
  status: '',
  agenteId: '',
  setorId: '',
  search: ''
};

/**
 * Hook personalizado para gerenciar chamados
 * Seguindo o padrão estabelecido pelo useUsers
 * 
 * @decorator @cache - Implementa cache automático com invalidação por tags
 * @decorator @permissions - Aplica filtros baseados no perfil do usuário
 * @decorator @crud - Operações completas de CRUD via API
 * 
 * @param {User} currentUser - Usuário atual logado no sistema
 * @returns {UseChamadosReturn} Estado e ações para gerenciar chamados
 * 
 * @example
 * ```tsx
 * const {
 *   chamados,
 *   loading,
 *   error,
 *   filters,
 *   handleFilterChange,
 *   createChamado,
 *   updateChamado,
 *   deleteChamado,
 *   refreshData
 * } = useChamados(user);
 * ```
 */
export function useChamados(currentUser: User | null) {
  const cache = useCache();
  const toast = useToast();
  
  // Estados principais
  const [data, setData] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  /**
   * Busca dados da API com cache
   */
  const fetchChamados = useCallback(async (filtersToUse = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir parâmetros dinamicamente
      const params: Record<string, string> = {};
      
      // Filtros baseados no perfil do usuário
      if (currentUser?.perfil === PerfilUsuario.AGENTE) {
        params.agenteId = currentUser.id;
      }
      
      // Aplicar filtros da interface (para GESTAO e PESQUISADOR)
      if (filtersToUse.tipo) params.tipo = filtersToUse.tipo;
      if (filtersToUse.status) params.status = filtersToUse.status;
      if (filtersToUse.setorId) params.setorId = filtersToUse.setorId;
      
      // Para filtro de agente, só adicionar aos params se não for "sem_agente"
      if (filtersToUse.agenteId && currentUser?.perfil === PerfilUsuario.GESTAO && filtersToUse.agenteId !== 'sem_agente') {
        params.agenteId = filtersToUse.agenteId;
      }
      
      // Chave de cache baseada nos parâmetros atuais
      const currentCacheKey = `chamados_${new URLSearchParams(params).toString()}`;
      
      // Verificar cache primeiro
      let chamadosData = cache.get<Chamado[]>(currentCacheKey);
      
      if (!chamadosData) {
        // Buscar da API
        chamadosData = await resources.getChamados(params);
        
        // Salvar no cache por 5 minutos
        cache.set(currentCacheKey, chamadosData, 5 * 60 * 1000, ['chamados']);
      }
      
      // Aplicar filtros locais
      let filteredData = chamadosData || [];
      
      // Filtro de busca por texto
      if (filtersToUse.search) {
        filteredData = filteredData.filter((chamado: Chamado) =>
          chamado.descricao?.toLowerCase().includes(filtersToUse.search.toLowerCase()) ||
          chamado.titulo?.toLowerCase().includes(filtersToUse.search.toLowerCase()) ||
          chamado.tipo?.toLowerCase().includes(filtersToUse.search.toLowerCase())
        );
      }
      
      // Filtro específico para "sem agente" (apenas para GESTAO)
      if (filtersToUse.agenteId === 'sem_agente' && currentUser?.perfil === PerfilUsuario.GESTAO) {
        filteredData = filteredData.filter((chamado: Chamado) => {
          const agenteId = chamado.agenteId;
          return !agenteId || 
                 agenteId === '' || 
                 agenteId === null || 
                 agenteId === undefined ||
                 (typeof agenteId === 'string' && (
                   agenteId.toLowerCase() === 'n/a' ||
                   agenteId.toLowerCase() === 'nao atribuido' ||
                   agenteId.toLowerCase() === 'não atribuído' ||
                   agenteId.toLowerCase() === 'sem agente'
                 ));
        });
      }
      
      setData(filteredData);
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao carregar chamados';
      setError(errorMsg);
      toast.error('Erro ao carregar chamados', errorMsg);
      console.error('Erro ao carregar chamados:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, cache, toast, filters]);

  /**
   * Atualiza filtros
   * @decorator @immutable - Preserva estado anterior, cria novo objeto
   * @param {Partial<typeof DEFAULT_FILTERS>} newFilters - Novos filtros a aplicar
   */
  const handleFilterChange = useCallback((newFilters: Partial<typeof DEFAULT_FILTERS>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Limpa todos os filtros
   * @decorator @reset - Restaura estado para configuração padrão
   */
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  /**
   * Força atualização dos dados
   * @decorator @invalidate - Limpa cache e força nova busca
   * @decorator @refresh - Recarrega dados da API
   */
  const refreshData = useCallback(() => {
    // Limpar cache relacionado
    cache.invalidateByTag('chamados');
    // Refazer a requisição com filtros atuais
    fetchChamados(filters);
  }, [cache, fetchChamados, filters]);

  // Effect para carregar dados inicialmente
  useEffect(() => {
    if (currentUser) {
      fetchChamados();
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect para reagir a mudanças de filtros
  useEffect(() => {
    if (currentUser) {
      fetchChamados(filters);
    }
  }, [filters, currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Cria um novo chamado
   * Seguindo o padrão do useUsers
   */
  const createChamado = useCallback(async (chamadoData: CreateChamadoData): Promise<Chamado | null> => {
    try {
      const response = await fetch('/api/chamados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chamadoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar chamado');
      }

      const newChamado = await response.json() as Chamado;
      
      // Invalidar todo o cache de chamados para garantir consistência
      cache.invalidateByTag('chamados');
      
      // Refrescar dados após pequeno delay para garantir que a API processou
      setTimeout(() => {
        refreshData();
      }, 200);
      
      // Toast de sucesso
      toast.success(
        'Chamado criado com sucesso!',
        'O novo chamado foi registrado no sistema'
      );
      
      return newChamado;
    } catch (error) {
      console.error('Erro ao criar chamado:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar chamado';
      setError(errorMessage);
      
      // Toast de erro
      toast.error(
        'Erro ao criar chamado',
        errorMessage
      );
      
      // Relançar a exceção para que o modal capture
      throw error;
    }
  }, [refreshData, toast, cache]);

  /**
   * Atualiza um chamado existente
   * Seguindo exatamente o padrão do useUsers
   */
  const updateChamado = useCallback(async (chamadoId: string, chamadoData: UpdateChamadoData): Promise<boolean> => {
    try {
      const response = await fetch(`/api/chamados/${chamadoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chamadoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar chamado');
      }

      const updatedChamado = await response.json() as Chamado;
      
      // Atualização otimista do estado local (igual ao useUsers)
      const updatedData = data.map((chamado: Chamado) => 
        chamado.id === chamadoId ? updatedChamado : chamado
      );
      setData(updatedData);
      
      // Limpar cache relacionado
      cache.invalidateByTag('chamados');
      
      // Forçar atualização dos dados para garantir sincronização
      setTimeout(() => {
        refreshData();
      }, 200);
      
      // Toast de sucesso
      toast.success(
        'Chamado atualizado com sucesso!',
        'As informações do chamado foram salvas'
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar chamado:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar chamado';
      setError(errorMessage);
      
      // Toast de erro
      toast.error(
        'Erro ao atualizar chamado',
        errorMessage
      );
      
      // Relançar a exceção para que o modal capture
      throw error;
    }
  }, [data, cache, toast, refreshData]);

  /**
   * Deleta um chamado
   * Seguindo o padrão do useUsers
   */
  const deleteChamado = useCallback(async (chamadoId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/chamados/${chamadoId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao deletar chamado');
      }

      // Invalidar cache e refrescar dados
      refreshData();
      
      // Toast de sucesso
      toast.success(
        'Chamado deletado com sucesso!',
        'O chamado foi removido do sistema'
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao deletar chamado:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar chamado';
      setError(errorMessage);
      
      // Toast de erro
      toast.error(
        'Erro ao deletar chamado',
        errorMessage
      );
      
      return false;
    }
  }, [refreshData, toast]);

  return {
    // Dados
    chamados: data,
    loading,
    error,
    
    // Estados
    filters,
    
    // Ações
    handleFilterChange,
    clearFilters,
    refreshData,
    
    // CRUD Operations
    createChamado,
    updateChamado,
    deleteChamado
  };
}
