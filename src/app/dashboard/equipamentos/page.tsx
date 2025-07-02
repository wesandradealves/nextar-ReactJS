"use client";

import React, { useState, useCallback, useMemo } from 'react';
import CountUp from 'react-countup';
import { useAuth } from '@/context/auth';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { useSetores } from '@/hooks/useSetores';
import { DataTable } from '@/components/molecules';
import { EquipamentoModal } from '@/components/molecules';
import { Button } from '@/components/atoms';
import type { Equipamento, TableColumn, TableAction, CreateEquipamentoData, UpdateEquipamentoData } from '@/types';
import { PerfilUsuario } from '@/utils/enums';
import { useMetadata } from '@/hooks/useMetadata';

// Usando os mesmos estilos da página de setores (podemos compartilhar)
import { 
  SetoresPageContainer as EquipamentosPageContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  HeaderActions,
  FilterSection,
  FilterButton,
  StatsContainer,
  StatCard,
  StatValue,
  StatLabel,
  ClickableStatus,
  StatusDot
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
    clearFilters
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
        <span style={{ color: '#ef4444', fontWeight: '500' }}>
          Vencida ({Math.abs(diffDays)} dias)
        </span>
      );
    } else if (diffDays <= 30) {
      return (
        <span style={{ color: '#f59e0b', fontWeight: '500' }}>
          {diffDays} dias
        </span>
      );
    } else {
      return (
        <span style={{ color: '#10b981', fontWeight: '500' }}>
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
        <span style={{
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          backgroundColor: '#f1f5f9',
          padding: '2px 6px',
          borderRadius: '4px',
          color: '#475569'
        }}>
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'center'
        }}>
          <input
            type="checkbox"
            checked={equipamento.ativo}
            onChange={() => handleToggleEquipamentoStatus(equipamento)}
            disabled={!hasManagePermission}
            style={{
              width: '16px',
              height: '16px',
              cursor: hasManagePermission ? 'pointer' : 'not-allowed'
            }}
          />
          <ClickableStatus
            onClick={hasManagePermission ? () => handleToggleEquipamentoStatus(equipamento) : undefined}
            $isActive={equipamento.ativo}
            $isClickable={hasManagePermission}
            title={hasManagePermission ? 
              `Clique para ${equipamento.ativo ? 'desativar' : 'ativar'} o equipamento` : 
              'Status do equipamento'
            }
          >
            <StatusDot $isActive={equipamento.ativo} />
            {equipamento.ativo ? 'Ativo' : 'Inativo'}
          </ClickableStatus>
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
    <EquipamentosPageContainer>
      {/* Header da página */}
      <PageHeader>
        <div>
          <PageTitle>
            {hasManagePermission ? 'Gestão de Equipamentos' : 'Equipamentos'}
          </PageTitle>
          <PageSubtitle>
            {hasManagePermission ? 
              'Gerencie equipamentos, códigos e cronograma de manutenções' :
              'Visualize equipamentos e histórico de manutenções'
            }
          </PageSubtitle>
        </div>
        
        <HeaderActions>
          {hasManagePermission && (
            <Button
              variant="primary"
              onClick={handleCreateEquipamento}
            >
              + Novo Equipamento
            </Button>
          )}
        </HeaderActions>
      </PageHeader>

      {/* Estatísticas */}
      <StatsContainer>
        <StatCard>
          <StatValue>
            <CountUp
              end={equipamentoStats.total}
              duration={1.2}
              separator="."
            />
          </StatValue>
          <StatLabel>Total de Equipamentos</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue style={{ color: '#10b981' }}>
            <CountUp
              end={equipamentoStats.ativos}
              duration={1.0}
              separator="."
            />
          </StatValue>
          <StatLabel>Ativos</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue style={{ color: '#ef4444' }}>
            <CountUp
              end={equipamentoStats.inativos}
              duration={1.0}
              separator="."
            />
          </StatValue>
          <StatLabel>Inativos</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue style={{ color: '#f59e0b' }}>
            <CountUp
              end={equipamentoStats.manutencaoVencida}
              duration={1.4}
              separator="."
            />
          </StatValue>
          <StatLabel>Manutenção Vencida</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue style={{ color: '#3b82f6' }}>
            <CountUp
              end={equipamentoStats.manutencaoProxima}
              duration={1.6}
              separator="."
            />
          </StatValue>
          <StatLabel>Manutenção Próxima</StatLabel>
        </StatCard>
      </StatsContainer>

      {/* Filtros */}
      <FilterSection>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <FilterButton
            $active={!filters.setorId && filters.ativo === undefined}
            onClick={clearFilters}
          >
            Todos
          </FilterButton>
          {allSetores.slice(0, 5).map((setor) => (
            <FilterButton
              key={setor.id}
              $active={filters.setorId === setor.id}
              onClick={() => filterBySetor(setor.id)}
            >
              {setor.nome}
            </FilterButton>
          ))}
          <FilterButton
            $active={filters.ativo === true}
            onClick={() => filterByStatus(true)}
          >
            Apenas Ativos
          </FilterButton>
          <FilterButton
            $active={filters.ativo === false}
            onClick={() => filterByStatus(false)}
          >
            Apenas Inativos
          </FilterButton>
        </div>

        {selectedEquipamentos.length > 0 && (
          <div style={{ display: 'flex', gap: '8px' }}>
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
