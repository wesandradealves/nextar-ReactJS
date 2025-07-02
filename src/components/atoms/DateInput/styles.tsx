import styled from 'styled-components';

/**
 * Componente de container do DateInput
 * Convertido para Tailwind
 * @deprecated - Use Tailwind classes instead
 */
// export const DateInputContainer = styled.div``;

/**
 * Componente que estiliza o ícone de calendário
 * Mantido apenas para comportamento dinâmico
 */
export const CalendarIcon = styled.div<{ $hasError?: boolean }>`
  color: ${({ $hasError }) => $hasError ? '#ef4444' : '#6b7280'};
`;
