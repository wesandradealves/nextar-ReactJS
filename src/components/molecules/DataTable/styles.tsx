import styled, { keyframes, css } from 'styled-components';
import { mediaDown } from '@/assets/scss/breakpoints';

// =================================
// ANIMAÇÕES
// =================================

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

// =================================
// CONTAINER PRINCIPAL
// =================================

export const DataTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.3s ease-out;
`;

// =================================
// HEADER DA TABELA
// =================================

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  
  ${mediaDown.md(`
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
    padding: 12px 16px;
  `)}
`;

export const TableTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
`;

export const TableActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  ${mediaDown.md(`
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  `)}
`;

// =================================
// BARRA DE BUSCA E FILTROS
// =================================

export const SearchAndFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  ${mediaDown.md(`
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  `)}
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid ${({ $active }) => $active ? '#667eea' : '#e2e8f0'};
  border-radius: 6px;
  background: ${({ $active }) => $active ? '#667eea' : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#64748b'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    color: ${({ $active }) => $active ? 'white' : '#667eea'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// =================================
// TABELA PRINCIPAL
// =================================

export const TableWrapper = styled.div`
  flex: 1;
  overflow-x: auto;
  
  /* Scrollbar customizada */
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

export const TableHead = styled.thead`
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr<{ $selectable?: boolean; $selected?: boolean; $loading?: boolean }>`
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
  
  ${({ $selectable }) => $selectable && css`
    cursor: pointer;
  `}
  
  ${({ $selected }) => $selected && css`
    background-color: #f0f9ff;
    border-color: #bae6fd;
  `}
  
  ${({ $loading }) => $loading && css`
    opacity: 0.6;
    pointer-events: none;
  `}
  
  &:hover {
    background-color: ${({ $selected }) => $selected ? '#e0f2fe' : '#f8fafc'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeaderCell = styled.th<{ 
  $sortable?: boolean; 
  $align?: 'left' | 'center' | 'right';
  $width?: string;
  $hideOnMobile?: boolean;
}>`
  padding: 12px 16px;
  text-align: ${({ $align = 'left' }) => $align};
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  white-space: nowrap;
  ${({ $width }) => $width && `width: ${$width};`}
  
  ${({ $sortable }) => $sortable && css`
    cursor: pointer;
    user-select: none;
    position: relative;
    
    &:hover {
      background-color: #e2e8f0;
    }
  `}
  
  ${({ $hideOnMobile }) => $hideOnMobile && mediaDown.md(`
    display: none;
  `)}
`;

export const TableCell = styled.td<{ 
  $align?: 'left' | 'center' | 'right';
  $hideOnMobile?: boolean;
}>`
  padding: 12px 16px;
  text-align: ${({ $align = 'left' }) => $align};
  font-size: 0.875rem;
  color: #1e293b;
  vertical-align: middle;
  
  ${({ $hideOnMobile }) => $hideOnMobile && mediaDown.md(`
    display: none;
  `)}
`;

// =================================
// COMPONENTES DE ORDENAÇÃO
// =================================

export const SortIndicator = styled.span<{ $direction?: 'asc' | 'desc' | null }>`
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  font-size: 0.75rem;
  color: #9ca3af;
  
  ${({ $direction }) => {
    if ($direction === 'asc') {
      return css`
        color: #667eea;
        &::after {
          content: '↑';
        }
      `;
    }
    if ($direction === 'desc') {
      return css`
        color: #667eea;
        &::after {
          content: '↓';
        }
      `;
    }
    return css`
      &::after {
        content: '↕';
      }
    `;
  }}
`;

// =================================
// AÇÕES DA LINHA
// =================================

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  
  ${({ $variant = 'secondary' }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background: #667eea;
          color: white;
          &:hover { background: #5a67d8; }
        `;
      case 'danger':
        return css`
          background: #f56565;
          color: white;
          &:hover { background: #e53e3e; }
        `;
      default:
        return css`
          background: #f1f5f9;
          color: #64748b;
          &:hover { 
            background: #e2e8f0; 
            color: #475569;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// =================================
// SELEÇÃO E CHECKBOX
// =================================

export const CheckboxCell = styled.td`
  padding: 12px 16px;
  width: 48px;
  text-align: center;
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })<{ $indeterminate?: boolean }>`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #667eea;
  
  ${({ $indeterminate }) => $indeterminate && css`
    &:checked {
      opacity: 0.7;
    }
  `}
`;

// =================================
// ESTADOS VAZIOS E DE LOADING
// =================================

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #64748b;
`;

export const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.5;
`;

export const EmptyMessage = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: #475569;
`;

export const EmptyDescription = styled.p`
  margin: 8px 0 0 0;
  font-size: 0.875rem;
  color: #64748b;
`;

// =================================
// LOADING STATES
// =================================

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

export const LoadingSkeleton = styled.div`
  height: 16px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 4px;
`;

export const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// =================================
// PAGINAÇÃO
// =================================

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  
  ${mediaDown.md(`
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
    padding: 12px 16px;
  `)}
`;

export const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  
  ${mediaDown.md(`
    text-align: center;
  `)}
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${mediaDown.md(`
    justify-content: center;
  `)}
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${({ $active }) => $active ? '#667eea' : '#e2e8f0'};
  border-radius: 6px;
  background: ${({ $active }) => $active ? '#667eea' : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#64748b'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    border-color: #667eea;
    color: ${({ $active }) => $active ? 'white' : '#667eea'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PaginationEllipsis = styled.span`
  padding: 0 8px;
  color: #9ca3af;
  font-size: 0.875rem;
`;

// =================================
// RESPONSIVIDADE MOBILE
// =================================

export const MobileCard = styled.div<{ $selected?: boolean }>`
  display: none;
  
  ${mediaDown.md(`
    display: block;
    padding: 16px;
    border-bottom: 1px solid #f1f5f9;
    background: white;
    
    &:last-child {
      border-bottom: none;
    }
  `)}
  
  ${({ $selected }) => $selected && css`
    ${mediaDown.md(`
      background: #f0f9ff;
    `)}
  `}
`;

export const MobileCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const MobileCardTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
`;

export const MobileCardActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const MobileCardBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

export const MobileCardField = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MobileCardLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

export const MobileCardValue = styled.span`
  font-size: 0.875rem;
  color: #1e293b;
  margin-top: 2px;
`;
