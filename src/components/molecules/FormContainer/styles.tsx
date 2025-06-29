import styled from 'styled-components';
import { mediaDown } from '@/assets/scss/breakpoints';
import { StyledFormContainerProps, StyledFormActionsProps } from './types';

/**
 * Container principal do formulário
 */
export const StyledFormContainer = styled.form<StyledFormContainerProps>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  opacity: ${props => props.$isSubmitting ? 0.7 : 1};
  pointer-events: ${props => props.$isSubmitting ? 'none' : 'auto'};
  transition: opacity 0.2s ease-in-out;
`;

/**
 * Container dos campos do formulário
 */
export const StyledFormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

/**
 * Container das ações (botões) do formulário
 */
export const StyledFormActions = styled.div<StyledFormActionsProps>`
  display: flex;
  gap: 1rem;
  justify-content: ${props => props.$centered ? 'center' : 'flex-end'};
  align-items: center;
  border-top: 1px solid var(--color-gray-200);

  ${mediaDown.sm(`
    flex-direction: column;
    gap: 0.75rem;
    
    button {
      width: 100%;
    }
  `)}
`;

/**
 * Container para conteúdo adicional
 */
export const StyledFormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

/**
 * Wrapper para validação em tempo real
 */
export const StyledValidationWrapper = styled.div`
  position: relative;
  
  &.field-error {
    animation: shake 0.3s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
  }
`;

/**
 * Indicador de progresso de validação
 */
export const StyledValidationProgress = styled.div`
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--color-success-500) 0%,
    var(--color-success-500) var(--progress, 0%),
    var(--color-gray-200) var(--progress, 0%),
    var(--color-gray-200) 100%
  );
  border-radius: 1px;
  transition: all 0.3s ease-in-out;
  opacity: 0.8;
`;
