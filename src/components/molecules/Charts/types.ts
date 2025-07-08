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

