import type { Meta, StoryObj } from '@storybook/react';
import { FormModal, FieldGroup, SectionTitle } from '../FormModal';
import { FormSelection } from '../FormSelection';
import { Input } from '../../atoms/Input';
import { PerfilUsuario } from '../../../utils/enums';

// Componente simplificado para demonstração no Storybook
const UserModalDemo = ({
  isOpen,
  onClose,
  user,
  isSaving = false
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  isSaving?: boolean;
}) => {
  const isEditing = !!user;
  
  const perfilOptions = [
    {
      id: PerfilUsuario.GESTAO,
      label: 'Gestão',
      description: 'Acesso total ao sistema',
      color: '#3b82f6',
      icon: '👑'
    },
    {
      id: PerfilUsuario.AGENTE,
      label: 'Agente',
      description: 'Execução de manutenções',
      color: '#10b981',
      icon: '🔧'
    }
  ];

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Usuário' : 'Novo Usuário'}
      subtitle={isEditing ? 'Atualize as informações do usuário' : 'Preencha os dados do novo usuário'}
      confirmText={isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
      onConfirm={() => {
        console.log('Usuário salvo!');
        onClose();
      }}
      isLoading={isSaving}
      size="large"
    >
      <FieldGroup>
        <SectionTitle>Informações Básicas</SectionTitle>
        <div>
          <Input
            placeholder="Nome completo"
            value={user?.nome || ''}
            onChange={() => {}}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            placeholder="Email"
            type="email"
            value={user?.email || ''}
            onChange={() => {}}
          />
          <Input
            placeholder="Nome de usuário"
            value={user?.usuario || ''}
            onChange={() => {}}
          />
        </div>

        <div>
          <Input
            placeholder="Setor"
            value={user?.setor || ''}
            onChange={() => {}}
          />
        </div>
      </FieldGroup>

      <FieldGroup>
        <SectionTitle>Perfil do Usuário</SectionTitle>
        <FormSelection
          options={perfilOptions}
          value={user?.perfil || PerfilUsuario.AGENTE}
          onChange={() => {}}
        />
      </FieldGroup>

      {!isEditing && (
        <FieldGroup>
          <SectionTitle>Senha</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              placeholder="Senha"
              type="password"
              onChange={() => {}}
            />
            <Input
              placeholder="Confirmar senha"
              type="password"
              onChange={() => {}}
            />
          </div>
        </FieldGroup>
      )}

      {user && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <strong>Status:</strong> {user.ativo ? '✅ Ativo' : '❌ Inativo'} • 
          <strong> Criado em:</strong> {new Date(user.dataCriacao).toLocaleDateString('pt-BR')}
        </div>
      )}
    </FormModal>
  );
};

const meta: Meta<typeof UserModalDemo> = {
  title: 'Molecules/UserModal',
  component: UserModalDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Modal para criação e edição de usuários do sistema.

**Características:**
- Formulário completo de usuário
- Seleção visual de perfil
- Validações integradas
- Campos de senha para criação
- Estados ativo/inativo

**Perfis disponíveis:**
- **Gestão**: Acesso total ao sistema
- **Agente**: Execução de manutenções

**Nota**: Este é um componente demo simplificado para o Storybook.
O componente real requer contextos de autenticação e toast.
        `
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Se o modal está aberto'
    },
    user: {
      description: 'Usuário para edição (undefined para criação)'
    },
    isSaving: {
      control: 'boolean',
      description: 'Se está salvando'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NovoUsuario: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    user: undefined,
    isSaving: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Criação de novo usuário. Todos os campos são obrigatórios incluindo senha.'
      }
    }
  }
};

export const EditarGestor: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    user: {
      id: '1',
      nome: 'João Silva',
      email: 'joao.silva@empresa.com',
      usuario: 'joao.silva',
      setor: 'TI',
      perfil: PerfilUsuario.GESTAO,
      ativo: true,
      dataCriacao: '2024-01-15T10:30:00Z'
    },
    isSaving: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Edição de usuário com perfil de gestão. Campos de senha não são exibidos na edição.'
      }
    }
  }
};

export const EditarAgente: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    user: {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      usuario: 'maria.santos',
      setor: 'Manutenção',
      perfil: PerfilUsuario.AGENTE,
      ativo: true,
      dataCriacao: '2024-02-10T14:20:00Z'
    },
    isSaving: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Edição de usuário com perfil de agente.'
      }
    }
  }
};

export const UsuarioInativo: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    user: {
      id: '3',
      nome: 'Pedro Costa',
      email: 'pedro.costa@empresa.com',
      usuario: 'pedro.costa',
      setor: 'Almoxarifado',
      perfil: PerfilUsuario.AGENTE,
      ativo: false,
      dataCriacao: '2023-11-05T09:15:00Z'
    },
    isSaving: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Usuário inativo. O status é exibido no rodapé do modal.'
      }
    }
  }
};

export const Salvando: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    user: undefined,
    isSaving: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado de carregamento durante o salvamento do usuário.'
      }
    }
  }
};
