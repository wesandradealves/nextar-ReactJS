import styled from 'styled-components';

/**
 * Elemento Select estilizado
 * Segue o padrão visual dos outros componentes atômicos
 */
export const SelectElement = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  font-family: inherit;
  border: 1px solid ${({ $hasError }) => $hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 8px;
  background-color: #ffffff;
  color: #374151;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  
  /* Aparência customizada da seta */
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;

  &:hover {
    border-color: ${({ $hasError }) => $hasError ? '#dc2626' : '#d1d5db'};
  }

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => $hasError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${({ $hasError }) => $hasError ? '#fecaca' : '#dbeafe'};
  }

  &:disabled {
    background-color: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    border-color: #e5e7eb;
  }

  /* Estilos para as opções */
  option {
    padding: 8px 12px;
    background-color: #ffffff;
    color: #374151;
    
    &:disabled {
      color: #9ca3af;
    }
    
    &:checked {
      background-color: #3b82f6;
      color: #ffffff;
    }
  }

  /* Placeholder styling */
  &[value=""] {
    color: #9ca3af;
  }
`;
