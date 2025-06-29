import type { Meta, StoryObj } from '@storybook/react';
import Spinner from './index';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente atômico para exibir indicador de carregamento animado.'
      }
    }
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do spinner'
    },
    color: {
      control: 'color',
      description: 'Cor do spinner'
    },
    overlay: {
      control: 'boolean',
      description: 'Se deve mostrar overlay de fundo'
    },
    visible: {
      control: 'boolean',
      description: 'Se o spinner está visível'
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais'
    }
  },
  args: {
    size: 'medium',
    color: '#667eea',
    overlay: false,
    visible: true
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Spinner padrão
 */
export const Default: Story = {};

/**
 * Spinner pequeno
 */
export const Small: Story = {
  args: {
    size: 'small'
  }
};

/**
 * Spinner grande
 */
export const Large: Story = {
  args: {
    size: 'large'
  }
};

/**
 * Spinner com overlay (modo fullscreen)
 */
export const WithOverlay: Story = {
  args: {
    overlay: true,
    size: 'large',
    color: '#ffffff'
  },
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Spinner com cor personalizada
 */
export const CustomColor: Story = {
  args: {
    color: '#ef4444',
    size: 'medium'
  }
};

/**
 * Comparação de tamanhos
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="small" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Small</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="medium" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Medium</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="large" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Large</p>
      </div>
    </div>
  )
};

/**
 * Diferentes cores
 */
export const DifferentColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <Spinner color="#667eea" />
      <Spinner color="#ef4444" />
      <Spinner color="#10b981" />
      <Spinner color="#f59e0b" />
      <Spinner color="#8b5cf6" />
    </div>
  )
};

/**
 * Em uso com texto
 */
export const WithText: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Spinner size="small" />
      <span>Carregando...</span>
    </div>
  )
};

/**
 * Estado invisível (para teste)
 */
export const Hidden: Story = {
  args: {
    visible: false
  }
};
