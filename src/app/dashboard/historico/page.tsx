'use client';

import React from 'react';
import { useAuth } from '@/context/auth';
import { useHistorico } from '@/hooks/useHistorico';
import { useSetores } from '@/hooks/useSetores';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { useUsers } from '@/hooks/useUsers';
import { Button, Select, DateInput, PageHeader } from '@/components/atoms';
import { DataTable } from '@/components/molecules/DataTable';
import { Badge } from '@/components/atoms/Badge';
import { ChamadoEnriquecido } from '@/hooks/useHistorico';
import { TipoManutencao, ChamadoStatus, PerfilUsuario } from '@/utils/enums';
import { Container, FiltersContainer, FiltersRow, FilterGroup, StatsContainer, StatCard, ExportContainer, StatValue, StatLabel, ExportInfo, PaginationContainer, PageInfo, ErrorMessage } from './styles';

const HistoricoPage = () => {
  const { user } = useAuth();
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

  // Verifica se o usuário atual pode exportar o histórico (apenas GESTAO)
  const canExportHistorico = user?.perfil === PerfilUsuario.GESTAO;

  return (
    <Container className="p-6 max-w-[95vw] mx-auto space-y-6">
      <PageHeader
        title="Histórico de Manutenções"
        subtitle="Acompanhamento completo de todas as manutenções realizadas"
        onExport={canExportHistorico ? handleExport : undefined}
        showExportButton={canExportHistorico}
        exportDisabled={loading || chamados.length === 0}
        showAddButton={false}
      />

      {/* Stats */}
      {stats && (
        <StatsContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <StatValue className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</StatValue>
            <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total de Manutenções</StatLabel>
          </StatCard>
          <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <StatValue className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.porStatus[ChamadoStatus.CONCLUIDO]}</StatValue>
            <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Concluídas</StatLabel>
          </StatCard>
          <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <StatValue className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.porStatus[ChamadoStatus.EM_PROGRESSO]}</StatValue>
            <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Em Andamento</StatLabel>
          </StatCard>
          <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <StatValue className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.porStatus[ChamadoStatus.ABERTO]}</StatValue>
            <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Abertas</StatLabel>
          </StatCard>
          <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <StatValue className="text-2xl font-bold text-gray-900 dark:text-white">{stats.porTipo[TipoManutencao.PREVENTIVA]}</StatValue>
            <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Preventivas</StatLabel>
          </StatCard>
          <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <StatValue className="text-2xl font-bold text-gray-900 dark:text-white">{stats.porTipo[TipoManutencao.CORRETIVA]}</StatValue>
            <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Corretivas</StatLabel>
          </StatCard>
        </StatsContainer>
      )}

      {/* Filtros */}
      <FiltersContainer className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filtros de Pesquisa</h3>
        
        <div className="space-y-4">
          <FiltersRow className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FilterGroup className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Manutenção</label>
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

            <FilterGroup className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
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

            <FilterGroup className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Agente Responsável</label>
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

          <FiltersRow className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FilterGroup className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Equipamento</label>
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

            <FilterGroup className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Setor</label>
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

            <FilterGroup className="flex flex-row items-end gap-3">
              <Button variant="secondary" onClick={clearFilters}>
                Limpar Filtros
              </Button>
              <Button onClick={refresh}>
                Atualizar
              </Button>
            </FilterGroup>
          </FiltersRow>

          <FiltersRow className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FilterGroup className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Início</label>
              <DateInput
                value={filters.dataInicio || ''}
                onChange={(value) => handleFilterChange('dataInicio', value)}
                max={filters.dataFim || undefined}
              />
            </FilterGroup>

            <FilterGroup className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Fim</label>
              <DateInput
                value={filters.dataFim || ''}
                onChange={(value) => handleFilterChange('dataFim', value)}
                min={filters.dataInicio || undefined}
              />
            </FilterGroup>
          </FiltersRow>
        </div>
      </FiltersContainer>

      {/* Exportação */}
      <ExportContainer className="flex items-center justify-between mb-4 py-4">
        <ExportInfo className="text-sm text-gray-500">
          {chamados.length} registros encontrados
        </ExportInfo>
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
        <PaginationContainer className="flex items-center justify-center gap-4 mt-6 py-5">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Anterior
          </Button>
          
          <PageInfo className="text-sm text-gray-600 min-w-[120px] text-center">
            Página {pagination.page} de {pagination.totalPages}
          </PageInfo>
          
          <Button
            variant="outline"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Próxima
          </Button>
        </PaginationContainer>
      )}

      {error && (
        <ErrorMessage className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 mt-4">
          Erro ao carregar histórico: {error}
        </ErrorMessage>
      )}
    </Container>
  );
};

export default HistoricoPage;
