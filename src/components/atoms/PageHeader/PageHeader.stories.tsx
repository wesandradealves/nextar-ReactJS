import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './index';

const meta: Meta<typeof PageHeader> = {
  title: 'Atoms/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { 
      control: 'text', 
      description: 'Título principal do cabeçalho'
    },
    subtitle: { 
      control: 'text', 
      description: 'Texto secundário/descrição do cabeçalho'
    },
    exportLabel: { 
      control: 'text', 
      description: 'Texto do botão de exportação'
    },
    addLabel: { 
      control: 'text', 
      description: 'Texto do botão de adição'
    },
    exportDisabled: { 
      control: 'boolean', 
      description: 'Define se o botão de exportação está desabilitado'
    },
    showExportButton: { 
      control: 'boolean', 
      description: 'Controla a visibilidade do botão de exportação'
    },
    showAddButton: { 
      control: 'boolean', 
      description: 'Controla a visibilidade do botão de adição'
    },
    onExport: { action: 'exported' },
    onAdd: { action: 'added' }
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: 'Título da Página',
    subtitle: 'Descrição ou subtítulo da página',
    showExportButton: true,
    showAddButton: true,
    exportDisabled: false,
    addLabel: '+ Novo Item',
    exportLabel: 'Exportar CSV',
  },
};

export const WithoutExportButton: Story = {
  args: {
    title: 'Gerenciamento de Usuários',
    subtitle: 'Gerencie os usuários do sistema',
    showExportButton: false,
    showAddButton: true,
    addLabel: '+ Novo Usuário',
  },
};

export const WithoutAddButton: Story = {
  args: {
    title: 'Histórico de Manutenções',
    subtitle: 'Visualize o histórico de manutenções realizadas',
    showExportButton: true,
    showAddButton: false,
    exportLabel: 'Exportar Histórico',
  },
};

export const WithDisabledExport: Story = {
  args: {
    title: 'Lista de Chamados',
    subtitle: 'Gerencie os chamados de manutenção',
    exportDisabled: true,
    showExportButton: true,
    showAddButton: true,
  },
};
