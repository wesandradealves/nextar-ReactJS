import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './index';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente atômico Badge para tags, status e indicadores visuais.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Variante visual do badge',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do badge',
    },
    dot: {
      control: 'boolean',
      description: 'Se o badge é apenas um ponto (sem texto)',
    },
    onClick: {
      action: 'clicked',
      description: 'Função executada ao clicar (torna o badge clicável)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
    size: 'medium',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge size="small" variant="primary">Small</Badge>
      <Badge size="medium" variant="primary">Medium</Badge>
      <Badge size="large" variant="primary">Large</Badge>
    </div>
  ),
};

export const DotBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>Offline</span>
        <Badge variant="danger" dot size="small" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>Online</span>
        <Badge variant="success" dot />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>Away</span>
        <Badge variant="warning" dot size="large" />
      </div>
    </div>
  ),
};

export const StatusExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span>Chamado #001</span>
        <Badge variant="success" size="small">Concluído</Badge>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span>Chamado #002</span>
        <Badge variant="warning" size="small">Em Andamento</Badge>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span>Chamado #003</span>
        <Badge variant="danger" size="small">Urgente</Badge>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span>Chamado #004</span>
        <Badge variant="default" size="small">Novo</Badge>
      </div>
    </div>
  ),
};

export const Clickable: Story = {
  args: {
    children: 'Clique aqui',
    variant: 'primary',
    onClick: () => alert('Badge clicado!'),
  },
};

export const CategoryTags: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="primary" size="small">Hardware</Badge>
      <Badge variant="secondary" size="small">Software</Badge>
      <Badge variant="success" size="small">Rede</Badge>
      <Badge variant="warning" size="small">Manutenção</Badge>
      <Badge variant="danger" size="small">Crítico</Badge>
      <Badge variant="default" size="small">Outros</Badge>
    </div>
  ),
};
