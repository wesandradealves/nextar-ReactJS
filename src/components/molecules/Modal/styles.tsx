import styled, { keyframes } from 'styled-components';
import { ModalStyledProps } from './types';

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const slideIn = keyframes`
  from {
    transform: translate(-50%, -60%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
`;

export const ModalOverlay = styled.div`
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ModalContainer = styled.div<ModalStyledProps>`
  animation: ${slideIn} 0.2s ease-out;
`;

export const ModalHeader = styled.div``;

export const ModalTitle = styled.h2``;

export const ModalCloseButton = styled.button``;

export const ModalContent = styled.div``;

export const ModalFooter = styled.div``;
