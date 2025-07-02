import styled from 'styled-components';

export const FormFieldContainer = styled.div``;

export const Label = styled.label<{ $required?: boolean }>`
  ${props => props.$required && `
    &::after {
      content: ' *';
      color: #ef4444;
    }
  `}
`;

export const ErrorMessage = styled.span`
  &::before {
    content: '⚠';
    font-size: 0.75rem;
  }
`;

export const HelpText = styled.span``;
