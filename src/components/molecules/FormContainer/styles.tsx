import styled from 'styled-components';
import { StyledFormContainerProps, StyledFormActionsProps } from './types';


export const StyledFormContainer = styled.form<StyledFormContainerProps>`
  opacity: ${props => props.$isSubmitting ? 0.7 : 1};
  pointer-events: ${props => props.$isSubmitting ? 'none' : 'auto'};
  transition: opacity 0.2s ease-in-out;
`;


export const StyledFormFields = styled.div``;

export const StyledFormActions = styled.div<StyledFormActionsProps>`
  justify-content: ${props => props.$centered ? 'center' : 'flex-end'};
`;

export const StyledFormContent = styled.div``;

export const StyledValidationWrapper = styled.div`
  &.field-error {
    animation: shake 0.3s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
  }
`;

export const StyledValidationProgress = styled.div`
  background: linear-gradient(
    90deg,
    var(--color-success-500) 0%,
    var(--color-success-500) var(--progress, 0%),
    var(--color-gray-200) var(--progress, 0%),
    var(--color-gray-200) 100%
  );
  transition: all 0.3s ease-in-out;
`;
