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

export const SpinnerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const SpinnerWheel = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-top: 5px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// Exportação default para garantir que o arquivo seja reconhecido como módulo
const styles = {};
export default styles;
