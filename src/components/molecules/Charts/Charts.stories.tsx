import type { Meta, StoryObj } from '@storybook/react';
import { DashboardCharts, MaintenanceTypeChart, MaintenanceAgentChart } from './index';
import { TipoManutencao } from '@/utils/enums';

const meta: Meta<typeof DashboardCharts> = {
  title: 'Components/Molecules/Charts',
  component: DashboardCharts,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
O componente **Charts** oferece visualizações gráficas para o dashboard do sistema de manutenção.

### 🎯 **Principais Características:**
- **Gráfico de Pizza**: Distribuição por tipo de manutenção (corretiva/preventiva)
- **Gráfico de Barras**: Distribuição por agente de manutenção
- **Responsivo**: Adaptação automática ao tamanho da tela
- **Interativo**: Tooltips com informações detalhadas
- **Estados vazios**: Tratamento adequado para ausência de dados

### 🔄 **Integração com o Dashboard:**
- Consumo direto dos dados da API de dashboard
- Atualização automática com o sistema de cache
- Visualização em tempo real das estatísticas do sistema

### 📊 **Customização:**
- Cores temáticas consistentes com a identidade visual
- Opções de configuração via props
- Componentes individuais reutilizáveis
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    distribucaoTipo: {
      description: 'Dados de distribuição por tipo de manutenção',
      control: { type: 'object' }
    },
    distribucaoAgente: {
      description: 'Dados de distribuição por agente de manutenção',
      control: { type: 'object' }
    }
  }
};

export default meta;
type Story = StoryObj<typeof DashboardCharts>;

// Dados de exemplo para os gráficos
const mockDistribuicaoTipo = {
  [TipoManutencao.CORRETIVA]: 42,
  [TipoManutencao.PREVENTIVA]: 58
};

const mockDistribuicaoAgente = [
  { agenteId: '1', nomeAgente: 'Carlos Silva', quantidade: 25, quantidadeConcluidos: 20 },
  { agenteId: '2', nomeAgente: 'Ana Santos', quantidade: 18, quantidadeConcluidos: 15 },
  { agenteId: '3', nomeAgente: 'Roberto Oliveira', quantidade: 30, quantidadeConcluidos: 22 },
  { agenteId: '4', nomeAgente: 'Juliana Costa', quantidade: 12, quantidadeConcluidos: 10 },
  { agenteId: '5', nomeAgente: 'Fernando Souza', quantidade: 22, quantidadeConcluidos: 18 },
  { agenteId: '6', nomeAgente: 'Mariana Lima', quantidade: 15, quantidadeConcluidos: 12 }
];

// Histórias
export const Default: Story = {
  args: {
    distribucaoTipo: mockDistribuicaoTipo,
    distribucaoAgente: mockDistribuicaoAgente
  }
};

export const EmptyData: Story = {
  args: {
    distribucaoTipo: { [TipoManutencao.CORRETIVA]: 0, [TipoManutencao.PREVENTIVA]: 0 },
    distribucaoAgente: []
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado vazio quando não há dados disponíveis para visualização'
      }
    }
  }
};

export const TypeChart: StoryObj<typeof MaintenanceTypeChart> = {
  render: (args) => <MaintenanceTypeChart {...args} />,
  args: {
    distribucaoTipo: mockDistribuicaoTipo
  },
  parameters: {
    docs: {
      description: {
        story: 'Gráfico de pizza mostrando a distribuição por tipo de manutenção'
      }
    }
  }
};

export const AgentChart: StoryObj<typeof MaintenanceAgentChart> = {
  render: (args) => <MaintenanceAgentChart {...args} />,
  args: {
    distribucaoAgente: mockDistribuicaoAgente
  },
  parameters: {
    docs: {
      description: {
        story: 'Gráfico de barras mostrando a distribuição por agente de manutenção'
      }
    }
  }
};
