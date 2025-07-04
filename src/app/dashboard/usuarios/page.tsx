"use client";

import React, { useState, useCallback, useMemo } from 'react';
import CountUp from 'react-countup';
import { useAuth } from '@/context/auth';
import { useUsers } from '@/hooks/useUsers';
import { DataTable, UserModal } from '@/components/molecules';
import { Button, PageHeader } from '@/components/atoms';
import type { User, TableColumn, TableAction, CreateUserData, UpdateUserData } from '@/types';
import { PerfilUsuario } from '@/utils/enums';
import { 
  UsersPageContainer,
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

  useMetadata({
    title: `Nextar - Usuários`,
    ogTitle: `Nextar - Usuários`
  });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

  // Hook de usuários com cache
  const {
    users,
    userStats,
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
    changeUserPasswordAsAdmin,
    filterByProfile,
    clearFilters,
    exportUsersCSV
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
   * Manipula ativação/desativação de usuário
   */
  const handleToggleUserStatus = useCallback(async (user: User) => {
    const newStatus = !user.ativo;
    
    const success = await updateUser(user.id, { ativo: newStatus });
    if (!success) {
      console.error('Erro ao atualizar status do usuário');
    }
  }, [updateUser]);

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
      render: (_, user: User) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'center'
        }}>
          <input
            type="checkbox"
            checked={user.ativo}
            onChange={() => handleToggleUserStatus(user)}
            disabled={!hasManagePermission}
            style={{
              width: '16px',
              height: '16px',
              cursor: hasManagePermission ? 'pointer' : 'not-allowed'
            }}
          />
          <ClickableStatus
            onClick={hasManagePermission ? () => handleToggleUserStatus(user) : undefined}
            isActive={user.ativo}
            isClickable={hasManagePermission}
            title={hasManagePermission ? 
              `Clique para ${user.ativo ? 'desativar' : 'ativar'} o usuário` : 
              'Status do usuário'
            }
          >
            <StatusDot isActive={user.ativo} />
            {user.ativo ? 'Ativo' : 'Inativo'}
          </ClickableStatus>
        </div>
      )
    }
  ], [hasManagePermission, handleToggleUserStatus]);

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

  const handleSubmitUser = useCallback(async (userData: Partial<User>) => {
    if (editingUser) {
      // Editar usuário existente
      await updateUser(editingUser.id, userData as UpdateUserData);
    } else {
      // Criar novo usuário
      await createUser(userData as CreateUserData);
    }
  }, [editingUser, updateUser, createUser]);

  const handleChangePassword = useCallback(async (userId: string, newPassword: string) => {
    if (!currentUser) return;
    await changeUserPasswordAsAdmin(userId, currentUser.id, newPassword);
  }, [changeUserPasswordAsAdmin, currentUser]);

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
      <PageHeader
        title="Gestão de Usuários"
        subtitle="Gerencie usuários, perfis e permissões do sistema"
        showExportButton={hasManagePermission}
        showAddButton={hasManagePermission}
        onExport={exportUsersCSV}
        onAdd={handleCreateUser}
        exportDisabled={loading || !users.length}
        addLabel="+ Novo "
      />

      {/* Estatísticas */}
      <StatsContainer>
        <StatCard>
          <StatValue>
            <CountUp
              end={userStats.total}
              duration={1.2}
              separator="."
            />
          </StatValue>
          <StatLabel>Total de Usuários</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue style={{ color: '#10b981' }}>
            <CountUp
              end={userStats.ativos}
              duration={1.0}
              separator="."
            />
          </StatValue>
          <StatLabel>Ativos</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue style={{ color: '#ef4444' }}>
            <CountUp
              end={userStats.inativos}
              duration={1.0}
              separator="."
            />
          </StatValue>
          <StatLabel>Inativos</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            <CountUp
              end={userStats.pesquisadores}
              duration={1.4}
              separator="."
            />
          </StatValue>
          <StatLabel>Pesquisadores</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            <CountUp
              end={userStats.agentes}
              duration={1.6}
              separator="."
            />
          </StatValue>
          <StatLabel>Agentes</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            <CountUp
              end={userStats.gestores}
              duration={1.8}
              separator="."
            />
          </StatValue>
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
        onSave={handleSubmitUser}
        onChangePassword={handleChangePassword}
        user={editingUser}
        isSaving={loading}
      />
    </UsersPageContainer>
  );
}
