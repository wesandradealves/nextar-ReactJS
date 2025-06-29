/**
 * Styled Components para a página de login
 */

import styled from 'styled-components';

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

export const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  padding-top: 32px;
`;

export const FormSection = styled.div`
  padding: 0 32px 32px;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: ${props => props.$hasError ? '#ef4444' : '#667eea'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

export const Checkbox = styled.input`
  margin-right: 8px;
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  appearance: none;
  position: relative;
  transition: all 0.2s ease;

  &:checked {
    background-color: #667eea;
    border-color: #667eea;
  }

  &:checked::after {
    content: '✓';
    position: absolute;
    top: -2px;
    left: 2px;
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  &:hover {
    border-color: #667eea;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;

export const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
`;

export const ErrorMessage = styled.div<{ $isGlobal?: boolean }>`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: ${props => props.$isGlobal ? '0' : '4px'};
  margin-bottom: ${props => props.$isGlobal ? '20px' : '0'};
  padding: ${props => props.$isGlobal ? '12px 16px' : '0'};
  background-color: ${props => props.$isGlobal ? '#fef2f2' : 'transparent'};
  border: ${props => props.$isGlobal ? '1px solid #fecaca' : 'none'};
  border-radius: ${props => props.$isGlobal ? '8px' : '0'};
`;

export const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const HelpSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
`;

export const HelpText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin: 0;
  line-height: 1.5;

  strong {
    color: #374151;
  }
`;
