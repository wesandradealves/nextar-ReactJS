"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { useUsers } from '@/hooks/useUsers';
import { DataTable, UserModal } from '@/components/molecules';
import { Button } from '@/components/atoms';
import type { User, TableColumn, TableAction, CreateUserData, UpdateUserData } from '@/types';
import { PerfilUsuario } from '@/utils/enums';
import { 
  UsersPageContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  HeaderActions,
  FilterSection,
  FilterButton,
  StatsContainer,
  StatCard,
  StatValue,
  StatLabel
} from './styles';

/**
 * Página de Gestão de Usuários
 * Módulo completo para administração de usuários do sistema
 * Inclui CRUD, permissões, filtros e cache otimizado
 * 
 * @description
 * Esta página permite:
 * - Listar usuários com paginação e busca
 * - Filtrar por perfil e status
 * - Criar, editar e excluir usuários (com permissões)
 * - Seleção em lote para ações múltiplas
 * - Cache otimizado para performance
 * 
 * @permissions
 * - Apenas usuários com perfil GESTAO podem acessar
 * - Operações de criação/edição/exclusão requerem GESTAO
 */
export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

  // Hook de usuários com cache
  const {
    users,
    pagination,
    sorting,
    loading,
    error,
    searchTerm,
    filters,
    handlePageChange,
    handleSearch,
    handleSortChange,
    createUser,
    updateUser,
    deleteUser,
    filterByProfile,
    clearFilters
  } = useUsers();

  /**
   * Verifica se usuário atual tem permissão de gestão
   */
  const hasManagePermission = useMemo(() => {
    return currentUser?.perfil === PerfilUsuario.GESTAO;
  }, [currentUser]);

  /**
   * Manipula exclusão de usuário
   */
  const handleDeleteUser = useCallback(async (user: User) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário ${user.nome}?`)) {
      return;
    }

    const success = await deleteUser(user.id);
    if (success) {
      // Remover da seleção se estava selecionado
      setSelectedUsers(prev => prev.filter(id => id !== user.id));
    }
  }, [deleteUser]);

  /**
   * Estatísticas dos usuários
   */
  const userStats = useMemo(() => {
    if (!users.length) return { total: 0, pesquisadores: 0, agentes: 0, gestores: 0 };
    
    return {
      total: users.length,
      pesquisadores: users.filter(u => u.perfil === PerfilUsuario.PESQUISADOR).length,
      agentes: users.filter(u => u.perfil === PerfilUsuario.AGENTE).length,
      gestores: users.filter(u => u.perfil === PerfilUsuario.GESTAO).length
    };
  }, [users]);

  /**
   * Configuração das colunas da tabela
   */
  const columns: TableColumn<User>[] = useMemo(() => [
    {
      key: 'nome',
      title: 'Nome',
      sortable: true,
      width: '30%'
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
      width: '35%',
      hideOnMobile: true
    },
    {
      key: 'perfil',
      title: 'Perfil',
      sortable: true,
      width: '20%',
      render: (value: unknown) => {
        const perfil = value as PerfilUsuario;
        const profiles = {
          [PerfilUsuario.PESQUISADOR]: { label: 'Pesquisador', color: '#10b981', bg: '#d1fae5' },
          [PerfilUsuario.AGENTE]: { label: 'Agente', color: '#3b82f6', bg: '#dbeafe' },
          [PerfilUsuario.GESTAO]: { label: 'Gestão', color: '#8b5cf6', bg: '#e9d5ff' }
        };
        
        const profile = profiles[perfil] || { label: perfil, color: '#6b7280', bg: '#f3f4f6' };
        
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '500',
            backgroundColor: profile.bg,
            color: profile.color,
            border: `1px solid ${profile.color}40`
          }}>
            {profile.label}
          </span>
        );
      }
    },
    {
      key: 'status',
      title: 'Status',
      sortable: false,
      width: '15%',
      align: 'center',
      render: () => (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.875rem',
          color: '#10b981'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981'
          }} />
          Ativo
        </span>
      )
    }
  ], []);

  /**
   * Handlers do modal
   */
  const handleCreateUser = useCallback(() => {
    setEditingUser(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  }, []);

  /**
   * Ações disponíveis para cada usuário
   */
  const actions: TableAction<User>[] = useMemo(() => {
    if (!hasManagePermission) return [];

    return [
      {
        key: 'edit',
        title: 'Editar',
        icon: '✏️',
        variant: 'primary',
        onClick: handleEditUser
      },
      {
        key: 'delete',
        title: 'Excluir',
        icon: '🗑️',
        variant: 'danger',
        onClick: handleDeleteUser,
        disabled: (user) => user.perfil === PerfilUsuario.GESTAO && user.id === currentUser?.id
      }
    ];
  }, [hasManagePermission, currentUser, handleDeleteUser, handleEditUser]);

  /**
   * Manipula seleção de usuários
   */
  const handleSelectionChange = useCallback((newSelection: string[]) => {
    setSelectedUsers(newSelection);
  }, []);

  /**
   * Ações em lote
   */
  const handleBulkAction = useCallback(async (action: 'delete' | 'activate' | 'deactivate') => {
    if (selectedUsers.length === 0) return;

    const actionNames = {
      delete: 'excluir',
      activate: 'ativar',
      deactivate: 'desativar'
    };

    if (!window.confirm(
      `Tem certeza que deseja ${actionNames[action]} ${selectedUsers.length} usuário(s) selecionado(s)?`
    )) {
      return;
    }

    if (action === 'delete') {
      // Excluir usuários selecionados
      const promises = selectedUsers.map(userId => deleteUser(userId));
      await Promise.all(promises);
      setSelectedUsers([]);
    }
    
    // Outras ações seriam implementadas aqui
  }, [selectedUsers, deleteUser]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingUser(undefined);
  }, []);

  const handleSubmitUser = useCallback(async (data: CreateUserData | UpdateUserData, userId?: string) => {
    if (userId && editingUser) {
      // Editar usuário existente
      await updateUser(userId, data as UpdateUserData);
    } else {
      // Criar novo usuário
      await createUser(data as CreateUserData);
    }
  }, [editingUser, updateUser, createUser]);

  // Verificar permissões de acesso
  if (!hasManagePermission) {
    return (
      <UsersPageContainer>
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: '#64748b'
        }}>
          <h2>Acesso Negado</h2>
          <p>Você não tem permissão para acessar esta página.</p>
          <p>Apenas usuários com perfil de Gestão podem gerenciar usuários.</p>
        </div>
      </UsersPageContainer>
    );
  }

  return (
    <UsersPageContainer>
      {/* Header da página */}
      <PageHeader>
        <div>
          <PageTitle>Gestão de Usuários</PageTitle>
          <PageSubtitle>
            Gerencie usuários, perfis e permissões do sistema
          </PageSubtitle>
        </div>
        
        <HeaderActions>
          {hasManagePermission && (
            <Button
              variant="primary"
              onClick={handleCreateUser}
            >
              + Novo Usuário
            </Button>
          )}
        </HeaderActions>
      </PageHeader>

      {/* Estatísticas */}
      <StatsContainer>
        <StatCard>
          <StatValue>{userStats.total}</StatValue>
          <StatLabel>Total de Usuários</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{userStats.pesquisadores}</StatValue>
          <StatLabel>Pesquisadores</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{userStats.agentes}</StatValue>
          <StatLabel>Agentes</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{userStats.gestores}</StatValue>
          <StatLabel>Gestores</StatLabel>
        </StatCard>
      </StatsContainer>

      {/* Filtros */}
      <FilterSection>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <FilterButton
            $active={!filters.perfil}
            onClick={clearFilters}
          >
            Todos
          </FilterButton>
          <FilterButton
            $active={filters.perfil === PerfilUsuario.PESQUISADOR}
            onClick={() => filterByProfile(PerfilUsuario.PESQUISADOR)}
          >
            Pesquisadores
          </FilterButton>
          <FilterButton
            $active={filters.perfil === PerfilUsuario.AGENTE}
            onClick={() => filterByProfile(PerfilUsuario.AGENTE)}
          >
            Agentes
          </FilterButton>
          <FilterButton
            $active={filters.perfil === PerfilUsuario.GESTAO}
            onClick={() => filterByProfile(PerfilUsuario.GESTAO)}
          >
            Gestão
          </FilterButton>
        </div>

        {selectedUsers.length > 0 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="danger"
              size="small"
              onClick={() => handleBulkAction('delete')}
            >
              Excluir Selecionados ({selectedUsers.length})
            </Button>
          </div>
        )}
      </FilterSection>

      {/* Tabela de usuários */}
      <DataTable
        data={users}
        columns={columns}
        actions={actions}
        loading={loading}
        pagination={pagination}
        sorting={sorting}
        selectable={hasManagePermission}
        selectedRows={selectedUsers}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        onSelectionChange={handleSelectionChange}
        onSearch={handleSearch}
        emptyMessage={
          error ? 
            `Erro ao carregar usuários: ${error}` : 
            searchTerm ? 
              "Nenhum usuário encontrado para o termo pesquisado" :
              "Nenhum usuário cadastrado no sistema"
        }
      />

      {/* Modal de criação/edição de usuários */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitUser}
        user={editingUser}
        isLoading={loading}
      />
    </UsersPageContainer>
  );
}
