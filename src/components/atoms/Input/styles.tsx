import styled from 'styled-components';

interface InputElementProps {
  $hasError: boolean;
}

export const InputElement = styled.input<InputElementProps>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  outline: none;
  background: white;

  &:focus {
    border-color: ${props => props.$hasError ? '#ef4444' : '#667eea'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:read-only {
    background-color: #f8fafc;
    cursor: default;
  }

  /* Estados de validação */
  &:valid:not(:placeholder-shown) {
    border-color: ${props => props.$hasError ? '#ef4444' : '#10b981'};
  }

  &:invalid:not(:placeholder-shown) {
    border-color: #ef4444;
  }

  /* Variações por tipo */
  &[type="search"] {
    padding-right: 40px;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 20px;
  }

  &[type="number"] {
    -moz-appearance: textfield;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;
