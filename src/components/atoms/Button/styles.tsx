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
  position: relative;
  overflow: hidden;
  
  ${props => props.$variant === 'primary' && `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  `}
  
  ${props => props.$variant === 'danger' && `
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  `}
`;

export const ButtonContent = styled.span<{ $loading: boolean }>`
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
  box-sizing: border-box;
  display: inline-block;
`;
