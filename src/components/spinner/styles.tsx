/**
 * Estilos para o componente Spinner
 */

import styled, { keyframes } from 'styled-components';
// import { SpinnerProps } from './types';

export const spin = keyframes`
  0% { 
    transform: rotate(0deg); 
  }
  100% { 
    transform: rotate(360deg); 
  }
`;

export const SpinnerContainer = styled.div<{
  $overlay?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => props.$overlay && `
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 50;
  `}
`;

export const SpinnerElement = styled.div<{
  $size: 'small' | 'medium' | 'large';
  $color: string;
}>`
  border-radius: 9999px;
  border-style: solid;
  animation: ${spin} 1s linear infinite;
  
  ${props => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '102, 126, 234'; 
    };
    
    const rgb = hexToRgb(props.$color);
    
    return `
      border-color: rgba(${rgb}, 0.2) rgba(${rgb}, 0.2) rgba(${rgb}, 1) rgba(${rgb}, 0.2);
      
      ${props.$size === 'small' && `
        width: 1.25rem;
        height: 1.25rem;
        border-width: 2px;
      `}
      
      ${props.$size === 'medium' && `
        width: 2rem;
        height: 2rem;
        border-width: 3px;
      `}
      
      ${props.$size === 'large' && `
        width: 3rem;
        height: 3rem;
        border-width: 4px;
      `}
    `;
  }}
`;
