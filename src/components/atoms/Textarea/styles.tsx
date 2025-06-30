import styled, { css } from 'styled-components';

interface StyledTextareaProps {
  $error?: boolean;
  $disabled?: boolean;
}

export const TextareaContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StyledTextarea = styled.textarea<StyledTextareaProps>`
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.2s ease;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  ${({ $error }) =>
    $error &&
    css`
      border-color: #ef4444;

      &:focus {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      background-color: #f8fafc;
      color: #64748b;
      cursor: not-allowed;
      
      &:focus {
        border-color: #e2e8f0;
        box-shadow: none;
      }
    `}
`;

export const HelperText = styled.span<{ $error?: boolean }>`
  margin-top: 6px;
  font-size: 12px;
  color: ${({ $error }) => ($error ? '#ef4444' : '#64748b')};
`;

export const CharacterCount = styled.span`
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
  text-align: right;
`;
