"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useCache } from '@/context/cache';
import { useToast } from '@/hooks/useToast';
import { resources } from '@/services/resources';
import type { Chamado, User } from '@/types';
import { PerfilUsuario } from '@/utils/enums';

/**
 * Configuração padrão para filtros
 * @decorator @immutable - Objeto congelado, nunca deve ser modificado diretamente
 * @constant {ChamadoFilters}
 */
const DEFAULT_FILTERS = {
  tipo: '',
  status: '',
  agenteId: '',
  search: ''
};

/**
 * Hook personalizado para gerenciar chamados
 * Seguindo o padrão estabelecido pelo useUsers
 * 
 * @decorator @cache - Implementa cache automático com invalidação por tags
 * @decorator @permissions - Aplica filtros baseados no perfil do usuário
 * @decorator @realtime - Suporte a atualizações em tempo real (futuro)
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
 *   refreshData
 * } = useChamados(user);
 * ```
 */
export function useChamados(currentUser: User | null) {
  const cache = useCache();
  const { error: showError } = useToast();
  
  // Estados principais
  const [data, setData] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  /**
   * Constrói parâmetros de busca baseado no usuário e filtros
   */
  const buildQueryParams = useCallback(() => {
    const params: Record<string, string> = {};
    
    // Filtros baseados no perfil do usuário
    if (currentUser?.perfil === PerfilUsuario.AGENTE) {
      params.agenteId = currentUser.id;
    }
    
    // Aplicar filtros da interface (apenas para GESTAO)
    if (filters.tipo) params.tipo = filters.tipo;
    if (filters.status) params.status = filters.status;
    
    // Para filtro de agente, só adicionar aos params se não for "sem_agente"
    if (filters.agenteId && currentUser?.perfil === PerfilUsuario.GESTAO && filters.agenteId !== 'sem_agente') {
      params.agenteId = filters.agenteId;
    }
    
    return params;
  }, [currentUser, filters]);

  /**
   * Chave de cache baseada nos parâmetros atuais
   */
  const cacheKey = useMemo(() => {
    const params = buildQueryParams();
    return `chamados_${new URLSearchParams(params).toString()}`;
  }, [buildQueryParams]);

  /**
   * Busca dados da API com cache
   */
  const fetchChamados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar cache primeiro
      let chamadosData = cache.get<Chamado[]>(cacheKey);
      
      if (!chamadosData) {
        // Buscar da API
        const params = buildQueryParams();
        chamadosData = await resources.getChamados(params);
        
        // Salvar no cache por 5 minutos
        cache.set(cacheKey, chamadosData, 5 * 60 * 1000, ['chamados']);
      }
      
      // Aplicar filtros locais
      let filteredData = chamadosData || [];
      
      // Filtro de busca por texto
      if (filters.search) {
        filteredData = filteredData.filter((chamado: Chamado) =>
          chamado.descricao?.toLowerCase().includes(filters.search.toLowerCase()) ||
          chamado.tipo?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      // Filtro específico para "sem agente" (apenas para GESTAO)
      if (filters.agenteId === 'sem_agente' && currentUser?.perfil === PerfilUsuario.GESTAO) {
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
      showError(errorMsg);
      console.error('Erro ao carregar chamados:', err);
    } finally {
      setLoading(false);
    }
  }, [cache, cacheKey, filters.search, filters.agenteId, currentUser, showError]);

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
    cache.remove(cacheKey);
    cache.invalidateByTag('chamados');
    // Refazer a requisição
    fetchChamados();
  }, [cache, cacheKey, fetchChamados]);

  // Effect para carregar dados quando parâmetros mudam
  useEffect(() => {
    if (currentUser) {
      fetchChamados();
    }
  }, [currentUser, filters.tipo, filters.status, filters.agenteId, filters.search]);

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
    refreshData
  };
}
