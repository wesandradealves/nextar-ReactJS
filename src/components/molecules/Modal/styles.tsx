import styled, { keyframes } from 'styled-components';
import { ModalStyledProps } from './types';

/**
 * Animações do modal
 */
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translate(-50%, -60%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
`;

/**
 * Overlay do modal
 */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
    align-items: flex-end;
  }
`;

/**
 * Container do modal
 */
export const ModalContainer = styled.div<ModalStyledProps>`
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.2s ease-out;

  /* Tamanhos do modal */
  width: ${({ $size }) => {
    switch ($size) {
      case 'small': return '400px';
      case 'medium': return '600px';
      case 'large': return '800px';
      case 'xlarge': return '1200px';
      default: return '600px';
    }
  }};

  max-width: ${({ $size }) => {
    switch ($size) {
      case 'small': return '90vw';
      case 'medium': return '90vw';
      case 'large': return '95vw';
      case 'xlarge': return '95vw';
      default: return '90vw';
    }
  }};

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    border-radius: 12px 12px 0 0;
    margin-top: auto;
    max-height: 85vh;
  }

  &:focus {
    outline: none;
  }
`;

/**
 * Header do modal
 */
export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 20px 20px 0 20px;
  }
`;

/**
 * Título do modal
 */
export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.5;
`;

/**
 * Botão de fechar
 */
export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: all 0.2s ease;

  &:hover {
    color: #374151;
    background-color: #f3f4f6;
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

/**
 * Conteúdo do modal
 */
export const ModalContent = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

/**
 * Footer do modal
 */
export const ModalFooter = styled.div`
  padding: 0 24px 24px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 0 20px 20px 20px;
    flex-direction: column-reverse;
    
    button {
      width: 100%;
    }
  }
`;
