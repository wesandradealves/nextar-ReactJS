import styled from 'styled-components';

export const ChartsContainer = styled.div``;

export const ChartCard = styled.div``;

export const ChartTitle = styled.h3``;

export const ChartContent = styled.div``;

export const NoDataMessage = styled.div``;

export const ChartLegend = styled.div``;

export const LegendItem = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
`;

export const LegendColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.$color};
`;

export const LegendText = styled.span``;
