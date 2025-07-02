import styled from 'styled-components';

/**
 * Container para os gráficos do dashboard
 */
export const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 24px;
  width: 100%;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

/**
 * Componente para cada gráfico individual
 */
export const ChartCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

/**
 * Título do gráfico
 */
export const ChartTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  text-align: center;
`;

/**
 * Container para o gráfico em si
 */
export const ChartContent = styled.div`
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Mensagem de ausência de dados
 */
export const NoDataMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 240px;
  color: #94a3b8;
  font-style: italic;
`;

/**
 * Legenda do gráfico
 */
export const ChartLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
`;

/**
 * Item de legenda
 */
export const LegendItem = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
`;

/**
 * Indicador de cor na legenda
 */
export const LegendColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.$color};
`;

/**
 * Texto da legenda
 */
export const LegendText = styled.span`
  color: #334155;
`;
