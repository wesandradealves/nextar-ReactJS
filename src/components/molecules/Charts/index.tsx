import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartOptions
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { TipoManutencao } from '@/utils/enums';
import {
  ChartCard,
  ChartTitle,
  ChartContent,
  NoDataMessage,
  ChartLegend,
  LegendItem,
  LegendColor,
  LegendText
} from './styles';
import {
  DistribuicaoTipo,
  AgenteDistribuicao,
  ChartProps
} from './types';

// Registramos os componentes necessários do Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

/**
 * Gráfico de distribuição por tipo de manutenção (corretiva/preventiva)
 * 
 * @param distribucaoTipo - Objeto com a contagem de manutenções por tipo
 * @returns Componente de gráfico de pizza
 */
export const MaintenanceTypeChart = ({ 
  distribucaoTipo 
}: { 
  distribucaoTipo: DistribuicaoTipo 
}) => {
  const hasData = distribucaoTipo && 
    (distribucaoTipo[TipoManutencao.CORRETIVA] > 0 || distribucaoTipo[TipoManutencao.PREVENTIVA] > 0);

  if (!hasData) {
    return (
      <ChartCard className="bg-white p-6 md:p-4 rounded-xl shadow-sm flex flex-col">
        <ChartTitle className="text-base font-semibold text-slate-800 mb-4 text-center">Distribuição por Tipo de Manutenção</ChartTitle>
        <NoDataMessage className="flex items-center justify-center h-60 text-slate-400 italic">Nenhum dado disponível</NoDataMessage>
      </ChartCard>
    );
  }

  const data = {
    labels: ['Corretiva', 'Preventiva'],
    datasets: [
      {
        data: [
          distribucaoTipo[TipoManutencao.CORRETIVA],
          distribucaoTipo[TipoManutencao.PREVENTIVA]
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw as number;
            const total = (data.datasets[0].data as number[]).reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <ChartCard className="bg-white p-6 md:p-4 rounded-xl shadow-sm flex flex-col">
      <ChartTitle className="text-base font-semibold text-slate-800 mb-4 text-center">Distribuição por Tipo de Manutenção</ChartTitle>
      <ChartContent className="h-60 flex items-center justify-center">
        <Pie data={data} options={options} />
      </ChartContent>
      <ChartLegend className="flex flex-wrap justify-center gap-4 mt-4">
        <LegendItem $color="rgba(255, 99, 132, 0.7)">
          <LegendColor $color="rgba(255, 99, 132, 0.7)" />
          <LegendText className="text-slate-700">Corretiva: {distribucaoTipo[TipoManutencao.CORRETIVA]}</LegendText>
        </LegendItem>
        <LegendItem $color="rgba(54, 162, 235, 0.7)">
          <LegendColor $color="rgba(54, 162, 235, 0.7)" />
          <LegendText className="text-slate-700">Preventiva: {distribucaoTipo[TipoManutencao.PREVENTIVA]}</LegendText>
        </LegendItem>
      </ChartLegend>
    </ChartCard>
  );
};

/**
 * Gráfico de distribuição por agente de manutenção
 * 
 * @param distribucaoAgente - Array com dados de manutenções por agente
 * @returns Componente de gráfico de barras
 */
export const MaintenanceAgentChart = ({ 
  distribucaoAgente 
}: { 
  distribucaoAgente: AgenteDistribuicao[] 
}) => {
  const hasData = distribucaoAgente && distribucaoAgente.length > 0;

  if (!hasData) {
    return (
      <ChartCard className="bg-white p-6 md:p-4 rounded-xl shadow-sm flex flex-col">
        <ChartTitle className="text-base font-semibold text-slate-800 mb-4 text-center">Distribuição por Agente de Manutenção</ChartTitle>
        <NoDataMessage className="flex items-center justify-center h-60 text-slate-400 italic">Nenhum dado disponível</NoDataMessage>
      </ChartCard>
    );
  }

  // Limitar a 6 agentes para melhor visualização
  const topAgentes = distribucaoAgente.slice(0, 6);
  
  const data = {
    labels: topAgentes.map(a => a.nomeAgente),
    datasets: [
      {
        label: 'Total de Chamados',
        data: topAgentes.map(a => a.quantidade),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Concluídos',
        data: topAgentes.map(a => a.quantidadeConcluidos),
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <ChartCard className="bg-white p-6 md:p-4 rounded-xl shadow-sm flex flex-col">
      <ChartTitle className="text-base font-semibold text-slate-800 mb-4 text-center">Distribuição por Agente de Manutenção</ChartTitle>
      <ChartContent className="h-60 flex items-center justify-center">
        <Bar data={data} options={options} />
      </ChartContent>
    </ChartCard>
  );
};

/**
 * Componente principal que agrupa os gráficos do dashboard
 * 
 * @version 3.1.0
 * @description
 * Renderiza os gráficos de:
 * - Distribuição por tipo de manutenção (corretiva/preventiva)
 * - Distribuição por agente de manutenção
 * 
 * Cada gráfico trata seus próprios estados vazios e formatação de dados
 * 
 * @example
 * ```tsx
 * <DashboardCharts 
 *   distribucaoTipo={dashboardData.distribucaoTipo} 
 *   distribucaoAgente={dashboardData.distribucaoAgente} 
 * />
 * ```
 */
export const DashboardCharts = ({ 
  distribucaoTipo, 
  distribucaoAgente 
}: ChartProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6 w-full">
      <MaintenanceTypeChart distribucaoTipo={distribucaoTipo} />
      <MaintenanceAgentChart distribucaoAgente={distribucaoAgente} />
    </div>
  );
};

export default DashboardCharts;
