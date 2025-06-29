import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface ButtonElementProps {
  $variant: 'primary' | 'secondary' | 'danger' | 'outline';
  $size: 'small' | 'medium' | 'large';
  $fullWidth: boolean;
  $loading: boolean;
}

export const ButtonElement = styled.button<ButtonElementProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  /* Tamanhos */
  ${props => {
    switch (props.$size) {
      case 'small':
        return `
          padding: 8px 16px;
          font-size: 0.875rem;
          min-height: 36px;
        `;
      case 'medium':
        return `
          padding: 12px 20px;
          font-size: 1rem;
          min-height: 44px;
        `;
      case 'large':
        return `
          padding: 16px 24px;
          font-size: 1.125rem;
          min-height: 52px;
        `;
      default:
        return `
          padding: 12px 20px;
          font-size: 1rem;
          min-height: 44px;
        `;
    }
  }}
  
  /* Largura total */
  ${props => props.$fullWidth && `
    width: 100%;
  `}
  
  /* Variantes de cor */
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          
          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return `
          background: #f8fafc;
          color: #475569;
          border: 1px solid #e2e8f0;
          
          &:hover:not(:disabled) {
            background: #f1f5f9;
            border-color: #cbd5e1;
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          
          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
          
          &:hover:not(:disabled) {
            background: #667eea;
            color: white;
          }
        `;
      default:
        return '';
    }
  }}
  
  /* Estados desabilitado e loading */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  ${props => props.$loading && `
    cursor: wait;
    pointer-events: none;
  `}
`;

export const ButtonContent = styled.span<{ $loading: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: ${props => props.$loading ? 0.7 : 1};
  transition: opacity 0.2s ease;
`;

export const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
