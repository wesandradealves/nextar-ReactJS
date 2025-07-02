import styled from 'styled-components';

export const SetoresPageContainer = styled.div``;
export const StatsContainer = styled.div``;
export const StatCard = styled.div``;
export const StatValue = styled.div``;
export const StatLabel = styled.div``;
export const FilterSection = styled.div``;
export const FilterButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? '#3b82f6' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#64748b'};
  border: 1px solid ${props => props.$active ? '#3b82f6' : '#e2e8f0'};
`;
export const ClickableStatus = styled.span<{ 
  $isActive: boolean; 
  $isClickable: boolean;
}>`
  color: ${props => props.$isActive ? '#10b981' : '#ef4444'};
  cursor: ${props => props.$isClickable ? 'pointer' : 'default'};
`;
export const StatusDot = styled.span<{ $isActive: boolean }>`
  background-color: ${props => props.$isActive ? '#10b981' : '#ef4444'};
`;
