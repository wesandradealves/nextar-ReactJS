// import { ChartOptions } from 'chart.js';
import { TipoManutencao } from '@/utils/enums';

/**
 * Tipos para os componentes de gráficos
 */

/**
 * Interface para distribuição por tipo de manutenção
 */
export interface DistribuicaoTipo {
  [TipoManutencao.CORRETIVA]: number;
  [TipoManutencao.PREVENTIVA]: number;
}

/**
 * Interface para distribuição por agente/técnico
 */
export interface AgenteDistribuicao {
  agenteId: string;
  nomeAgente: string;
  quantidade: number;
  quantidadeConcluidos: number;
}

/**
 * Props principal para componentes de Charts
 */
export interface ChartProps {
  distribucaoTipo: DistribuicaoTipo;
  distribucaoAgente: AgenteDistribuicao[];
}

// Todas as interfaces abaixo foram movidas para arquivos internos
// e são usadas apenas dentro do componente, não sendo expostas.
// Comentadas para evitar lint errors de "unused"

// /**
//  * Props para o gráfico de pizza
//  */
// export interface PieChartProps {
//   /** Dados para o gráfico */
//   data: {
//     labels: string[];
//     datasets: {
//       label: string;
//       data: number[];
//       backgroundColor: string[];
//       borderColor: string[];
//       borderWidth: number;
//     }[];
//   };
//   /** Opções do gráfico */
//   options?: ChartOptions<'pie'>;
//   /** Texto quando não há dados */
//   noDataText?: string;
//   /** Título do gráfico */
//   title: string;
//   /** Legenda customizada */
//   customLegend?: {
//     labels: string[];
//     colors: string[];
//   };
// }

// /**
//  * Props para o gráfico de barras
//  */
// export interface BarChartProps {
//   /** Dados para o gráfico */
//   data: {
//     labels: string[];
//     datasets: {
//       label: string;
//       data: number[];
//       backgroundColor: string[];
//       borderColor?: string[];
//       borderWidth?: number;
//     }[];
//   };
//   /** Opções do gráfico */
//   options?: ChartOptions<'bar'>;
//   /** Texto quando não há dados */
//   noDataText?: string;
//   /** Título do gráfico */
//   title: string;
// }

// /**
//  * Props para o gráfico de tipo de manutenção
//  */
// export interface TipoManutencaoChartProps {
//   /** Dados de distribuição por tipo */
//   data: DistribuicaoTipo;
//   /** Classes CSS adicionais */
//   className?: string;
// }

// /**
//  * Props para o gráfico de distribuição por agente
//  */
// export interface AgenteChartProps {
//   /** Dados de distribuição por agente */
//   data: AgenteDistribuicao[];
//   /** Limite de agentes a mostrar */
//   limit?: number;
//   /** Classes CSS adicionais */
//   className?: string;
// }
