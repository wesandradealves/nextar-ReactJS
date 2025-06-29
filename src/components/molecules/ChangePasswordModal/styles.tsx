import styled from 'styled-components';

export const PasswordModalContainer = styled.div`
  padding: 0;
`;

export const PasswordModalHeader = styled.div`
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e5e7eb;
`;

export const PasswordModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PasswordModalDescription = styled.p`
  margin: 8px 0 0 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
`;

export const PasswordModalContent = styled.div`
  padding: 24px;
`;

export const PasswordFormField = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const PasswordLabel = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

export const PasswordInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 2px ${props => props.$hasError ? '#fecaca' : '#dbeafe'};
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

export const PasswordError = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 0.75rem;
  color: #ef4444;
`;

export const PasswordHelpText = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 0.75rem;
  color: #6b7280;
`;

export const PasswordModalActions = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const PasswordRequirements = styled.div`
  margin: 16px 0;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`;

export const PasswordRequirementTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

export const PasswordRequirementList = styled.ul`
  margin: 0;
  padding-left: 16px;
  list-style-type: disc;
`;

export const PasswordRequirementItem = styled.li<{ $met?: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$met ? '#10b981' : '#6b7280'};
  margin-bottom: 2px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const SecurityTip = styled.div`
  margin-top: 16px;
  padding: 12px;
  background-color: #eff6ff;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
`;

export const SecurityTipTitle = styled.h5`
  margin: 0 0 4px 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e40af;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const SecurityTipText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #1e40af;
  line-height: 1.4;
`;
