'use client';

import React from 'react';
import { useHistorico } from '@/hooks/useHistorico';
import { useSetores } from '@/hooks/useSetores';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { DateInput } from '@/components/atoms/DateInput';
import { DataTable } from '@/components/molecules/DataTable';
import { Badge } from '@/components/atoms/Badge';
import { ChamadoEnriquecido } from '@/hooks/useHistorico';
import { TipoManutencao, ChamadoStatus } from '@/utils/enums';
import { HistoricoContainer, FiltersContainer, FiltersRow, FilterGroup, StatsContainer, StatCard, ExportContainer } from './styles';

const HistoricoPage: React.FC = () => {
  const { 
    chamados, 
    loading, 
    error, 
    pagination, 
    stats, 
    filters, 
    setFilters, 
    handlePageChange, 
    clearFilters, 
    refresh, 
    exportarHistorico 
  } = useHistorico();
  
  const { allSetores } = useSetores();
  const { allEquipamentos } = useEquipamentos();
  const { allUsers } = useUsers();

  // Atualizar filtros
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value });
  };

  // Exportar histórico
  const handleExport = async () => {
    try {
      await exportarHistorico();
    } catch (error) {
      console.error('Erro ao exportar histórico:', error);
    }
  };

  // Configurações da tabela
  const tableColumns = [
    { 
      key: 'id', 
      title: 'ID',
      width: '80px' 
    },
    { 
      key: 'titulo', 
      title: 'Título' 
    },
    { 
      key: 'tipo', 
      title: 'Tipo',
      render: (value: unknown, chamado: ChamadoEnriquecido) => (
        <Badge 
          variant={
            chamado.tipo === TipoManutencao.PREVENTIVA ? 'success' : 
            chamado.tipo === TipoManutencao.CORRETIVA ? 'warning' : 'default'
          }
        >
          {chamado.tipo === TipoManutencao.PREVENTIVA ? 'Preventiva' : 'Corretiva'}
        </Badge>
      )
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (value: unknown, chamado: ChamadoEnriquecido) => (
        <Badge 
          variant={
            chamado.status === ChamadoStatus.CONCLUIDO ? 'success' : 
            chamado.status === ChamadoStatus.EM_PROGRESSO ? 'warning' : 'danger'
          }
        >
          {chamado.status === ChamadoStatus.CONCLUIDO ? 'Concluído' : 
           chamado.status === ChamadoStatus.EM_PROGRESSO ? 'Em Andamento' : 'Aberto'}
        </Badge>
      )
    },
    { 
      key: 'equipamento', 
      title: 'Equipamento',
      render: (value: unknown, chamado: ChamadoEnriquecido) => chamado.equipamentoNome || 'N/A'
    },
    { 
      key: 'setor', 
      title: 'Setor',
      render: (value: unknown, chamado: ChamadoEnriquecido) => chamado.setorNome || 'N/A'
    },
    { 
      key: 'agente', 
      title: 'Agente',
      render: (value: unknown, chamado: ChamadoEnriquecido) => chamado.agenteNome || 'N/A'
    },
    { 
      key: 'dataAbertura', 
      title: 'Data Abertura',
      render: (value: unknown, chamado: ChamadoEnriquecido) => (
        chamado.dataAbertura ? new Date(chamado.dataAbertura).toLocaleDateString('pt-BR') : '-'
      )
    },
    { 
      key: 'dataFechamento', 
      title: 'Data Fechamento',
      render: (value: unknown, chamado: ChamadoEnriquecido) => (
        chamado.dataExecucao ? new Date(chamado.dataExecucao).toLocaleDateString('pt-BR') : '-'
      )
    }
  ];

  return (
    <HistoricoContainer>
      <div className="header">
        <h1>Histórico de Manutenções</h1>
        <p>Consulte o histórico completo de manutenções com filtros avançados</p>
      </div>

      {/* Estatísticas */}
      {stats && (
        <StatsContainer>
          <StatCard>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total de Manutenções</div>
          </StatCard>
          <StatCard>
            <div className="stat-value">{stats.porStatus[ChamadoStatus.CONCLUIDO]}</div>
            <div className="stat-label">Concluídas</div>
          </StatCard>
          <StatCard>
            <div className="stat-value">{stats.porStatus[ChamadoStatus.EM_PROGRESSO]}</div>
            <div className="stat-label">Em Andamento</div>
          </StatCard>
          <StatCard>
            <div className="stat-value">{stats.porStatus[ChamadoStatus.ABERTO]}</div>
            <div className="stat-label">Abertas</div>
          </StatCard>
          <StatCard>
            <div className="stat-value">{stats.porTipo[TipoManutencao.PREVENTIVA]}</div>
            <div className="stat-label">Preventivas</div>
          </StatCard>
          <StatCard>
            <div className="stat-value">{stats.porTipo[TipoManutencao.CORRETIVA]}</div>
            <div className="stat-label">Corretivas</div>
          </StatCard>
        </StatsContainer>
      )}

      {/* Filtros */}
      <FiltersContainer>
        <h3>Filtros de Pesquisa</h3>
        
        <FiltersRow>
          <FilterGroup>
            <label>Tipo de Manutenção</label>
            <Select
              value={filters.tipo || ''}
              onChange={(e) => handleFilterChange('tipo', e.target.value)}
              options={[
                { value: '', label: 'Todos os tipos' },
                { value: TipoManutencao.PREVENTIVA, label: 'Preventiva' },
                { value: TipoManutencao.CORRETIVA, label: 'Corretiva' }
              ]}
            />
          </FilterGroup>

          <FilterGroup>
            <label>Status</label>
            <Select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={[
                { value: '', label: 'Todos os status' },
                { value: ChamadoStatus.ABERTO, label: 'Aberto' },
                { value: ChamadoStatus.EM_PROGRESSO, label: 'Em Andamento' },
                { value: ChamadoStatus.CONCLUIDO, label: 'Concluído' }
              ]}
            />
          </FilterGroup>

          <FilterGroup>
            <label>Agente Responsável</label>
            <Select
              value={filters.agenteId || ''}
              onChange={(e) => handleFilterChange('agenteId', e.target.value)}
              options={[
                { value: '', label: 'Todos os agentes' },
                ...allUsers.map(user => ({
                  value: user.id.toString(),
                  label: user.nome
                }))
              ]}
            />
          </FilterGroup>
        </FiltersRow>

        <FiltersRow>
          <FilterGroup>
            <label>Equipamento</label>
            <Select
              value={filters.equipamentoId || ''}
              onChange={(e) => handleFilterChange('equipamentoId', e.target.value)}
              options={[
                { value: '', label: 'Todos os equipamentos' },
                ...allEquipamentos.map(eq => ({
                  value: eq.id.toString(),
                  label: eq.nome
                }))
              ]}
            />
          </FilterGroup>

          <FilterGroup>
            <label>Setor</label>
            <Select
              value={filters.setorId || ''}
              onChange={(e) => handleFilterChange('setorId', e.target.value)}
              options={[
                { value: '', label: 'Todos os setores' },
                ...allSetores.map(setor => ({
                  value: setor.id.toString(),
                  label: setor.nome
                }))
              ]}
            />
          </FilterGroup>

          <FilterGroup className="actions">
            <Button variant="secondary" onClick={clearFilters}>
              Limpar Filtros
            </Button>
            <Button onClick={refresh}>
              Atualizar
            </Button>
          </FilterGroup>
        </FiltersRow>

        <FiltersRow>
          <FilterGroup>
            <label>Data Início</label>
            <DateInput
              value={filters.dataInicio || ''}
              onChange={(value) => handleFilterChange('dataInicio', value)}
              max={filters.dataFim || undefined}
            />
          </FilterGroup>

          <FilterGroup>
            <label>Data Fim</label>
            <DateInput
              value={filters.dataFim || ''}
              onChange={(value) => handleFilterChange('dataFim', value)}
              min={filters.dataInicio || undefined}
            />
          </FilterGroup>
        </FiltersRow>
      </FiltersContainer>

      {/* Exportação */}
      <ExportContainer>
        <Button variant="outline" onClick={handleExport}>
          📄 Exportar Histórico
        </Button>
        <span className="export-info">
          {chamados.length} registros encontrados
        </span>
      </ExportContainer>

      {/* Tabela de dados */}
      <DataTable
        data={chamados}
        columns={tableColumns}
        loading={loading}
        emptyMessage="Nenhuma manutenção encontrada com os filtros aplicados"
      />

      {/* Paginação */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Anterior
          </Button>
          
          <span className="page-info">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Próxima
          </Button>
        </div>
      )}

      {error && (
        <div className="error-message">
          Erro ao carregar histórico: {error}
        </div>
      )}
    </HistoricoContainer>
  );
};

export default HistoricoPage;
