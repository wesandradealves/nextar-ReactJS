"use client";

import React, { useState, useCallback, useMemo } from 'react';
import CountUp from 'react-countup';
import { useAuth } from '@/context/auth';
import { useSetores } from '@/hooks/useSetores';
import { DataTable } from '@/components/molecules';
import { SetorModal } from '@/components/molecules';
import { Button, PageHeader } from '@/components/atoms';
import type { Setor, TableColumn, TableAction, CreateSetorData, UpdateSetorData } from '@/types';
import { PerfilUsuario, CATEGORIAS_CIENTIFICAS } from '@/utils/enums';
import { 
  SetoresPageContainer,
  FilterSection,
  FilterButton,
  StatsContainer,
  StatCard,
  StatValue,
  StatLabel,
  ClickableStatus,
  StatusDot
} from './styles';
import { useMetadata } from '@/hooks/useMetadata';

/**
 * Página de Gestão de Setores
 * Módulo completo para administração de setores do sistema
 * Inclui CRUD, permissões, filtros e cache otimizado
 * 
 * @description
 * Esta página permite:
 * - Listar setores com paginação e busca
 * - Filtrar por categoria e status
 * - Criar, editar e excluir setores (com permissões)
 * - Seleção em lote para ações múltiplas
 * - Cache otimizado para performance
 * 
 * @permissions
 * - Apenas usuários com perfil GESTAO podem acessar
 * - Operações de criação/edição/exclusão requerem GESTAO
 */
export default function SetoresPage() {
  const { user: currentUser } = useAuth();
  const [selectedSetores, setSelectedSetores] = useState<string[]>([]);

  useMetadata({
    title: `Nextar - Setores`,
    ogTitle: `Nextar - Setores`
  });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetor, setEditingSetor] = useState<Setor | undefined>(undefined);

  // Hook de setores com cache
  const {
    setores,
    setorStats,
    pagination,
    sorting,
    loading,
    error,
    searchTerm,
    filters,
    handlePageChange,
    handleSearch,
    handleSortChange,
    createSetor,
    updateSetor,
    deleteSetor,
    filterByCategoria,
    filterByStatus,
    clearFilters,
    exportSetoresCSV
  } = useSetores();

  /**
   * Verifica se usuário atual tem permissão de gestão
   */
  const hasManagePermission = useMemo(() => {
    return currentUser?.perfil === PerfilUsuario.GESTAO;
  }, [currentUser]);

  /**
   * Manipula exclusão de setor
   */
  const handleDeleteSetor = useCallback(async (setor: Setor) => {
    if (!window.confirm(`Tem certeza que deseja excluir o setor ${setor.nome}?`)) {
      return;
    }

    const success = await deleteSetor(setor.id);
    if (success) {
      // Remover da seleção se estava selecionado
      setSelectedSetores(prev => prev.filter(id => id !== setor.id));
    }
  }, [deleteSetor]);

  /**
   * Manipula ativação/desativação de setor
   */
  const handleToggleSetorStatus = useCallback(async (setor: Setor) => {
    const newStatus = !setor.ativo;
    
    try {
      await updateSetor(setor.id, { ativo: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar status do setor:', error);
    }
  }, [updateSetor]);

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
   * Configuração das colunas da tabela
   */
  const columns: TableColumn<Setor>[] = useMemo(() => [
    {
      key: 'nome',
      title: 'Nome',
      sortable: true,
      width: '30%'
    },
    {
      key: 'categoria',
      title: 'Categoria',
      sortable: true,
      width: '20%',
      render: (value: unknown) => {
        const categoria = value as string;
        
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '500',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            border: '1px solid #e2e8f0'
          }}>
            {categoria}
          </span>
        );
      }
    },
    {
      key: 'equipamentosCount',
      title: 'Equipamentos',
      sortable: true,
      width: '12%',
      align: 'center',
      hideOnMobile: true,
      render: (value: unknown) => (
        <span style={{ fontWeight: '500' }}>
          {value as number}
        </span>
      )
    },
    {
      key: 'dataCriacao',
      title: 'Criado em',
      sortable: true,
      width: '15%',
      hideOnMobile: true,
      render: (value: unknown) => formatCreationDate(value as string)
    },
    {
      key: 'status',
      title: 'Status',
      sortable: false,
      width: '13%',
      align: 'center',
      render: (_, setor: Setor) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'center'
        }}>
          <input
            type="checkbox"
            checked={setor.ativo}
            onChange={() => handleToggleSetorStatus(setor)}
            disabled={!hasManagePermission}
            style={{
              width: '16px',
              height: '16px',
              cursor: hasManagePermission ? 'pointer' : 'not-allowed'
            }}
          />
          <ClickableStatus
            onClick={hasManagePermission ? () => handleToggleSetorStatus(setor) : undefined}
            $isActive={setor.ativo}
            $isClickable={hasManagePermission}
            title={hasManagePermission ? 
              `Clique para ${setor.ativo ? 'desativar' : 'ativar'} o setor` : 
              'Status do setor'
            }
          >
            <StatusDot $isActive={setor.ativo} />
            {setor.ativo ? 'Ativo' : 'Inativo'}
          </ClickableStatus>
        </div>
      )
    }
  ], [hasManagePermission, handleToggleSetorStatus, formatCreationDate]);

  /**
   * Handlers do modal
   */
  const handleCreateSetor = useCallback(() => {
    setEditingSetor(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEditSetor = useCallback((setor: Setor) => {
    setEditingSetor(setor);
    setIsModalOpen(true);
  }, []);

  /**
   * Ações disponíveis para cada setor
   */
  const actions: TableAction<Setor>[] = useMemo(() => {
    if (!hasManagePermission) return [];

    return [
      {
        key: 'edit',
        title: 'Editar',
        icon: '✏️',
        variant: 'primary',
        onClick: handleEditSetor
      },
      {
        key: 'delete',
        title: 'Excluir',
        icon: '🗑️',
        variant: 'danger',
        onClick: handleDeleteSetor
      }
    ];
  }, [hasManagePermission, handleDeleteSetor, handleEditSetor]);

  /**
   * Manipula seleção de setores
   */
  const handleSelectionChange = useCallback((newSelection: string[]) => {
    setSelectedSetores(newSelection);
  }, []);

  /**
   * Ações em lote
   */
  const handleBulkAction = useCallback(async (action: 'delete' | 'activate' | 'deactivate') => {
    if (selectedSetores.length === 0) return;

    const actionNames = {
      delete: 'excluir',
      activate: 'ativar',
      deactivate: 'desativar'
    };

    if (!window.confirm(
      `Tem certeza que deseja ${actionNames[action]} ${selectedSetores.length} setor(es) selecionado(s)?`
    )) {
      return;
    }

    if (action === 'delete') {
      // Excluir setores selecionados
      const promises = selectedSetores.map(setorId => deleteSetor(setorId));
      await Promise.all(promises);
      setSelectedSetores([]);
    }
    
    // Outras ações seriam implementadas aqui
  }, [selectedSetores, deleteSetor]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingSetor(undefined);
  }, []);

  const handleSubmitSetor = useCallback(async (data: CreateSetorData | UpdateSetorData, setorId?: string) => {
    if (setorId && editingSetor) {
      // Editar setor existente
      await updateSetor(setorId, data as UpdateSetorData);
    } else {
      // Criar novo setor
      await createSetor(data as CreateSetorData);
    }
  }, [editingSetor, updateSetor, createSetor]);

  // Verificar permissões de acesso
  if (!hasManagePermission) {
    return (
      <SetoresPageContainer>
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: '#64748b'
        }}>
          <h2>Acesso Negado</h2>
          <p>Você não tem permissão para acessar esta página.</p>
          <p>Apenas usuários com perfil de Gestão podem gerenciar setores.</p>
        </div>
      </SetoresPageContainer>
    );
  }

  return (
    <SetoresPageContainer>
      {/* Header da página */}
      <PageHeader
        title="Gestão de Setores"
        subtitle="Gerencie setores, categorias e equipamentos do sistema"
        showExportButton={hasManagePermission}
        showAddButton={hasManagePermission}
        onExport={exportSetoresCSV}
        onAdd={handleCreateSetor}
        exportDisabled={loading || !setores.length}
        addLabel="+ Novo "
      />

      {/* Estatísticas */}
      <StatsContainer>
        <StatCard>
          <StatValue>
            <CountUp
              end={setorStats.total}
              duration={1.2}
              separator="."
            />
          </StatValue>
          <StatLabel>Total de Setores</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue style={{ color: '#10b981' }}>
            <CountUp
              end={setorStats.ativos}
              duration={1.0}
              separator="."
            />
          </StatValue>
          <StatLabel>Ativos</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue style={{ color: '#ef4444' }}>
            <CountUp
              end={setorStats.inativos}
              duration={1.0}
              separator="."
            />
          </StatValue>
          <StatLabel>Inativos</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            <CountUp
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              end={(setorStats as any).Biologia || 0}
              duration={1.4}
              separator="."
            />
          </StatValue>
          <StatLabel>Biologia</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            <CountUp
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              end={(setorStats as any).Meteorologia || 0}
              duration={1.6}
              separator="."
            />
          </StatValue>
          <StatLabel>Meteorologia</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            <CountUp
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              end={(setorStats as any).Medicina || 0}
              duration={1.8}
              separator="."
            />
          </StatValue>
          <StatLabel>Medicina</StatLabel>
        </StatCard>
      </StatsContainer>

      {/* Filtros */}
      <FilterSection>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <FilterButton
            $active={!filters.categoria}
            onClick={clearFilters}
          >
            Todos
          </FilterButton>
          {CATEGORIAS_CIENTIFICAS.map((categoria) => (
            <FilterButton
              key={categoria}
              $active={filters.categoria === categoria}
              onClick={() => filterByCategoria(categoria)}
            >
              {categoria}
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

        {selectedSetores.length > 0 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="danger"
              size="small"
              onClick={() => handleBulkAction('delete')}
            >
              Excluir Selecionados ({selectedSetores.length})
            </Button>
          </div>
        )}
      </FilterSection>

      {/* Tabela de setores */}
      <DataTable
        data={setores}
        columns={columns}
        actions={actions}
        loading={loading}
        pagination={pagination}
        sorting={sorting}
        selectable={hasManagePermission}
        selectedRows={selectedSetores}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        onSelectionChange={handleSelectionChange}
        onSearch={handleSearch}
        emptyMessage={
          error ? 
            `Erro ao carregar setores: ${error}` : 
            searchTerm ? 
              "Nenhum setor encontrado para o termo pesquisado" :
              "Nenhum setor cadastrado no sistema"
        }
      />

      {/* Modal de criação/edição de setores */}
      <SetorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitSetor}
        setor={editingSetor}
        isLoading={loading}
      />
    </SetoresPageContainer>
  );
}
