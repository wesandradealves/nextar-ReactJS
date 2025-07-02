import styled from 'styled-components';

export const UsersPageContainer = styled.div``;
export const StatsContainer = styled.div``;
export const StatCard = styled.div``;
export const StatValue = styled.div``;
export const StatLabel = styled.div``;
export const FilterSection = styled.div``;
export const FilterButton = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => $active ? '#667eea' : 'white'};
  border-color: ${({ $active }) => $active ? '#667eea' : '#e2e8f0'};
  color: ${({ $active }) => $active ? 'white' : '#64748b'};
`;
export const ActionModal = styled.div<{ $visible?: boolean }>`
  display: ${({ $visible }) => $visible ? 'flex' : 'none'};
`;
export const ModalContent = styled.div``;
export const ModalHeader = styled.div``;
export const ModalTitle = styled.h2``;
export const ModalBody = styled.div``;
export const ModalFooter = styled.div``;
export const LoadingContainer = styled.div``;
export const ErrorContainer = styled.div``;
export const MobileOnlyActions = styled.div``;
export const DesktopOnlyActions = styled.div``;
export const ClickableStatus = styled.span<{ 
  isActive: boolean; 
  isClickable: boolean; 
}>`
  color: ${props => props.isActive ? '#10b981' : '#ef4444'};
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};
`;
export const StatusDot = styled.span<{ isActive: boolean }>`
  background-color: ${props => props.isActive ? '#10b981' : '#ef4444'};
`;
