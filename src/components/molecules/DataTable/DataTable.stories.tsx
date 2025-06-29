import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DataTable } from './index';
import { PerfilUsuario } from '@/utils/enums';
import type { User, TableColumn, TableAction } from '@/types';

const meta: Meta<typeof DataTable<User>> = {
  title: 'Components/Molecules/DataTable',
  component: DataTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
O componente **DataTable** é uma tabela reutilizável e totalmente responsiva que segue o padrão Atomic Design (Molecule).

### 🎯 **Principais Características:**
- **Paginação**: Controle completo de páginas com navegação intuitiva
- **Ordenação**: Clique nos cabeçalhos para ordenar por coluna
- **Busca**: Integração com SearchBox para filtrar dados
- **Seleção**: Checkbox para seleção individual ou em lote
- **Ações**: Botões de ação personalizáveis por linha
- **Responsivo**: Layout adaptativo para mobile com cards
- **Loading**: Estados de carregamento com skeleton
- **Empty State**: Mensagem personalizada quando não há dados

### 🔄 **Integração com Cache:**
- Otimizado para trabalhar com sistema de cache multicamadas
- Suporte a revalidação automática de dados
- Estados de loading sincronizados com hooks de API

### 📱 **Responsividade:**
- **Desktop**: Tabela tradicional com colunas
- **Mobile**: Cards expansivos com informações organizadas
- **Breakpoints**: Configuráveis via sistema de breakpoints centralizado
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Array de dados para exibir na tabela',
      control: { type: 'object' }
    },
    columns: {
      description: 'Configuração das colunas da tabela',
      control: { type: 'object' }
    },
    actions: {
      description: 'Ações disponíveis para cada linha',
      control: { type: 'object' }
    },
    loading: {
      description: 'Estado de carregamento da tabela',
      control: { type: 'boolean' }
    },
    pagination: {
      description: 'Configuração de paginação',
      control: { type: 'object' }
    },
    selectable: {
      description: 'Permite seleção de linhas',
      control: { type: 'boolean' }
    },
    emptyMessage: {
      description: 'Mensagem quando não há dados',
      control: { type: 'text' }
    }
  }
};

export default meta;
type Story = StoryObj<typeof DataTable<User>>;

// Dados mockados para as histórias
const mockUsers: User[] = [
  {
    id: '1',
    nome: 'Dr. João Silva',
    email: 'joao.silva@antartica.gov.br',
    usuario: 'joao.silva',
    setor: 'Biologia Marinha',
    perfil: PerfilUsuario.PESQUISADOR,
    ativo: true,
    dataCriacao: '2023-01-15T10:00:00Z'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria.santos@antartica.gov.br',
    usuario: 'maria.santos',
    setor: 'Manutenção',
    perfil: PerfilUsuario.AGENTE,
    ativo: true,
    dataCriacao: '2023-02-10T14:30:00Z'
  },
  {
    id: '3',
    nome: 'Carlos Oliveira',
    email: 'carlos.oliveira@antartica.gov.br',
    usuario: 'carlos.oliveira',
    setor: 'Administração',
    perfil: PerfilUsuario.GESTAO,
    ativo: true,
    dataCriacao: '2023-01-05T09:15:00Z'
  },
  {
    id: '4',
    nome: 'Ana Costa',
    email: 'ana.costa@antartica.gov.br',
    usuario: 'ana.costa',
    setor: 'Meteorologia',
    perfil: PerfilUsuario.PESQUISADOR,
    ativo: true,
    dataCriacao: '2023-03-01T11:45:00Z'
  },
  {
    id: '5',
    nome: 'Pedro Lima',
    email: 'pedro.lima@antartica.gov.br',
    usuario: 'pedro.lima',
    setor: 'Engenharia',
    perfil: PerfilUsuario.AGENTE,
    ativo: true,
    dataCriacao: '2023-02-20T16:20:00Z'
  }
];

// Configuração de colunas
const userColumns: TableColumn<User>[] = [
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
        [PerfilUsuario.PESQUISADOR]: { label: 'Pesquisador', color: '#10b981' },
        [PerfilUsuario.AGENTE]: { label: 'Agente', color: '#3b82f6' },
        [PerfilUsuario.GESTAO]: { label: 'Gestão', color: '#8b5cf6' }
      };
      
      const profile = profiles[perfil] || { label: perfil, color: '#6b7280' };
      
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: '500',
          backgroundColor: `${profile.color}20`,
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
];

// Ações da tabela
const userActions: TableAction<User>[] = [
  {
    key: 'edit',
    title: 'Editar',
    icon: '✏️',
    variant: 'primary',
    onClick: (user) => console.log('Editar usuário:', user.nome)
  },
  {
    key: 'delete',
    title: 'Excluir',
    icon: '🗑️',
    variant: 'danger',
    onClick: (user) => console.log('Excluir usuário:', user.nome),
    disabled: (user) => user.perfil === PerfilUsuario.GESTAO
  }
];

/**
 * Exemplo básico do DataTable com dados de usuários
 */
export const Default: Story = {
  args: {
    data: mockUsers,
    columns: userColumns,
    actions: userActions,
    loading: false,
    selectable: false,
    emptyMessage: "Nenhum usuário encontrado"
  }
};

/**
 * DataTable com seleção habilitada
 */
export const WithSelection: Story = {
  args: {
    data: mockUsers,
    columns: userColumns,
    actions: userActions,
    loading: false,
    selectable: true,
    selectedRows: ['1', '3'],
    emptyMessage: "Nenhum usuário encontrado"
  }
};

/**
 * DataTable com paginação
 */
export const WithPagination: Story = {
  args: {
    data: mockUsers,
    columns: userColumns,
    actions: userActions,
    loading: false,
    selectable: true,
    pagination: {
      page: 2,
      limit: 3,
      total: 15,
      totalPages: 5
    },
    sorting: {
      sortBy: 'nome',
      sortOrder: 'asc'
    },
    emptyMessage: "Nenhum usuário encontrado"
  }
};

/**
 * Estado de carregamento (loading)
 */
export const Loading: Story = {
  args: {
    data: [],
    columns: userColumns,
    actions: userActions,
    loading: true,
    selectable: true,
    pagination: {
      page: 1,
      limit: 5,
      total: 0,
      totalPages: 1
    },
    emptyMessage: "Nenhum usuário encontrado"
  }
};

/**
 * Estado vazio (sem dados)
 */
export const Empty: Story = {
  args: {
    data: [],
    columns: userColumns,
    actions: userActions,
    loading: false,
    selectable: true,
    emptyMessage: "Nenhum usuário cadastrado",
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1
    }
  }
};

/**
 * Exemplo com busca integrada
 */
export const WithSearch: Story = {
  render: function WithSearchExample() {
    const [filteredData, setFilteredData] = React.useState(mockUsers);
    const [loading, setLoading] = React.useState(false);
    
    const handleSearch = async (term: string) => {
      setLoading(true);
      
      // Simula busca assíncrona
      setTimeout(() => {
        const filtered = term
          ? mockUsers.filter(user => 
              user.nome.toLowerCase().includes(term.toLowerCase()) ||
              user.email.toLowerCase().includes(term.toLowerCase())
            )
          : mockUsers;
        
        setFilteredData(filtered);
        setLoading(false);
      }, 500);
    };
    
    return (
      <div style={{ padding: '20px' }}>
        <DataTable
          data={filteredData}
          columns={userColumns}
          actions={userActions}
          loading={loading}
          selectable={true}
          onSearch={handleSearch}
          emptyMessage="Nenhum usuário encontrado para o termo pesquisado"
        />
      </div>
    );
  }
};

/**
 * Exemplo interativo completo
 */
export const InteractiveExample: Story = {
  render: function InteractiveExample() {
    const [data, setData] = React.useState(mockUsers);
    const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [sorting, setSorting] = React.useState<{ sortBy: string; sortOrder: 'asc' | 'desc' }>({
      sortBy: 'nome',
      sortOrder: 'asc'
    });
    
    const itemsPerPage = 3;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
    
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };
    
    const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
      setSorting({ sortBy, sortOrder });
      
      const sortedData = [...data].sort((a, b) => {
        const aValue = String(a[sortBy as keyof User] || '');
        const bValue = String(b[sortBy as keyof User] || '');
        
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
      
      setData(sortedData);
      setCurrentPage(1); // Reset para primeira página
    };
    
    const handleSearch = (term: string) => {
      const filtered = term
        ? mockUsers.filter(user => 
            user.nome.toLowerCase().includes(term.toLowerCase()) ||
            user.email.toLowerCase().includes(term.toLowerCase())
          )
        : mockUsers;
      
      setData(filtered);
      setCurrentPage(1);
    };
    
    const handleSelectionChange = (newSelection: string[]) => {
      setSelectedRows(newSelection);
    };
    
    const enhancedActions: TableAction<User>[] = [
      ...userActions,
      {
        key: 'view',
        title: 'Visualizar',
        icon: '👁️',
        variant: 'secondary',
        onClick: (user) => console.log('Visualizar usuário:', user)
      }
    ];
    
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>Estado Atual:</h3>
          <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#64748b' }}>
            <strong>Selecionados:</strong> {selectedRows.length} usuário(s)
          </p>
          <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#64748b' }}>
            <strong>Página:</strong> {currentPage} de {totalPages}
          </p>
          <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#64748b' }}>
            <strong>Ordenação:</strong> {sorting.sortBy} ({sorting.sortOrder})
          </p>
          {selectedRows.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <button
                onClick={() => console.log('Ação em lote para:', selectedRows)}
                style={{
                  padding: '6px 12px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Ação em Lote ({selectedRows.length})
              </button>
            </div>
          )}
        </div>
        
        <DataTable
          data={paginatedData}
          columns={userColumns}
          actions={enhancedActions}
          selectable={true}
          selectedRows={selectedRows}
          pagination={{
            page: currentPage,
            limit: itemsPerPage,
            total: data.length,
            totalPages
          }}
          sorting={sorting}
          onPageChange={handlePageChange}
          onSortChange={handleSortChange}
          onSelectionChange={handleSelectionChange}
          onSearch={handleSearch}
          emptyMessage="Nenhum usuário encontrado"
        />
      </div>
    );
  }
};
