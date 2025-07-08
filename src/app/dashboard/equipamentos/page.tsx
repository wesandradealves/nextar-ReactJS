"use client";

import React, { useState, useCallback, useMemo } from 'react';
import CountUp from 'react-countup';
import { useAuth } from '@/context/auth';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { useSetores } from '@/hooks/useSetores';
import { DataTable } from '@/components/molecules';
import { EquipamentoModal } from '@/components/molecules';
import { Button, PageHeader, ToggleSwitch } from '@/components/atoms';
import type { Equipamento, TableColumn, TableAction, CreateEquipamentoData, UpdateEquipamentoData } from '@/types';
import { PerfilUsuario } from '@/utils/enums';
import { useMetadata } from '@/hooks/useMetadata';

// Usando os mesmos estilos da página de setores (podemos compartilhar)
import { 
  SetoresPageContainer as EquipamentosPageContainer,
  FilterSection,
  FilterButton,
  StatsContainer,
  StatCard,
  StatValue,
  StatLabel
} from '../setores/styles';

/**
 * Página de Gestão de Equipamentos
 * Módulo completo para administração de equipamentos do sistema
 * Inclui CRUD, permissões, filtros e cache otimizado
 * 
 * @description
 * Esta página permite:
 * - Listar equipamentos com paginação e busca
 * - Filtrar por setor e status
 * - Criar, editar e excluir equipamentos (com permissões)
 * - Seleção em lote para ações múltiplas
 * - Cache otimizado para performance
 * - Validação de códigos hexadecimais
 * - Gestão de datas de manutenção
 * 
 * @permissions
 * - Apenas usuários com perfil GESTAO podem acessar
 * - Operações de criação/edição/exclusão requerem GESTAO
 */
export default function EquipamentosPage() {
  const { user: currentUser } = useAuth();
  const [selectedEquipamentos, setSelectedEquipamentos] = useState<string[]>([]);

  useMetadata({
    title: `Nextar - Equipamentos`,
    ogTitle: `Nextar - Equipamentos`
  });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipamento, setEditingEquipamento] = useState<Equipamento | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  // Hook de equipamentos com cache
  const {
    equipamentos,
    equipamentoStats,
    pagination,
    sorting,
    loading,
    error,
    searchTerm,
    filters,
    handlePageChange,
    handleSearch,
    handleSortChange,
    createEquipamento,
    updateEquipamento,
    deleteEquipamento,
    filterBySetor,
    filterByStatus,
    clearFilters,
    exportEquipamentosCSV
  } = useEquipamentos();

  // Hook de setores para filtros
  const { allSetores } = useSetores();

  /**
   * Verifica se usuário atual tem permissão de gestão
   */
  const hasManagePermission = useMemo(() => {
    return currentUser?.perfil === PerfilUsuario.GESTAO;
  }, [currentUser]);

  /**
   * Manipula exclusão de equipamento
   */
  const handleDeleteEquipamento = useCallback(async (equipamento: Equipamento) => {
    if (!window.confirm(`Tem certeza que deseja excluir o equipamento ${equipamento.nome}?`)) {
      return;
    }

    const success = await deleteEquipamento(equipamento.id);
    if (success) {
      // Remover da seleção se estava selecionado
      setSelectedEquipamentos(prev => prev.filter(id => id !== equipamento.id));
    }
  }, [deleteEquipamento]);

  /**
   * Manipula ativação/desativação de equipamento
   */
  const handleToggleEquipamentoStatus = useCallback(async (equipamento: Equipamento) => {
    const newStatus = !equipamento.ativo;
    
    try {
      await updateEquipamento(equipamento.id, { ativo: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar status do equipamento:', error);
    }
  }, [updateEquipamento]);

  /**
   * Formata data de criação com tempo relativo
   */
  const formatCreationDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days} dias atrás`;
    
    // Formato brasileiro para datas mais antigas
    const year = date.getFullYear();
    const currentYear = now.getFullYear();
    const formatStr = year === currentYear ? 'DD/MM' : 'DD/MM/YYYY';
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: formatStr.includes('YYYY') ? 'numeric' : undefined
    });
  }, []);

  /**
   * Formata data de manutenção
   */
  const formatMaintenanceDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return (
        <span className="text-red-500 font-medium">
          Vencida ({Math.abs(diffDays)} dias)
        </span>
      );
    } else if (diffDays <= 30) {
      return (
        <span className="text-amber-500 font-medium">
          {diffDays} dias
        </span>
      );
    } else {
      return (
        <span className="text-emerald-500 font-medium">
          {date.toLocaleDateString('pt-BR')}
        </span>
      );
    }
  }, []);

  /**
   * Obtém nome do setor
   */
  const getSetorNome = useCallback((setorId: string) => {
    const setor = allSetores.find(s => s.id === setorId);
    return setor ? setor.nome : 'Setor não encontrado';
  }, [allSetores]);

  /**
   * Configuração das colunas da tabela
   */
  const columns: TableColumn<Equipamento>[] = useMemo(() => [
    {
      key: 'nome',
      title: 'Nome',
      sortable: true,
      width: '25%'
    },
    {
      key: 'codigo',
      title: 'Código',
      sortable: true,
      width: '12%',
      render: (value: unknown) => (
        <span className="font-mono text-sm bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
          {value as string}
        </span>
      )
    },
    {
      key: 'modelo',
      title: 'Modelo',
      sortable: true,
      width: '20%',
      hideOnMobile: true
    },
    {
      key: 'setorId',
      title: 'Setor',
      sortable: false,
      width: '15%',
      hideOnMobile: true,
      render: (value: unknown) => getSetorNome(value as string)
    },
    {
      key: 'proximaManutencao',
      title: 'Próx. Manutenção',
      sortable: true,
      width: '15%',
      hideOnMobile: true,
      render: (value: unknown) => formatMaintenanceDate(value as string)
    },
    {
      key: 'dataCriacao',
      title: 'Criado em',
      sortable: true,
      width: '12%',
      hideOnMobile: true,
      render: (value: unknown) => formatCreationDate(value as string)
    },
    {
      key: 'status',
      title: 'Status',
      sortable: false,
      width: '13%',
      align: 'center',
      render: (_, equipamento: Equipamento) => (
        <div className="flex items-center gap-3 justify-center">
          <ToggleSwitch
            checked={equipamento.ativo}
            onChange={() => handleToggleEquipamentoStatus(equipamento)}
            disabled={!hasManagePermission}
            size="small"
            data-testid={`equipamento-toggle-${equipamento.id}`}
          />
          <span className={`text-sm font-medium ${
            equipamento.ativo ? 'text-green-600' : 'text-red-600'
          }`}>
            {equipamento.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      )
    }
  ], [hasManagePermission, handleToggleEquipamentoStatus, formatCreationDate, formatMaintenanceDate, getSetorNome]);

  /**
   * Handlers do modal
   */
  const handleCreateEquipamento = useCallback(() => {
    setModalMode('create');
    setEditingEquipamento(undefined);
    setIsModalOpen(true);
  }, []);

  /**
   * Abre modal para visualizar equipamento
   */
  const handleViewEquipamento = useCallback((equipamento: Equipamento) => {
    setModalMode('view');
    setEditingEquipamento(equipamento);
    setIsModalOpen(true);
  }, []);

  /**
   * Abre modal para editar equipamento
   */
  const handleEditEquipamento = useCallback((equipamento: Equipamento) => {
    setModalMode('edit');
    setEditingEquipamento(equipamento);
    setIsModalOpen(true);
  }, []);

  /**
   * Fecha modal e limpa estados
   */
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingEquipamento(undefined);
    setModalMode('create');
  }, []);

  /**
   * Ações disponíveis para cada equipamento
   */
  const actions: TableAction<Equipamento>[] = useMemo(() => {
    const baseActions = [
      {
        key: 'view',
        title: 'Visualizar',
        icon: '👁️',
        variant: 'secondary' as const,
        onClick: handleViewEquipamento
      }
    ];

    if (!hasManagePermission) return baseActions;

    return [
      ...baseActions,
      {
        key: 'edit',
        title: 'Editar',
        icon: '✏️',
        variant: 'primary' as const,
        onClick: handleEditEquipamento
      },
      {
        key: 'delete',
        title: 'Excluir',
        icon: '🗑️',
        variant: 'danger' as const,
        onClick: handleDeleteEquipamento
      }
    ];
  }, [hasManagePermission, handleDeleteEquipamento, handleEditEquipamento, handleViewEquipamento]);

  /**
   * Manipula seleção de equipamentos
   */
  const handleSelectionChange = useCallback((newSelection: string[]) => {
    setSelectedEquipamentos(newSelection);
  }, []);

  /**
   * Ações em lote
   */
  const handleBulkAction = useCallback(async (action: 'delete' | 'activate' | 'deactivate') => {
    if (selectedEquipamentos.length === 0) return;

    const actionNames = {
      delete: 'excluir',
      activate: 'ativar',
      deactivate: 'desativar'
    };

    if (!window.confirm(
      `Tem certeza que deseja ${actionNames[action]} ${selectedEquipamentos.length} equipamento(s) selecionado(s)?`
    )) {
      return;
    }

    if (action === 'delete') {
      // Excluir equipamentos selecionados
      const promises = selectedEquipamentos.map(equipamentoId => deleteEquipamento(equipamentoId));
      await Promise.all(promises);
      setSelectedEquipamentos([]);
    }
    
    // Outras ações seriam implementadas aqui
  }, [selectedEquipamentos, deleteEquipamento]);

  const handleSubmitEquipamento = useCallback(async (data: CreateEquipamentoData | UpdateEquipamentoData, equipamentoId?: string) => {
    try {
      if (equipamentoId && editingEquipamento) {
        // Editar equipamento existente
        await updateEquipamento(equipamentoId, data as UpdateEquipamentoData);
      } else {
        // Criar novo equipamento
        await createEquipamento(data as CreateEquipamentoData);
      }
    } catch (error) {
      console.error('Erro ao processar equipamento:', error);
      throw error; // Re-throw para que o modal possa capturar
    }
  }, [editingEquipamento, updateEquipamento, createEquipamento]);

  return (
    <EquipamentosPageContainer className="p-6 max-w-[95vw] mx-auto space-y-6">
      {/* Header da página */}
      <PageHeader
        title={hasManagePermission ? 'Gestão de Equipamentos' : 'Equipamentos'}
        subtitle={hasManagePermission ? 
          'Gerencie equipamentos, códigos e cronograma de manutenções' :
          'Visualize equipamentos e histórico de manutenções'
        }
        showExportButton={hasManagePermission}
        showAddButton={hasManagePermission}
        onExport={exportEquipamentosCSV}
        onAdd={handleCreateEquipamento}
        exportDisabled={loading || !equipamentos.length}
        addLabel="+ Novo "
      />

      {/* Estatísticas */}
      <StatsContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <StatValue className="text-2xl font-bold text-gray-900 dark:text-white">
            <CountUp
              end={equipamentoStats.total}
              duration={1.2}
              separator="."
            />
          </StatValue>
          <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total de Equipamentos</StatLabel>
        </StatCard>
        <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <StatValue className="text-2xl font-bold text-green-600 dark:text-green-400">
            <CountUp
              end={equipamentoStats.ativos}
              duration={1.0}
              separator="."
            />
          </StatValue>
          <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ativos</StatLabel>
        </StatCard>
        <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <StatValue className="text-2xl font-bold text-red-600 dark:text-red-400">
            <CountUp
              end={equipamentoStats.inativos}
              duration={1.0}
              separator="."
            />
          </StatValue>
          <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Inativos</StatLabel>
        </StatCard>
        <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <StatValue className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            <CountUp
              end={equipamentoStats.manutencaoVencida}
              duration={1.4}
              separator="."
            />
          </StatValue>
          <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manutenção Vencida</StatLabel>
        </StatCard>
        <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <StatValue className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            <CountUp
              end={equipamentoStats.manutencaoProxima}
              duration={1.6}
              separator="."
            />
          </StatValue>
          <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manutenção Próxima</StatLabel>
        </StatCard>
      </StatsContainer>

      {/* Filtros */}
      <FilterSection className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          <FilterButton
            $active={!filters.setorId && filters.ativo === undefined}
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Todos
          </FilterButton>
          {allSetores.slice(0, 5).map((setor) => (
            <FilterButton
              key={setor.id}
              $active={filters.setorId === setor.id}
              onClick={() => filterBySetor(setor.id)}
              className="px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {setor.nome}
            </FilterButton>
          ))}
          <FilterButton
            $active={filters.ativo === true}
            onClick={() => filterByStatus(true)}
            className="px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apenas Ativos
          </FilterButton>
          <FilterButton
            $active={filters.ativo === false}
            onClick={() => filterByStatus(false)}
            className="px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apenas Inativos
          </FilterButton>
        </div>

        {selectedEquipamentos.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="danger"
              size="small"
              onClick={() => handleBulkAction('delete')}
            >
              Excluir Selecionados ({selectedEquipamentos.length})
            </Button>
          </div>
        )}
      </FilterSection>

      {/* Tabela de equipamentos */}
      <DataTable
        data={equipamentos}
        columns={columns}
        actions={actions}
        loading={loading}
        pagination={pagination}
        sorting={sorting}
        selectable={hasManagePermission}
        selectedRows={selectedEquipamentos}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        onSelectionChange={handleSelectionChange}
        onSearch={handleSearch}
        emptyMessage={
          error ? 
            `Erro ao carregar equipamentos: ${error}` : 
            searchTerm ? 
              "Nenhum equipamento encontrado para o termo pesquisado" :
              "Nenhum equipamento cadastrado no sistema"
        }
      />

      {/* Modal de criação/edição de equipamentos */}
      <EquipamentoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEquipamento}
        equipamento={editingEquipamento}
        isLoading={loading}
        mode={modalMode}
      />
    </EquipamentosPageContainer>
  );
}
