import styled from 'styled-components';
import { mediaDown } from '@/assets/scss/breakpoints';

// =================================
// CONTAINER PRINCIPAL
// =================================

export const UsersPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 24px;
  min-height: 100vh;
`;

// =================================
// ESTATÍSTICAS
// =================================

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  
  ${mediaDown.md(`
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  `)}
`;

export const StatCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  
  ${mediaDown.md(`
    padding: 16px;
  `)}
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
  
  ${mediaDown.md(`
    font-size: 1.5rem;
  `)}
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  
  ${mediaDown.md(`
    font-size: 0.75rem;
  `)}
`;

// =================================
// FILTROS
// =================================

export const FilterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  
  ${mediaDown.md(`
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px 16px;
  `)}
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid ${({ $active }) => $active ? '#667eea' : '#e2e8f0'};
  border-radius: 8px;
  background: ${({ $active }) => $active ? '#667eea' : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#64748b'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    border-color: #667eea;
    color: ${({ $active }) => $active ? 'white' : '#667eea'};
    background: ${({ $active }) => $active ? '#5a67d8' : '#f8fafc'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${mediaDown.md(`
    justify-content: center;
    padding: 10px 16px;
  `)}
`;

// =================================
// MODAIS
// =================================

export const ActionModal = styled.div<{ $visible?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $visible }) => $visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
`;

export const ModalHeader = styled.div`
  padding: 20px 24px 0 24px;
  border-bottom: 1px solid #e2e8f0;
`;

export const ModalTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
`;

export const ModalBody = styled.div`
  padding: 24px;
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 24px 24px 24px;
  border-top: 1px solid #e2e8f0;
`;

// =================================
// ESTADO DE LOADING
// =================================

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #64748b;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #dc2626;
  
  h3 {
    margin: 0 0 8px 0;
    color: #1e293b;
  }
  
  p {
    margin: 0;
    color: #64748b;
  }
`;

// =================================
// RESPONSIVIDADE ADICIONAL
// =================================

export const MobileOnlyActions = styled.div`
  display: none;
  
  ${mediaDown.md(`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
  `)}
`;

export const DesktopOnlyActions = styled.div`
  ${mediaDown.md(`
    display: none;
  `)}
`;

// =================================
// COMPONENTES DE STATUS
// =================================

export const ClickableStatus = styled.span.withConfig({
  shouldForwardProp: (prop) => !['isActive', 'isClickable'].includes(prop),
})<{ 
  isActive: boolean; 
  isClickable: boolean; 
}>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: ${props => props.isActive ? '#10b981' : '#ef4444'};
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};
  padding: 2px 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  ${props => props.isClickable && `
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  `}
`;

export const StatusDot = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.isActive ? '#10b981' : '#ef4444'};
`;
