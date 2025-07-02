import type { Meta, StoryObj } from '@storybook/react';
import { FormModal, FieldGroup, SectionTitle, ToggleContainer, ToggleSwitch, ToggleInput, ToggleSlider, ToggleInfo, ToggleTitle, ToggleText } from '../FormModal';
import { FormSelection } from '../FormSelection';
import { Input } from '../../atoms/Input';
import Textarea from '../../atoms/Textarea';
import { CATEGORIAS_CIENTIFICAS } from '../../../utils/enums';

// Componente simplificado para demonstração no Storybook
const SetorModalDemo = ({
  isOpen,
  onClose,
  setor,
  isLoading = false
}: {
  isOpen: boolean;
  onClose: () => void;
  setor?: any;
  isLoading?: boolean;
}) => {
  const isEditing = !!setor;
  
  const categoriaOptions = Object.entries(CATEGORIAS_CIENTIFICAS).map(([key, value]) => ({
    id: key,
    label: value,
    description: `Categoria ${value.toLowerCase()}`,
    color: '#3b82f6',
    icon: '🏢'
  }));

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Setor' : 'Novo Setor'}
      subtitle={isEditing ? 'Atualize as informações do setor' : 'Preencha os dados do novo setor'}
      confirmText={isEditing ? 'Salvar Alterações' : 'Criar Setor'}
      onConfirm={() => {
        console.log('Setor salvo!');
        onClose();
      }}
      isLoading={isLoading}
      size="large"
    >
      <FieldGroup>
        <SectionTitle>Informações Básicas</SectionTitle>
        <div>
          <Input
            placeholder="Nome do setor"
            value={setor?.nome || ''}
            onChange={() => {}}
          />
        </div>
        
        <div>
          <Textarea
            placeholder="Descrição do setor (opcional)"
            value={setor?.descricao || ''}
            onChange={() => {}}
            rows={3}
          />
        </div>
      </FieldGroup>

      <FieldGroup>
        <SectionTitle>Categoria Científica</SectionTitle>
        <FormSelection
          options={categoriaOptions}
          value={setor?.categoria || Object.keys(CATEGORIAS_CIENTIFICAS)[0]}
          onChange={() => {}}
        />
      </FieldGroup>

      <FieldGroup>
        <SectionTitle>Configurações</SectionTitle>
        <ToggleContainer>
          <ToggleSwitch>
            <ToggleInput
              id="ativo"
              checked={setor?.ativo ?? true}
              onChange={() => {}}
            />
            <ToggleSlider $checked={setor?.ativo ?? true} />
          </ToggleSwitch>
          <ToggleInfo>
            <ToggleTitle>Status Ativo</ToggleTitle>
            <ToggleText>
              Setores ativos podem receber chamados e ter equipamentos associados
            </ToggleText>
          </ToggleInfo>
        </ToggleContainer>
      </FieldGroup>

      {setor && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <strong>Status:</strong> {setor.ativo ? '✅ Ativo' : '❌ Inativo'} • 
          <strong> Criado em:</strong> {new Date(setor.dataCriacao).toLocaleDateString('pt-BR')}
        </div>
      )}
    </FormModal>
  );
};

const meta: Meta<typeof SetorModalDemo> = {
  title: 'Molecules/SetorModal',
  component: SetorModalDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Modal para criação e edição de setores do sistema.

**Características:**
- Formulário completo de setor
- Seleção visual de categoria científica
- Toggle para status ativo/inativo
- Descrição opcional
- Validações integradas

**Categorias científicas disponíveis:**
- Física, Química, Biologia, Engenharia, etc.

**Nota**: Este é um componente demo simplificado para o Storybook.
O componente real requer contextos de toast.
        `
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Se o modal está aberto'
    },
    setor: {
      description: 'Setor para edição (undefined para criação)'
    },
    isLoading: {
      control: 'boolean',
      description: 'Se está salvando'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NovoSetor: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    setor: undefined,
    isLoading: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Criação de novo setor. Nome é obrigatório, descrição é opcional.'
      }
    }
  }
};

export const EditarSetor: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    setor: {
      id: '1',
      nome: 'Laboratório de Física',
      descricao: 'Laboratório para experimentos de física experimental e teórica',
      categoria: 'FISICA',
      ativo: true,
      dataCriacao: '2024-01-15T10:30:00Z'
    },
    isLoading: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Edição de setor existente com todos os campos preenchidos.'
      }
    }
  }
};

export const SetorQuimica: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    setor: {
      id: '2',
      nome: 'Laboratório de Química Orgânica',
      descricao: 'Espaço dedicado à síntese e análise de compostos orgânicos',
      categoria: 'QUIMICA',
      ativo: true,
      dataCriacao: '2024-02-10T14:20:00Z'
    },
    isLoading: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Setor de química com descrição detalhada.'
      }
    }
  }
};

export const SetorInativo: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    setor: {
      id: '3',
      nome: 'Sala de Análises Antigas',
      descricao: 'Setor desativado temporariamente para reformas',
      categoria: 'ENGENHARIA',
      ativo: false,
      dataCriacao: '2023-11-05T09:15:00Z'
    },
    isLoading: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Setor inativo. O status é exibido no rodapé do modal.'
      }
    }
  }
};

export const SetorSemDescricao: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    setor: {
      id: '4',
      nome: 'Almoxarifado',
      descricao: '',
      categoria: 'OUTROS',
      ativo: true,
      dataCriacao: '2024-03-20T16:45:00Z'
    },
    isLoading: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Setor sem descrição, mostrando que este campo é opcional.'
      }
    }
  }
};

export const Salvando: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    setor: undefined,
    isLoading: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado de carregamento durante o salvamento do setor.'
      }
    }
  }
};
