'use client';

import React from 'react';
import { useAuth } from '@/context/auth';
import { useEntities } from '@/context/entities';
import { useChamados } from '@/hooks/useChamados';
import { DataTable } from '@/components/molecules/DataTable';
import { Button } from '@/components/atoms/Button';
import { SearchBox } from '@/components/molecules/SearchBox';
import { Badge } from '@/components/atoms/Badge';
import { PerfilUsuario, Chamado, User, Setor, Equipamento } from '@/types';
import Link from 'next/link';
import { Container, Header, FiltersContainer, StyledSelect } from './styles';

/**
 * Página de Listagem de Chamados de Manutenção
 * Módulo completo para visualização e gestão de chamados do sistema
 * Inclui filtros, permissões por perfil e operações CRUD
 * 
 * @description
 * Esta página permite:
 * - Listar chamados com filtros avançados (tipo, status, agente, busca)
 * - Visualizar chamados baseado no perfil do usuário
 * - Criar novos chamados (Pesquisadores e Gestores)
 * - Navegar para detalhes e edição de chamados
 * - Cache otimizado para performance
 * 
 * @permissions
 * - AGENTE: Visualiza apenas chamados atribuídos a ele
 * - PESQUISADOR: Visualiza todos os chamados + pode criar novos
 * - GESTAO: Visualiza todos + filtro por agente + pode criar novos
 * 
 * @example
 * ```tsx
 * // Navegação automática baseada no perfil
 * // Agente vê apenas seus chamados
 * // Pesquisador/Gestão veem todos
 * <ChamadosPage />
 * ```
 * 
 * @author Sistema NextAR
 * @version 1.0.0
 */
export default function ChamadosPage() {
  const { user } = useAuth();
  const { usuarios, setores, equipamentos } = useEntities();
  
  const {
    chamados,
    loading,
    filters,
    handleFilterChange
  } = useChamados(user);

  /**
   * Renderiza badge de status do chamado
   * @decorator @memo - Componente memoizado para performance
   * @param {string} status - Status do chamado (aberto, em_progresso, concluido)
   * @returns {JSX.Element} Badge colorido com status
   * @example
   * ```tsx
   * getStatusBadge('aberto') // Badge laranja "Aberto"
   * getStatusBadge('em_progresso') // Badge azul "Em Progresso"
   * getStatusBadge('concluido') // Badge verde "Concluído"
   * ```
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
   * Renderiza badge do tipo de manutenção
   * @decorator @readonly - Função pura, sem efeitos colaterais
   * @param {string} tipo - Tipo da manutenção (corretiva, preventiva)
   * @returns {JSX.Element} Badge colorido com tipo
   * @example
   * ```tsx
   * getTipoBadge('corretiva') // Badge vermelho "Corretiva"
   * getTipoBadge('preventiva') // Badge azul "Preventiva"
   * ```
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
   * Renderiza badge de prioridade do chamado
   * @decorator @performance - Otimizado para re-renderizações frequentes
   * @param {string} prioridade - Prioridade do chamado (alta, media, baixa)
   * @returns {JSX.Element} Badge colorido com prioridade
   * @example
   * ```tsx
   * getPrioridadeBadge('alta') // Badge vermelho "Alta"
   * getPrioridadeBadge('media') // Badge laranja "Média"
   * getPrioridadeBadge('baixa') // Badge verde "Baixa"
   * ```
   */

  /**
   * Renderiza badge de prioridade do chamado
   * @param {string} prioridade - Prioridade do chamado (alta, media, baixa)
   * @returns {JSX.Element} Badge colorido com prioridade
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
   * Busca e retorna o nome do usuário pelo ID
   * @decorator @memoize - Cache interno para evitar lookups repetidos
   * @param {string} userId - ID do usuário
   * @returns {string} Nome do usuário ou 'N/A' se não encontrado
   * @throws {never} Falhas silenciosas com fallback para 'N/A'
   */
  const getUserName = (userId: string) => {
    if (!Array.isArray(usuarios)) return 'N/A';
    const usuario = usuarios.find((u: User) => u.id === userId);
    return usuario?.nome || 'N/A';
  };

  /**
   * Busca e retorna o nome do setor pelo ID
   * @decorator @safeLookup - Lookup protegido contra arrays undefined/null
   * @param {string} setorId - ID do setor
   * @returns {string} Nome do setor ou 'N/A' se não encontrado
   * @throws {never} Falhas silenciosas com fallback para 'N/A'
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
      key: 'tipo',
      title: 'Tipo',
      render: (value: unknown) => getTipoBadge(value as string)
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: unknown) => getStatusBadge(value as string)
    },
    {
      key: 'prioridade',
      title: 'Prioridade',
      render: (value: unknown) => getPrioridadeBadge(value as string)
    },
    {
      key: 'descricao',
      title: 'Descrição',
      render: (value: unknown) => {
        const desc = value as string;
        return (
          <span title={desc}>
            {desc && desc.length > 50 ? `${desc.substring(0, 50)}...` : desc || 'N/A'}
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
    },
    {
      key: 'dataAbertura',
      title: 'Data Abertura',
      render: (value: unknown) => {
        const date = value as string;
        return date ? new Date(date).toLocaleDateString('pt-BR') : 'N/A';
      }
    },
    {
      key: 'actions',
      title: 'Ações',
      render: (value: unknown, item: Chamado) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href={`/dashboard/chamados/${item.id}`}>
            <Button variant="outline" size="small">Ver</Button>
          </Link>
          {(user?.perfil === PerfilUsuario.GESTAO || 
            (user?.perfil === PerfilUsuario.AGENTE && item.agenteId === user.id) ||
            (user?.perfil === PerfilUsuario.PESQUISADOR && item.solicitanteId === user.id)) && (
            <Link href={`/dashboard/chamados/${item.id}/editar`}>
              <Button variant="primary" size="small">Editar</Button>
            </Link>
          )}
        </div>
      )
    }
  ];

  /**
   * Verifica se o usuário atual pode criar chamados
   * @decorator @authorization - Verifica permissões baseadas no perfil
   * @constant {boolean} canCreateChamado - True se PESQUISADOR ou GESTAO
   * @example
   * ```tsx
   * if (canCreateChamado) {
   *   return <Button>Novo Chamado</Button>
   * }
   * ```
   */
  const canCreateChamado = user?.perfil === PerfilUsuario.PESQUISADOR || user?.perfil === PerfilUsuario.GESTAO;

  return (
    <Container>
      <Header>
        <h1>Chamados de Manutenção</h1>
        {canCreateChamado && (
          <Link href="/dashboard/chamados/novo">
            <Button variant="primary">Novo Chamado</Button>
          </Link>
        )}
      </Header>

      <FiltersContainer>
        <SearchBox
          placeholder="Buscar por descrição ou tipo..."
          value={filters.search}
          onSearch={(value) => handleFilterChange({ search: value })}
        />
        
        <StyledSelect
          value={filters.tipo}
          onChange={(e) => handleFilterChange({ tipo: e.target.value })}
        >
          <option value="">Todos os tipos</option>
          <option value="corretiva">Corretiva</option>
          <option value="preventiva">Preventiva</option>
        </StyledSelect>

        <StyledSelect
          value={filters.status}
          onChange={(e) => handleFilterChange({ status: e.target.value })}
        >
          <option value="">Todos os status</option>
          <option value="aberto">Aberto</option>
          <option value="em_progresso">Em Progresso</option>
          <option value="concluido">Concluído</option>
        </StyledSelect>

        {user?.perfil === PerfilUsuario.GESTAO && (
          <StyledSelect
            value={filters.agenteId}
            onChange={(e) => handleFilterChange({ agenteId: e.target.value })}
          >
            <option value="">Todos os agentes</option>
            <option value="sem_agente">Sem agente</option>
            {Array.isArray(usuarios) && usuarios.filter(u => u.perfil === PerfilUsuario.AGENTE).map(agente => (
              <option key={agente.id} value={agente.id}>{agente.nome}</option>
            ))}
          </StyledSelect>
        )}
      </FiltersContainer>

      <DataTable
        data={chamados}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhum chamado encontrado"
      />
    </Container>
  );
}
