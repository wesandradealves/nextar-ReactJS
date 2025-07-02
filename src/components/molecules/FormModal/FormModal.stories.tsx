import type { Meta, StoryObj } from '@storybook/react';
import { FormModal, FieldGroup, SectionTitle } from './index';
import { Input } from '../../atoms/Input';
import { Select } from '../../atoms/Select';
import Textarea from '../../atoms/Textarea';
import { useState } from 'react';

const meta: Meta<typeof FormModal> = {
  title: 'Molecules/FormModal',
  component: FormModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Modal padronizada para formulários com estrutura consistente.

**Características:**
- Layout padronizado para formulários
- Botões de ação no footer
- Suporte a diferentes tamanhos
- Estados de loading e validação
- Componentes auxiliares para estruturação (FieldGroup, SectionTitle)

**Componentes auxiliares inclusos:**
- \`FieldGroup\`: Agrupa campos relacionados
- \`SectionTitle\`: Título de seção dentro do formulário
- \`ToggleContainer\`, \`ToggleSwitch\`, etc.: Para elementos de toggle

**Uso:**
\`\`\`tsx
<FormModal
  isOpen={true}
  onClose={() => {}}
  title="Novo Item"
  onConfirm={() => {}}
  confirmText="Salvar"
>
  <FieldGroup>
    <Input placeholder="Nome" />
  </FieldGroup>
</FormModal>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Se o modal está aberto'
    },
    title: {
      control: 'text',
      description: 'Título do modal'
    },
    subtitle: {
      control: 'text',
      description: 'Subtítulo opcional'
    },
    confirmText: {
      control: 'text',
      description: 'Texto do botão de confirmação'
    },
    cancelText: {
      control: 'text',
      description: 'Texto do botão de cancelar'
    },
    isLoading: {
      control: 'boolean',
      description: 'Se está carregando/salvando'
    },
    isConfirmDisabled: {
      control: 'boolean',
      description: 'Se o botão de confirmar está desabilitado'
    },
    confirmVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'outline'],
      description: 'Variante do botão de confirmação'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do modal'
    },
    showFooter: {
      control: 'boolean',
      description: 'Se deve mostrar o footer com botões'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Template base para as stories
const FormModalTemplate = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Abrir Modal</button>
      <FormModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          console.log('Confirmado!');
          setIsOpen(false);
        }}
      >
        <FieldGroup>
          <Input placeholder="Nome do item" />
        </FieldGroup>
      </FormModal>
    </>
  );
};

export const Default: Story = {
  render: FormModalTemplate,
  args: {
    title: 'Novo Item',
    subtitle: 'Preencha as informações do item',
    confirmText: 'Salvar',
    cancelText: 'Cancelar'
  }
};

export const Loading: Story = {
  render: FormModalTemplate,
  args: {
    title: 'Salvando...',
    subtitle: 'Aguarde enquanto salvamos as informações',
    confirmText: 'Salvando...',
    isLoading: true
  }
};

export const DisabledConfirm: Story = {
  render: FormModalTemplate,
  args: {
    title: 'Formulário Incompleto',
    subtitle: 'Preencha todos os campos obrigatórios',
    confirmText: 'Salvar',
    isConfirmDisabled: true
  }
};

export const DangerVariant: Story = {
  render: FormModalTemplate,
  args: {
    title: 'Excluir Item',
    subtitle: 'Esta ação não pode ser desfeita',
    confirmText: 'Excluir',
    confirmVariant: 'danger'
  }
};

export const SmallSize: Story = {
  render: FormModalTemplate,
  args: {
    title: 'Confirmação',
    subtitle: 'Deseja continuar?',
    confirmText: 'Sim',
    size: 'small'
  }
};

export const LargeSize: Story = {
  render: FormModalTemplate,
  args: {
    title: 'Formulário Completo',
    subtitle: 'Preencha todas as informações necessárias',
    confirmText: 'Salvar',
    size: 'large'
  }
};

export const ComplexForm: Story = {
  render: (args: any) => {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
      <>
        <button onClick={() => setIsOpen(true)}>Abrir Modal Complexo</button>
        <FormModal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            console.log('Formulário enviado!');
            setIsOpen(false);
          }}
        >
          <FieldGroup>
            <SectionTitle>Informações Básicas</SectionTitle>
            <Input placeholder="Nome completo" />
            <Input placeholder="Email" type="email" />
          </FieldGroup>

          <FieldGroup>
            <SectionTitle>Detalhes</SectionTitle>
            <Select
              placeholder="Selecione uma categoria"
              options={[
                { value: '1', label: 'Categoria 1' },
                { value: '2', label: 'Categoria 2' },
                { value: '3', label: 'Categoria 3' }
              ]}
            />
            <Textarea
              value=""
              onChange={() => {}}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </FieldGroup>
        </FormModal>
      </>
    );
  },
  args: {
    title: 'Formulário Completo',
    subtitle: 'Exemplo de formulário com múltiplas seções',
    confirmText: 'Criar Item',
    size: 'large'
  }
};

export const ViewOnly: Story = {
  render: (args: any) => {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
      <>
        <button onClick={() => setIsOpen(true)}>Ver Detalhes</button>
        <FormModal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <FieldGroup>
            <SectionTitle>Informações do Item</SectionTitle>
            <Input value="Item de Exemplo" disabled />
            <Input value="categoria@exemplo.com" disabled />
            <Textarea
              value="Estas são informações somente para visualização..."
              onChange={() => {}}
              disabled
              rows={3}
            />
          </FieldGroup>
        </FormModal>
      </>
    );
  },
  args: {
    title: 'Detalhes do Item',
    subtitle: 'Visualização somente leitura',
    showFooter: false
  }
};
