import styled from 'styled-components';

export const CalendarIcon = styled.div<{ $hasError?: boolean }>`
  color: ${({ $hasError }) => $hasError ? '#ef4444' : '#6b7280'};
`;
