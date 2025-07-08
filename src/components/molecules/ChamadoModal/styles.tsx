import styled from 'styled-components';

export const HistoryItem = styled.div<{ $status?: string }>`
  border-left-color: ${({ $status }) => {
    switch ($status) {
      case 'aberto': return '#3b82f6';
      case 'em_andamento': return '#f59e0b';
      case 'concluido': return '#10b981';
      case 'cancelado': return '#ef4444';
      default: return '#6b7280';
    }
  }};
`;
