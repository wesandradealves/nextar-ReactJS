import { useState, useCallback, useMemo, useEffect } from 'react';
import { useCache } from '@/context/cache';
import { useToast } from '@/hooks/useToast';
import type { Chamado } from '@/types';
import { TipoManutencao, ChamadoStatus } from '@/utils/enums';
import { exportToCSV } from '@/utils/export';

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
  }, [buildQueryParams, cache, toast, pagination]); // Removido 'stats' da dependência

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
   * Exporta o histórico filtrado para CSV
   */
  const exportarHistorico = useCallback(async () => {
    try {
      setLoading(true);
      
      // Buscar todos os dados para exportação (sem paginação)
      const params = new URLSearchParams();
      
      // Aplicar filtros apenas se estiverem definidos
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.status) params.append('status', filters.status);
      if (filters.agenteId) params.append('agenteId', filters.agenteId);
      if (filters.setorId) params.append('setorId', filters.setorId);
      if (filters.equipamentoId) params.append('equipamentoId', filters.equipamentoId);
      if (filters.dataInicio) params.append('dataInicio', filters.dataInicio);
      if (filters.dataFim) params.append('dataFim', filters.dataFim);
      
      // Definir limite alto para trazer todos os registros
      params.append('limit', '1000');
      
      const response = await fetch(`/api/historico?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados para exportação');
      }
      
      const result = await response.json();
      const chamadosData = result.data || [];
      
      // Usar dados já enriquecidos da API
      const exportData = chamadosData;
      
      // Formatadores para campos específicos
      const formatters: Record<string, (value: unknown) => string> = {
        dataAbertura: (value: unknown) => {
          if (typeof value === 'string') {
            return value ? new Date(value).toLocaleDateString('pt-BR') : 'N/A';
          }
          return 'N/A';
        },
        dataExecucao: (value: unknown) => {
          if (typeof value === 'string') {
            return value ? new Date(value).toLocaleDateString('pt-BR') : 'Não finalizado';
          }
          return 'Não finalizado';
        },
        tempoExecucao: (value: unknown) => {
          if (typeof value === 'number') {
            if (value === 0) return 'Não concluído';
            if (value < 60) return `${value} minutos`;
            if (value < 1440) return `${Math.floor(value / 60)} horas`;
            return `${Math.floor(value / 1440)} dias`;
          }
          return 'Não concluído';
          return 'Não concluído';
        },
        status: (value: unknown) => {
          const statusMap: Record<string, string> = {
            'ABERTO': 'Aberto',
            'EM_PROGRESSO': 'Em Progresso',
            'CONCLUIDO': 'Concluído'
          };
          if (typeof value === 'string') {
            return statusMap[value] || value;
          }
          return String(value || '');
        },
        tipo: (value: unknown) => {
          const tipoMap: Record<string, string> = {
            'PREVENTIVA': 'Preventiva',
            'CORRETIVA': 'Corretiva'
          };
          if (typeof value === 'string') {
            return tipoMap[value] || value;
          }
          return String(value || '');
        },
        prioridade: (value: unknown) => {
          const prioridadeMap: Record<string, string> = {
            'BAIXA': 'Baixa',
            'MEDIA': 'Média',
            'ALTA': 'Alta',
            'CRITICA': 'Crítica'
          };
          if (typeof value === 'string') {
            return prioridadeMap[value] || value;
          }
          return String(value || '');
        },
        pecasUtilizadas: (value: unknown) => {
          if (Array.isArray(value)) {
            if (!value.length) return 'Nenhuma peça utilizada';
            return value.map((p: {nome?: string; quantidade?: number | string}) => `${p.nome || 'Sem nome'} (${p.quantidade || 0})`).join('; ');
          }
          return 'Nenhuma peça utilizada';
        }
      };
      
      // Exportar para CSV
      exportToCSV(exportData, {
        filename: 'historico-manutencoes',
        headers: {
          id: 'ID',
          titulo: 'Título',
          tipo: 'Tipo',
          status: 'Status',
          prioridade: 'Prioridade',
          dataAbertura: 'Data de Abertura',
          dataExecucao: 'Data de Execução',
          agenteNome: 'Agente',
          setorNome: 'Setor',
          equipamentoNome: 'Equipamento',
          solicitanteNome: 'Solicitante',
          observacoes: 'Observações',
          pecasUtilizadas: 'Peças Utilizadas'
        },
        formatters
      });
      
      toast.success(
        'Exportação concluída',
        `${exportData.length} registros exportados com sucesso`
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao exportar histórico:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao exportar histórico';
      
      toast.error(
        'Erro na exportação',
        errorMessage
      );
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

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
