import type { Meta, StoryObj } from '@storybook/react';
import UserModal from './index';
import { useState } from 'react';
import { PerfilUsuario } from '../../../utils/enums';

// Mock do contexto de autenticação
const mockAuthContext = {
  user: {
    id: '1',
    nome: 'Admin User',
    email: 'admin@exemplo.com',
    perfil: PerfilUsuario.GESTAO,
    ativo: true
  },
  token: 'mock-token',
  isAuthenticated: true,
  login: async () => {},
  logout: () => {},
  loading: false
};

// Mock do toast
const mockToast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.log('Error:', message),
  warning: (message: string) => console.log('Warning:', message),
  info: (message: string) => console.log('Info:', message)
};

const meta: Meta<typeof UserModal> = {
  title: 'Molecules/UserModal',
  component: UserModal,
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
- Alteração de senha para gestores
- Estados ativo/inativo

**Perfis disponíveis:**
- **Gestão**: Acesso total ao sistema
- **Agente**: Execução de manutenções

**Uso:**
\`\`\`tsx
<UserModal
  isOpen={true}
  onClose={() => {}}
  onSave={async (userData) => {}}
  user={user} // opcional para edição
/>
\`\`\`
        `
      }
    }
  },
  decorators: [
    (Story) => (
      <div>
        {/* Mock providers for dependencies */}
        <Story />
      </div>
    )
  ],
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

const UserModalTemplate = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async (userData: any) => {
    setIsSaving(true);
    console.log('Saving user:', userData);
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSaving(false);
    setIsOpen(false);
    console.log('User saved successfully!');
  };

  const handleChangePassword = async (userId: string, newPassword: string) => {
    console.log('Changing password for user:', userId);
    console.log('New password:', newPassword);
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Password changed successfully!');
  };
  
  return (
    <>
      <button onClick={() => setIsOpen(true)} style={{
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
      }}>
        {args.user ? 'Editar Usuário' : 'Novo Usuário'}
      </button>
      
      <UserModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        onChangePassword={handleChangePassword}
        isSaving={isSaving}
      />
    </>
  );
};

export const NovoUsuario: Story = {
  render: UserModalTemplate,
  args: {
    user: undefined
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
  render: UserModalTemplate,
  args: {
    user: {
      id: '1',
      nome: 'Ana Costa',
      email: 'ana.costa@estacao.com',
      usuario: 'ana.costa',
      perfil: PerfilUsuario.GESTAO,
      setor: 'Administração',
      ativo: true,
      dataCriacao: '2024-01-15T08:30:00.000Z',
      dataAtualizacao: '2025-06-20T14:22:00.000Z'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Edição de usuário gestor. Campos de senha não são obrigatórios na edição.'
      }
    }
  }
};

export const EditarAgente: Story = {
  render: UserModalTemplate,
  args: {
    user: {
      id: '2',
      nome: 'Carlos Silva',
      email: 'carlos.silva@estacao.com',
      usuario: 'carlos.silva',
      perfil: PerfilUsuario.AGENTE,
      setor: 'Manutenção',
      ativo: true,
      dataCriacao: '2024-02-01T10:15:00.000Z',
      dataAtualizacao: '2025-06-18T09:45:00.000Z'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Edição de usuário agente com perfil de manutenção.'
      }
    }
  }
};

export const UsuarioInativo: Story = {
  render: UserModalTemplate,
  args: {
    user: {
      id: '3',
      nome: 'João Santos',
      email: 'joao.santos@estacao.com',
      usuario: 'joao.santos',
      perfil: PerfilUsuario.AGENTE,
      setor: 'Logística',
      ativo: false,
      dataCriacao: '2023-12-10T16:00:00.000Z',
      dataAtualizacao: '2025-05-20T11:30:00.000Z'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Usuário inativo que pode ser reativado através do toggle.'
      }
    }
  }
};

export const SalvandoUsuario: Story = {
  render: UserModalTemplate,
  args: {
    user: {
      id: '4',
      nome: 'Maria Oliveira',
      email: 'maria.oliveira@estacao.com',
      usuario: 'maria.oliveira',
      perfil: PerfilUsuario.GESTAO,
      setor: 'Coordenação',
      ativo: true,
      dataCriacao: '2024-03-15T12:45:00.000Z',
      dataAtualizacao: '2025-07-01T16:20:00.000Z'
    },
    isSaving: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal em estado de salvamento com loading.'
      }
    }
  }
};

export const UsuarioCompleto: Story = {
  render: UserModalTemplate,
  args: {
    user: {
      id: '5',
      nome: 'Dr. Roberto Fernandes',
      email: 'roberto.fernandes@estacao.com',
      usuario: 'roberto.fernandes',
      perfil: PerfilUsuario.GESTAO,
      setor: 'Pesquisa e Desenvolvimento',
      ativo: true,
      dataCriacao: '2024-01-08T14:20:00.000Z',
      dataAtualizacao: '2025-07-02T08:15:00.000Z'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de usuário com informações completas e setor específico.'
      }
    }
  }
};

// Story especial para demonstrar validações
export const ExemplosValidacao: Story = {
  render: (args: any) => {
    return (
      <div style={{ padding: '20px' }}>
        <h3>Exemplos de Validação</h3>
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Para testar as validações, tente:</strong></p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Deixar campos obrigatórios vazios</li>
            <li>Nome com menos de 2 caracteres</li>
            <li>Email inválido (sem @ ou domínio)</li>
            <li>Senhas diferentes na confirmação</li>
            <li>Senha com menos de 6 caracteres</li>
          </ul>
        </div>
        <UserModalTemplate {...args} />
      </div>
    );
  },
  args: {
    user: undefined
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstração das validações do formulário de usuário.'
      }
    }
  }
};
