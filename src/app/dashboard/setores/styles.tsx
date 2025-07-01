import styled from 'styled-components';
import { mediaDown } from '@/assets/scss/breakpoints';

// =================================
// CONTAINER PRINCIPAL
// =================================

export const SetoresPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0;
  min-height: 100vh;
`;

// =================================
// HEADER DA PÁGINA
// =================================

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 20px;
  
  ${mediaDown.md(`
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  `)}
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
  
  ${mediaDown.md(`
    font-size: 1.75rem;
  `)}
`;

export const PageSubtitle = styled.p`
  margin: 8px 0 0 0;
  font-size: 1rem;
  color: #64748b;
  line-height: 1.5;
  
  ${mediaDown.md(`
    font-size: 0.875rem;
  `)}
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  ${mediaDown.md(`
    justify-content: stretch;
    
    > * {
      flex: 1;
    }
  `)}
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
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  
  ${mediaDown.md(`
    font-size: 2rem;
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
  padding: 0 20px;
  
  ${mediaDown.md(`
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  `)}
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? '#3b82f6' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#64748b'};
  border: 1px solid ${props => props.$active ? '#3b82f6' : '#e2e8f0'};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? '#2563eb' : '#f8fafc'};
    border-color: ${props => props.$active ? '#2563eb' : '#cbd5e1'};
  }
  
  ${mediaDown.md(`
    padding: 6px 12px;
    font-size: 0.75rem;
  `)}
`;

// =================================
// STATUS CLICÁVEL
// =================================

export const ClickableStatus = styled.span<{ 
  $isActive: boolean; 
  $isClickable: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${props => props.$isClickable ? 'pointer' : 'default'};
  color: ${props => props.$isActive ? '#10b981' : '#ef4444'};
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: ${props => props.$isClickable ? 0.8 : 1};
  }
`;

export const StatusDot = styled.span<{ $isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$isActive ? '#10b981' : '#ef4444'};
  flex-shrink: 0;
`;
