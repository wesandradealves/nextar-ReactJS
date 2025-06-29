/**
 * Styled Components para o componente Spinner
 */

import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { 
    transform: rotate(0deg); 
  }
  100% { 
    transform: rotate(360deg); 
  }
`;

interface SpinnerContainerProps {
  $overlay: boolean;
}

interface SpinnerWheelProps {
  $size: 'small' | 'medium' | 'large';
  $color: string;
}

export const SpinnerContainer = styled.div<SpinnerContainerProps>`
  ${props => props.$overlay ? `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
  ` : `
    display: inline-flex;
  `}
  
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SpinnerWheel = styled.div<SpinnerWheelProps>`
  border-radius: 50%;
  border-style: solid;
  animation: ${spin} 1s linear infinite;
  
  /* Tamanhos */
  ${props => {
    switch (props.$size) {
      case 'small':
        return `
          width: 20px;
          height: 20px;
          border-width: 2px;
        `;
      case 'medium':
        return `
          width: 32px;
          height: 32px;
          border-width: 3px;
        `;
      case 'large':
        return `
          width: 48px;
          height: 48px;
          border-width: 4px;
        `;
      default:
        return `
          width: 32px;
          height: 32px;
          border-width: 3px;
        `;
    }
  }}
  
  /* Cores - efeito de loading com transparência */
  border-color: ${props => props.$color}33 ${props => props.$color}33 ${props => props.$color} ${props => props.$color}33;
`;

// Componentes legados para compatibilidade
export const SpinnerOverlay = SpinnerContainer;
