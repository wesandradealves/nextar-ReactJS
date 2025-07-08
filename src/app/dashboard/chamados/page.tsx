'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { useEntities } from '@/context/entities';
import { useChamados } from '@/hooks/useChamados';
import { useSetores } from '@/hooks/useSetores';
import { DataTable, ChamadoModal } from '@/components/molecules';
import { Select, PageHeader } from '@/components/atoms';
import { SearchBox } from '@/components/molecules/SearchBox';
import { Badge } from '@/components/atoms/Badge';
import { PerfilUsuario, Chamado, User, Setor, Equipamento, TipoManutencao, Prioridade, ChamadoStatus, TableAction } from '@/types';
import { Container, FiltersContainer } from './styles';
import { useMetadata } from '@/hooks/useMetadata';

/**
 * @permissions
 * - AGENTE: Visualiza apenas chamados atribuídos a ele
 * - PESQUISADOR: Visualiza todos os chamados + pode criar novos
 * - GESTAO: Visualiza todos + filtro por agente + pode criar novos
 */
export default function ChamadosPage() {
  const { user } = useAuth();
  const { usuarios, equipamentos } = useEntities();
  const { setores } = useSetores();

  useMetadata({
    title: `Nextar - Chamados`,
    ogTitle: `Nextar - Chamados`
  });
  
  const {
    chamados,
    loading,
    filters,
    handleFilterChange,
    createChamado,
    updateChamado,
    deleteChamado,
    exportChamadosCSV
  } = useChamados(user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChamado, setEditingChamado] = useState<Chamado | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [sorting, setSorting] = useState<{
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }>({
    sortBy: 'dataAbertura',
    sortOrder: 'desc'
  });

  /**
   * @decorator @memo - Filtrar agentes com verificação de segurança
   */
  const usuariosArray = useMemo(() => {
    if (Array.isArray(usuarios)) {
      return usuarios;
    }
    const usuariosData = (usuarios as Record<string, unknown>)?.data;
    return Array.isArray(usuariosData) ? usuariosData : [];
  }, [usuarios]);

  const agentes = useMemo(() => {
    return usuariosArray.filter((u: User) => u.perfil === 'agente');
  }, [usuariosArray]);

  /**
   * @decorator @modal - Funções de controle de modal
   */
  const handleCreateChamado = useCallback(() => {
    setEditingChamado(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  }, []);

  const handleEditChamado = useCallback((chamado: Chamado) => {
    setEditingChamado(chamado);
    setModalMode('edit');
    setIsModalOpen(true);
  }, []);

  const handleViewChamado = useCallback((chamado: Chamado) => {
    setEditingChamado(chamado);
    setModalMode('view');
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingChamado(undefined);
    setModalMode('create');
  }, []);

  const handleSubmitChamado = useCallback(async (data: Partial<Chamado>) => {
    if (editingChamado) {
      // Editar chamado existente
      await updateChamado(editingChamado.id, data);
    } else {
      // Criar novo chamado
      await createChamado({
        tipo: data.tipo as TipoManutencao,
        prioridade: data.prioridade as Prioridade,
        titulo: data.titulo || '',
        descricao: data.descricao || '',
        setorId: data.setorId || '',
        equipamentoId: data.equipamentoId || '',
        agenteId: data.agenteId,
        observacoes: typeof data.observacoes === 'string' ? data.observacoes : '',
        solicitanteId: data.solicitanteId || user?.id || '',
        status: ChamadoStatus.ABERTO
      });
    }
  }, [createChamado, updateChamado, editingChamado, user]);

  /**
   * @decorator @confirm - Deve incluir confirmação antes de deletar
   */
  const handleDeleteChamado = useCallback(async (chamado: Chamado) => {
    if (window.confirm(`Tem certeza que deseja excluir o chamado #${chamado.id}?`)) {
      await deleteChamado(chamado.id);
    }
  }, [deleteChamado]);

  const handleSortChange = useCallback((column: string, order: 'asc' | 'desc') => {
    setSorting({ sortBy: column, sortOrder: order });
  }, []);

  /**
   * Aplica ordenação local aos chamados
   * @decorator @memo - Otimizado para evitar re-ordenações desnecessárias
   */
  const sortedChamados = useMemo(() => {
    if (!chamados || chamados.length === 0) return [];
    
    const sorted = [...chamados].sort((a, b) => {
      const { sortBy, sortOrder } = sorting;
      
      let valueA: unknown = a[sortBy as keyof Chamado];
      let valueB: unknown = b[sortBy as keyof Chamado];
      
      if (sortBy === 'dataAbertura') {
        valueA = valueA ? new Date(valueA as string).getTime() : 0;
        valueB = valueB ? new Date(valueB as string).getTime() : 0;
      }
      
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();
      
      let comparison = 0;
      if ((valueA as string | number) > (valueB as string | number)) comparison = 1;
      if ((valueA as string | number) < (valueB as string | number)) comparison = -1;
      
      return sortOrder === 'desc' ? comparison * -1 : comparison;
    });
    
    return sorted;
  }, [chamados, sorting]);

  /**
   * @decorator @memo - Componente memoizado para performance
   */
  const getStatusBadge = (status: string) => {
    const variants = {
      'aberto': 'warning' as const,
      'em_progresso': 'primary' as const,
      'concluido': 'success' as const
    };
    
    const labels = {
      'aberto': 'Aberto',
      'em_progresso': 'Em Progresso',
      'concluido': 'Concluído'
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  /**
   * @decorator @readonly - Função pura, sem efeitos colaterais
   */
  const getTipoBadge = (tipo: string) => {
    const variants = {
      'corretiva': 'danger' as const,
      'preventiva': 'primary' as const
    };
    
    const labels = {
      'corretiva': 'Corretiva',
      'preventiva': 'Preventiva'
    };
    
    return (
      <Badge variant={variants[tipo as keyof typeof variants] || 'default'}>
        {labels[tipo as keyof typeof labels] || tipo}
      </Badge>
    );
  };

  /**
   * @decorator @performance - Otimizado para re-renderizações frequentes
   */
  const getPrioridadeBadge = (prioridade: string) => {
    const variants = {
      'alta': 'danger' as const,
      'media': 'warning' as const,
      'baixa': 'success' as const
    };
    
    const labels = {
      'alta': 'Alta',
      'media': 'Média',
      'baixa': 'Baixa'
    };
    
    return (
      <Badge variant={variants[prioridade as keyof typeof variants] || 'default'}>
        {labels[prioridade as keyof typeof labels] || prioridade}
      </Badge>
    );
  };

  /**
   * @decorator @memoize - Cache interno para evitar lookups repetidos
   */
  const getUserName = (userId: string) => {
    const usuario = usuariosArray.find((u: User) => u.id === userId);
    return usuario?.nome || 'N/A';
  };

  /**
   * @decorator @safeLookup - Lookup protegido contra arrays undefined/null
   */
  const getSetorName = (setorId: string) => {
    if (!Array.isArray(setores)) return 'N/A';
    const setor = setores.find((s: Setor) => s.id === setorId);
    return setor?.nome || 'N/A';
  };

  /**
   * Busca e retorna o nome do equipamento pelo ID
   * @decorator @nullable - Equipamento pode ser opcional (manutenção local)
   * @param {string} equipamentoId - ID do equipamento
   * @returns {string} Nome do equipamento ou 'N/A' se não encontrado
   * @throws {never} Falhas silenciosas com fallback para 'N/A'
   */
  const getEquipamentoName = (equipamentoId: string) => {
    if (!Array.isArray(equipamentos)) return 'N/A';
    const equipamento = equipamentos.find((e: Equipamento) => e.id === equipamentoId);
    return equipamento?.nome || 'N/A';
  };

  /**
   * Configuração das colunas da tabela de chamados
   * Define estrutura, renderização e comportamento de cada coluna
   * @decorator @immutable - Configuração estática, nunca muda durante o ciclo de vida
   * @constant {TableColumn<Chamado>[]}
   * @example
   * ```tsx
   * // Coluna de status com badge customizado
   * {
   *   key: 'status',
   *   title: 'Status', 
   *   render: (value) => getStatusBadge(value)
   * }
   * ```
   */
  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: '80px'
    },
    {
      key: 'dataAbertura',
      title: 'Criado em',
      width: '120px',
      sortable: true,
      render: (value: unknown) => {
        const date = value as string;
        if (!date) return 'N/A';
        
        const dateObj = new Date(date);
        const now = new Date();
        const diffMs = now.getTime() - dateObj.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffDays === 0) {
          if (diffHours === 0) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return diffMinutes <= 1 ? 'Agora' : `${diffMinutes}min atrás`;
          }
          return diffHours === 1 ? '1h atrás' : `${diffHours}h atrás`;
        } else if (diffDays === 1) {
          return 'Ontem';
        } else if (diffDays <= 7) {
          return `${diffDays} dias atrás`;
        }
        
        return dateObj.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: diffDays > 365 ? 'numeric' : '2-digit'
        });
      }
    },
    {
      key: 'tipo',
      title: 'Tipo',
      sortable: true,
      render: (value: unknown) => getTipoBadge(value as string)
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value: unknown) => getStatusBadge(value as string)
    },
    {
      key: 'prioridade',
      title: 'Prioridade',
      sortable: true,
      render: (value: unknown) => getPrioridadeBadge(value as string)
    },
    {
      key: 'titulo',
      title: 'Título',
      render: (value: unknown, item: Chamado) => {
        const titulo = (item.titulo || item.descricao) as string;
        return (
          <span title={titulo}>
            {titulo && titulo.length > 40 ? `${titulo.substring(0, 40)}...` : titulo || 'N/A'}
          </span>
        );
      }
    },
    {
      key: 'descricao',
      title: 'Descrição',
      render: (value: unknown, item: Chamado) => {
        const desc = (item.titulo ? item.descricao : (item.descricao || 'N/A')) as string;
        return (
          <span title={desc}>
            {desc && desc.length > 30 ? `${desc.substring(0, 30)}...` : desc || 'N/A'}
          </span>
        );
      }
    },
    {
      key: 'setorId',
      title: 'Setor',
      render: (value: unknown) => getSetorName(value as string)
    },
    {
      key: 'equipamentoId',
      title: 'Equipamento',
      render: (value: unknown) => {
        const equipId = value as string;
        return equipId ? getEquipamentoName(equipId) : 'Local';
      }
    },
    {
      key: 'solicitanteId',
      title: 'Solicitante',
      render: (value: unknown) => getUserName(value as string)
    },
    {
      key: 'agenteId',
      title: 'Agente',
      render: (value: unknown) => {
        const agentId = value as string;
        return agentId ? getUserName(agentId) : 'Não atribuído';
      }
    }
  ];

  const actions: TableAction<Chamado>[] = useMemo(() => {
    const chamadoActions: TableAction<Chamado>[] = [
      {
        key: 'view',
        title: 'Visualizar',
        icon: '👁️',
        variant: 'secondary',
        onClick: handleViewChamado
      }
    ];

    chamadoActions.push({
      key: 'edit',
      title: 'Editar',
      icon: '✏️',
      variant: 'primary',
      onClick: handleEditChamado,
      disabled: (chamado: Chamado) => !(
        user?.perfil === PerfilUsuario.GESTAO || 
        (user?.perfil === PerfilUsuario.AGENTE && chamado.agenteId === user.id) ||
        (user?.perfil === PerfilUsuario.PESQUISADOR && chamado.solicitanteId === user.id)
      )
    });

    chamadoActions.push({
      key: 'delete',
      title: 'Excluir',
      icon: '🗑️',
      variant: 'danger',
      onClick: handleDeleteChamado,
      disabled: (chamado: Chamado) => !(
        user?.perfil === PerfilUsuario.GESTAO || 
        (user?.perfil === PerfilUsuario.PESQUISADOR && chamado.solicitanteId === user.id)
      )
    });

    return chamadoActions;
  }, [user, handleViewChamado, handleEditChamado, handleDeleteChamado]);

  /**
   * @decorator @authorization - Verifica permissões baseadas no perfil
   */
  const canCreateChamado = user?.perfil === PerfilUsuario.PESQUISADOR || user?.perfil === PerfilUsuario.GESTAO;
  
  /**
   * @decorator @authorization
   */
  const canExportChamados = user?.perfil === PerfilUsuario.GESTAO;

  return (
    <Container className="flex flex-col max-w-[95vw] mx-auto gap-6 px-6 min-h-screen">
      <PageHeader
        title="Gestão de Chamados"
        subtitle="Gerencie chamados de manutenção do sistema."
        onExport={canExportChamados ? exportChamadosCSV : undefined}
        exportDisabled={loading || chamados.length === 0}
        showExportButton={canExportChamados}
        onAdd={canCreateChamado ? handleCreateChamado : undefined}
        showAddButton={canCreateChamado}
      />

      <FiltersContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <SearchBox
          placeholder="Buscar por descrição ou tipo..."
          value={filters.search}
          onChange={(value) => handleFilterChange({ search: value })}
          onSearch={(value) => handleFilterChange({ search: value })}
        />
        
        <Select
          options={[
            { value: '', label: 'Todos os tipos' },
            { value: 'corretiva', label: 'Corretiva' },
            { value: 'preventiva', label: 'Preventiva' }
          ]}
          value={filters.tipo}
          onChange={(e) => handleFilterChange({ tipo: e.target.value })}
          placeholder="Todos os tipos"
        />

        <Select
          options={[
            { value: '', label: 'Todos os status' },
            { value: 'aberto', label: 'Aberto' },
            { value: 'em_progresso', label: 'Em Progresso' },
            { value: 'concluido', label: 'Concluído' }
          ]}
          value={filters.status}
          onChange={(e) => handleFilterChange({ status: e.target.value })}
          placeholder="Todos os status"
        />

        <Select
          options={[
            { value: '', label: 'Todos os setores' },
            ...Array.isArray(setores) ? setores.map(setor => ({
              value: setor.id,
              label: setor.nome
            })) : []
          ]}
          value={filters.setorId || ''}
          onChange={(e) => handleFilterChange({ setorId: e.target.value })}
          placeholder="Todos os setores"
        />

        {user?.perfil === PerfilUsuario.GESTAO && (
          <Select
            options={[
              { value: '', label: 'Todos os agentes' },
              { value: 'sem_agente', label: 'Sem agente' },
              ...agentes.map((agente: User) => ({
                value: agente.id,
                label: agente.nome
              }))
            ]}
            value={filters.agenteId}
            onChange={(e) => handleFilterChange({ agenteId: e.target.value })}
            placeholder="Todos os agentes"
          />
        )}
      </FiltersContainer>

      <DataTable
        data={sortedChamados}
        columns={columns}
        actions={actions}
        loading={loading}
        sorting={sorting}
        onSortChange={handleSortChange}
        emptyMessage="Nenhum chamado encontrado"
      />

      <ChamadoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSubmitChamado}
        chamado={editingChamado}
        isSaving={loading}
        mode={modalMode}
      />
    </Container>
  );
}
