import styled from 'styled-components';

export const FormSection = styled.div`
  margin-bottom: 24px;
`;

export const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SelectOption = styled.div<{ $selected?: boolean }>`
  padding: 12px 16px;
  border: 2px solid ${props => props.$selected ? '#3B82F6' : '#E5E7EB'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$selected ? '#EFF6FF' : '#ffffff'};

  &:hover {
    border-color: #3B82F6;
    background: #EFF6FF;
  }
`;

export const SelectLabel = styled.div`
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 4px;
`;

export const SelectDescription = styled.div`
  font-size: 14px;
  color: #6B7280;
`;

export const StatusSection = styled.div`
  padding: 16px;
  background: #F9FAFB;
  border-radius: 8px;
  margin-bottom: 16px;
`;

export const StatusTitle = styled.h4`
  margin: 0 0 12px 0;
  color: #1F2937;
  font-size: 16px;
`;

export const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

export const StatusCard = styled.div<{ $status: string }>`
  padding: 12px;
  border-radius: 6px;
  background: ${props => {
    switch (props.$status) {
      case 'aberto': return '#FEF3C7';
      case 'em_progresso': return '#DBEAFE';
      case 'concluido': return '#D1FAE5';
      default: return '#F3F4F6';
    }
  }};
  border: 1px solid ${props => {
    switch (props.$status) {
      case 'aberto': return '#F59E0B';
      case 'em_progresso': return '#3B82F6';
      case 'concluido': return '#10B981';
      default: return '#D1D5DB';
    }
  }};
`;

export const StatusLabel = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

export const StatusValue = styled.div`
  font-size: 14px;
  color: #6B7280;
`;

export const FieldLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1F2937;
  font-size: 14px;
`;
