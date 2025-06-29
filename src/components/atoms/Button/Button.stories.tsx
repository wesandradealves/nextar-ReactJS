import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente atômico para botões com múltiplas variantes e estados.'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'outline'],
      description: 'Variante visual do botão'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do botão'
    },
    disabled: {
      control: 'boolean',
      description: 'Se o botão está desabilitado'
    },
    loading: {
      control: 'boolean',
      description: 'Se o botão está em estado de carregamento'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Se o botão deve ocupar toda a largura'
    },
    children: {
      control: 'text',
      description: 'Conteúdo do botão'
    }
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
    fullWidth: false
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Botão primário padrão
 */
export const Primary: Story = {};

/**
 * Botão secundário
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary'
  }
};

/**
 * Botão de perigo
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Excluir'
  }
};

/**
 * Botão outline
 */
export const Outline: Story = {
  args: {
    variant: 'outline'
  }
};

/**
 * Botão pequeno
 */
export const Small: Story = {
  args: {
    size: 'small'
  }
};

/**
 * Botão grande
 */
export const Large: Story = {
  args: {
    size: 'large'
  }
};

/**
 * Botão desabilitado
 */
export const Disabled: Story = {
  args: {
    disabled: true
  }
};

/**
 * Botão em loading
 */
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Carregando...'
  }
};

/**
 * Botão largura total
 */
export const FullWidth: Story = {
  args: {
    fullWidth: true
  },
  parameters: {
    layout: 'padded'
  }
};

/**
 * Todas as variantes
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="outline">Outline</Button>
    </div>
  )
};

/**
 * Todos os tamanhos
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  )
};

/**
 * Estados interativos
 */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  )
};

/**
 * Botão de submit para formulários
 */
export const SubmitButton: Story = {
  args: {
    type: 'submit',
    children: 'Enviar Formulário',
    fullWidth: true
  },
  parameters: {
    layout: 'padded'
  }
};
