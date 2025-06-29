import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './index';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente atômico para campos de entrada com estados de validação.'
      }
    }
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Tipo do input HTML'
    },
    placeholder: {
      control: 'text',
      description: 'Texto placeholder'
    },
    disabled: {
      control: 'boolean',
      description: 'Se o input está desabilitado'
    },
    readOnly: {
      control: 'boolean',
      description: 'Se o input é somente leitura'
    },
    hasError: {
      control: 'boolean',
      description: 'Se o input tem erro'
    },
    required: {
      control: 'boolean',
      description: 'Se o input é obrigatório'
    }
  },
  args: {
    placeholder: 'Digite algo...',
    type: 'text',
    disabled: false,
    readOnly: false,
    hasError: false,
    required: false
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Input padrão
 */
export const Default: Story = {};

/**
 * Input com erro
 */
export const WithError: Story = {
  args: {
    hasError: true,
    placeholder: 'Campo obrigatório'
  }
};

/**
 * Input desabilitado
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Campo desabilitado'
  }
};

/**
 * Input somente leitura
 */
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: 'Valor somente leitura'
  }
};

/**
 * Input de email
 */
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'usuario@exemplo.com'
  }
};

/**
 * Input de senha
 */
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Digite sua senha'
  }
};

/**
 * Input de busca
 */
export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Buscar...'
  }
};

/**
 * Input numérico
 */
export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0'
  }
};

/**
 * Todos os tipos
 */
export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="search" placeholder="Search input" />
      <Input type="number" placeholder="Number input" />
      <Input type="tel" placeholder="Phone input" />
    </div>
  )
};

/**
 * Estados diferentes
 */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input placeholder="Normal state" />
      <Input hasError placeholder="Error state" />
      <Input disabled placeholder="Disabled state" />
      <Input readOnly value="Read-only state" />
      <Input required placeholder="Required field *" />
    </div>
  )
};
