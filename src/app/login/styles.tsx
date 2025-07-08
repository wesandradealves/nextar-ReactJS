import styled from 'styled-components';

export const LoginContainer = styled.div``;
export const LoginCard = styled.div``;
export const FormSection = styled.div``;
export const FormGroup = styled.div``;
export const Label = styled.label``;
export const CheckboxGroup = styled.div``;
export const Checkbox = styled.input``;
export const CheckboxLabel = styled.label``;

export const ErrorMessage = styled.div<{ $isGlobal?: boolean }>`
  margin-top: ${props => props.$isGlobal ? '0' : '4px'};
  margin-bottom: ${props => props.$isGlobal ? '20px' : '0'};
  padding: ${props => props.$isGlobal ? '12px 16px' : '0'};
  background-color: ${props => props.$isGlobal ? '#fef2f2' : 'transparent'};
  border: ${props => props.$isGlobal ? '1px solid #fecaca' : 'none'};
  border-radius: ${props => props.$isGlobal ? '8px' : '0'};
`;

export const HelpSection = styled.div``;
export const HelpText = styled.p``;
