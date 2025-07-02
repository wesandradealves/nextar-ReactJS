import { useState, useCallback, useMemo, useEffect } from 'react';
import { useCache } from '@/context/cache';
import { useToast } from '@/hooks/useToast';
import type { Chamado } from '@/types';
import { TipoManutencao, ChamadoStatus } from '@/utils/enums';

/**
 * Filtros para histórico de manutenções
 */
export interface HistoricoFilters {
  /** Tipo de manutenção */
  tipo?: TipoManutencao;
  /** Status do chamado (opcional - padrão apenas concluídos) */
  status?: ChamadoStatus;
  /** ID do agente responsável */
  agenteId?: string;
  /** ID do equipamento */
  equipamentoId?: string;
  /** ID do setor */
  setorId?: string;
  /** Data de início do período */
  dataInicio?: string;
  /** Data de fim do período */
  dataFim?: string;
}

/**
 * Configuração de paginação para histórico
 */
export interface HistoricoPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Estatísticas do histórico
 */
export interface HistoricoStats {
  total: number;
  porTipo: {
    [TipoManutencao.CORRETIVA]: number;
    [TipoManutencao.PREVENTIVA]: number;
  };
  porStatus: {
    [ChamadoStatus.ABERTO]: number;
    [ChamadoStatus.EM_PROGRESSO]: number;
    [ChamadoStatus.CONCLUIDO]: number;
  };
  tempoMedioExecucao: number;
}

/**
 * Chamado enriquecido com dados relacionados
 */
export interface ChamadoEnriquecido extends Chamado {
  agenteNome: string;
  solicitanteNome: string;
  equipamentoNome: string;
  equipamentoCodigo: string;
  setorNome: string;
  setorCategoria: string;
  tempoExecucao: number | null;
}

/**
 * Hook personalizado para gerenciar histórico de manutenções
 * Integrado com cache e filtros avançados
 * Restrito para perfil de gestão conforme requisitos
 * 
 * @example
 * ```tsx
 * const {
 *   chamados,
 *   loading,
 *   error,
 *   filters,
 *   pagination,
 *   stats,
 *   setFilters,
 *   handlePageChange,
 *   refresh,
 *   exportarHistorico
 * } = useHistorico();
 * ```
 */
export const useHistorico = () => {
  // Estados
  const [chamados, setChamados] = useState<ChamadoEnriquecido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<HistoricoPagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });
  const [stats, setStats] = useState<HistoricoStats>({
    total: 0,
    porTipo: {
      [TipoManutencao.CORRETIVA]: 0,
      [TipoManutencao.PREVENTIVA]: 0
    },
    porStatus: {
      [ChamadoStatus.ABERTO]: 0,
      [ChamadoStatus.EM_PROGRESSO]: 0,
      [ChamadoStatus.CONCLUIDO]: 0
    },
    tempoMedioExecucao: 0
  });

  // Filtros com valores padrão para últimos 3 meses
  const [filters, setFilters] = useState<HistoricoFilters>(() => {
    const hoje = new Date();
    const tresMesesAtras = new Date();
    tresMesesAtras.setMonth(hoje.getMonth() - 3);
    
    return {
      dataInicio: tresMesesAtras.toISOString().split('T')[0],
      dataFim: hoje.toISOString().split('T')[0]
    };
  });

  // Cache e toast
  const cache = useCache();
  const toast = useToast();

  /**
   * Carrega estatísticas globais independentemente dos filtros
   */
  const fetchGlobalStats = useCallback(async () => {
    try {
      // Verificar cache de estatísticas globais primeiro
      const cacheKey = 'historico_stats_global';
      const cachedStats = cache.get<HistoricoStats>(cacheKey);

      if (cachedStats) {
        setStats(cachedStats);
        return;
      }

      // Buscar estatísticas globais da API (sem filtros)
      const response = await fetch('/api/historico?page=1&limit=1'); // Busca mínima só para pegar stats
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.estatisticas) {
        setStats(result.estatisticas);
        
        // Cache por 10 minutos (estatísticas mudam menos)
        cache.set(cacheKey, result.estatisticas, 10 * 60 * 1000, ['historico', 'stats']);
      }

    } catch (err) {
      console.error('Erro ao carregar estatísticas globais:', err);
    }
  }, [cache]);

  /**
   * Constrói parâmetros da query para a API
   */
  const buildQueryParams = useCallback((customFilters?: HistoricoFilters, customPagination?: Partial<HistoricoPagination>) => {
    const currentFilters = { ...filters, ...customFilters };
    const currentPagination = { ...pagination, ...customPagination };
    
    const params: Record<string, string> = {
      page: String(currentPagination.page),
      limit: String(currentPagination.limit)
    };

    // Adicionar filtros não vazios
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = String(value);
      }
    });

    return new URLSearchParams(params).toString();
  }, [filters, pagination]);

  /**
   * Busca histórico de manutenções
   */
  const fetchHistorico = useCallback(async (customFilters?: HistoricoFilters, customPagination?: Partial<HistoricoPagination>) => {
    try {
      setLoading(true);
      setError(null);

      // Chave de cache baseada nos filtros e paginação
      const queryParams = buildQueryParams(customFilters, customPagination);
      const cacheKey = `historico_${queryParams}`;

      // Verificar cache primeiro
      const cachedData = cache.get<{
        data: ChamadoEnriquecido[];
        pagination: HistoricoPagination;
      }>(cacheKey);

      if (cachedData) {
        setChamados(cachedData.data);
        setPagination(cachedData.pagination);
        return;
      }

      // Buscar dados da API
      const response = await fetch(`/api/historico?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      setChamados(result.data || []);
      setPagination(result.pagination || pagination);
      
      // NÃO sobrescrever as estatísticas globais aqui
      // As estatísticas são carregadas separadamente em fetchGlobalStats

      // Cache por 5 minutos (apenas dados e paginação)
      cache.set(cacheKey, {
        data: result.data || [],
        pagination: result.pagination || pagination
      }, 5 * 60 * 1000, ['historico', 'chamados']);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error(`Erro ao carregar histórico: ${errorMessage}`);
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams, cache, toast, pagination, stats]);

  /**
   * Atualiza filtros e recarrega dados
   */
  const handleFilterChange = useCallback((newFilters: Partial<HistoricoFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Reset para primeira página quando filtros mudam
    const resetPagination = { page: 1 };
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Buscar com novos filtros
    fetchHistorico(updatedFilters, resetPagination);
  }, [filters, fetchHistorico]);

  /**
   * Mudança de página
   */
  const handlePageChange = useCallback((newPage: number) => {
    const newPagination = { page: newPage };
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchHistorico(undefined, newPagination);
  }, [fetchHistorico]);

  /**
   * Limpar filtros
   */
  const clearFilters = useCallback(() => {
    const hoje = new Date();
    const tresMesesAtras = new Date();
    tresMesesAtras.setMonth(hoje.getMonth() - 3);
    
    const defaultFilters = {
      dataInicio: tresMesesAtras.toISOString().split('T')[0],
      dataFim: hoje.toISOString().split('T')[0]
    };
    
    setFilters(defaultFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchHistorico(defaultFilters, { page: 1 });
  }, [fetchHistorico]);

  /**
   * Recarregar dados
   */
  const refresh = useCallback(() => {
    // Limpar cache relacionado
    cache.invalidateByTag('historico');
    
    // Recarregar estatísticas globais e dados filtrados
    fetchGlobalStats();
    fetchHistorico();
  }, [cache, fetchGlobalStats, fetchHistorico]);

  /**
   * Exportar histórico (função básica - pode ser expandida)
   */
  const exportarHistorico = useCallback(async () => {
    try {
      toast.info('Preparando exportação...');
      
      // Buscar todos os dados sem paginação
      const queryParams = buildQueryParams(filters, { page: 1, limit: 10000 });
      const response = await fetch(`/api/historico?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Erro ao exportar dados');
      }
      
      const result = await response.json();
      
      // Preparar dados para exportação
      const csvData = result.data.map((chamado: ChamadoEnriquecido) => ({
        'ID': chamado.id,
        'Data Abertura': chamado.dataAbertura ? new Date(chamado.dataAbertura).toLocaleDateString('pt-BR') : '',
        'Data Execução': chamado.dataExecucao ? new Date(chamado.dataExecucao).toLocaleDateString('pt-BR') : '',
        'Tipo': chamado.tipo === TipoManutencao.CORRETIVA ? 'Corretiva' : 'Preventiva',
        'Status': chamado.status,
        'Prioridade': chamado.prioridade,
        'Título': chamado.titulo || chamado.descricao,
        'Setor': chamado.setorNome,
        'Equipamento': chamado.equipamentoNome,
        'Código Equipamento': chamado.equipamentoCodigo,
        'Agente': chamado.agenteNome,
        'Solicitante': chamado.solicitanteNome,
        'Tempo Execução (dias)': chamado.tempoExecucao || '',
        'Observações': chamado.observacoes || ''
      }));
      
      // Simular download (implementação básica)
      console.log('Dados para exportação:', csvData);
      toast.success(`${csvData.length} registros preparados para exportação`);
      
    } catch (error) {
      toast.error('Erro ao exportar histórico');
      console.error('Erro na exportação:', error);
    }
  }, [buildQueryParams, filters, toast]);

  // Carregamento inicial
  useEffect(() => {
    // Carregar estatísticas globais primeiro
    fetchGlobalStats();
    // Depois carregar dados filtrados
    fetchHistorico();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Informações computadas
  const hasFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== undefined && value !== null && value !== '');
  }, [filters]);

  return {
    // Dados
    chamados,
    loading,
    error,
    pagination,
    stats,
    filters,
    hasFilters,
    
    // Ações
    setFilters: handleFilterChange,
    handlePageChange,
    clearFilters,
    refresh,
    exportarHistorico
  };
};
