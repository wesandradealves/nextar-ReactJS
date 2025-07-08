"use client";

import React, { useState, useCallback, useMemo } from 'react';
import CountUp from 'react-countup';
import { useAuth } from '@/context/auth';
import { useUsers } from '@/hooks/useUsers';
import { DataTable, UserModal } from '@/components/molecules';
import { Button, PageHeader, ToggleSwitch } from '@/components/atoms';
import type { User, TableColumn, TableAction, CreateUserData, UpdateUserData } from '@/types';
import { PerfilUsuario } from '@/utils/enums';
import { 
  UsersPageContainer,
  FilterSection,
  FilterButton,
  StatsContainer,
  StatCard,
  StatValue,
  StatLabel
} from './styles';
import { useMetadata } from '@/hooks/useMetadata';

/**
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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

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

  const hasManagePermission = useMemo(() => {
    return currentUser?.perfil === PerfilUsuario.GESTAO;
  }, [currentUser]);

  const handleDeleteUser = useCallback(async (user: User) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário ${user.nome}?`)) {
      return;
    }

    const success = await deleteUser(user.id);
    if (success) {
      setSelectedUsers(prev => prev.filter(id => id !== user.id));
    }
  }, [deleteUser]);

  const handleToggleUserStatus = useCallback(async (user: User) => {
    const newStatus = !user.ativo;
    
    const success = await updateUser(user.id, { ativo: newStatus });
    if (!success) {
      console.error('Erro ao atualizar status do usuário');
    }
  }, [updateUser]);

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
          <span 
            className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium border"
            style={{
              backgroundColor: profile.bg,
              color: profile.color,
              borderColor: `${profile.color}40`
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
        <div className="flex items-center gap-3 justify-center">
          <ToggleSwitch
            checked={user.ativo}
            onChange={() => handleToggleUserStatus(user)}
            disabled={!hasManagePermission}
            size="small"
            data-testid={`user-toggle-${user.id}`}
          />
          <span className={`text-sm font-medium ${
            user.ativo ? 'text-green-600' : 'text-red-600'
          }`}>
            {user.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      )
    }
  ], [hasManagePermission, handleToggleUserStatus]);

  const handleCreateUser = useCallback(() => {
    setEditingUser(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  }, []);

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

  const handleSelectionChange = useCallback((newSelection: string[]) => {
    setSelectedUsers(newSelection);
  }, []);

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
      const promises = selectedUsers.map(userId => deleteUser(userId));
      await Promise.all(promises);
      setSelectedUsers([]);
    }
    
  }, [selectedUsers, deleteUser]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingUser(undefined);
  }, []);

  const handleSubmitUser = useCallback(async (userData: Partial<User>) => {
    if (editingUser) {
      await updateUser(editingUser.id, userData as UpdateUserData);
    } else {
      await createUser(userData as CreateUserData);
    }
  }, [editingUser, updateUser, createUser]);

  const handleChangePassword = useCallback(async (userId: string, newPassword: string) => {
    if (!currentUser) return;
    await changeUserPasswordAsAdmin(userId, currentUser.id, newPassword);
  }, [changeUserPasswordAsAdmin, currentUser]);

  if (!hasManagePermission) {
    return (
      <UsersPageContainer className="p-6 max-w-[95vw] mx-auto space-y-6">
        <div className="text-center py-16 px-5 text-gray-500 dark:text-gray-400">
          <h2>Acesso Negado</h2>
          <p>Você não tem permissão para acessar esta página.</p>
          <p>Apenas usuários com perfil de Gestão podem gerenciar usuários.</p>
        </div>
      </UsersPageContainer>
    );
  }

  return (
    <UsersPageContainer className="p-6 max-w-[95vw] mx-auto space-y-6">
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

      <StatsContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <StatValue className="text-2xl font-bold text-gray-900 dark:text-white">
            <CountUp
              end={userStats.total}
              duration={1.2}
              separator="."
            />
          </StatValue>
          <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total de Usuários</StatLabel>
        </StatCard>
        <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <StatValue className="text-2xl font-bold text-green-600 dark:text-green-400">
            <CountUp
              end={userStats.ativos}
              duration={1.0}
              separator="."
            />
          </StatValue>
          <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ativos</StatLabel>
        </StatCard>
        <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <StatValue className="text-2xl font-bold text-red-600 dark:text-red-400">
            <CountUp
              end={userStats.inativos}
              duration={1.0}
              separator="."
            />
          </StatValue>
          <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Inativos</StatLabel>
        </StatCard>
        <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <StatValue className="text-2xl font-bold text-gray-900 dark:text-white">
            <CountUp
              end={userStats.pesquisadores}
              duration={1.4}
              separator="."
            />
          </StatValue>
          <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pesquisadores</StatLabel>
        </StatCard>
        <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <StatValue className="text-2xl font-bold text-gray-900 dark:text-white">
            <CountUp
              end={userStats.agentes}
              duration={1.6}
              separator="."
            />
          </StatValue>
          <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Agentes</StatLabel>
        </StatCard>
        <StatCard className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <StatValue className="text-2xl font-bold text-gray-900 dark:text-white">
            <CountUp
              end={userStats.gestores}
              duration={1.8}
              separator="."
            />
          </StatValue>
          <StatLabel className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gestores</StatLabel>
        </StatCard>
      </StatsContainer>

      <FilterSection className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          <FilterButton
            $active={!filters.perfil}
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Todos
          </FilterButton>
          <FilterButton
            $active={filters.perfil === PerfilUsuario.PESQUISADOR}
            onClick={() => filterByProfile(PerfilUsuario.PESQUISADOR)}
            className="px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Pesquisadores
          </FilterButton>
          <FilterButton
            $active={filters.perfil === PerfilUsuario.AGENTE}
            onClick={() => filterByProfile(PerfilUsuario.AGENTE)}
            className="px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Agentes
          </FilterButton>
          <FilterButton
            $active={filters.perfil === PerfilUsuario.GESTAO}
            onClick={() => filterByProfile(PerfilUsuario.GESTAO)}
            className="px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Gestão
          </FilterButton>
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex gap-2">
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
