import styled, { keyframes, css } from 'styled-components';
import { mediaDown } from '@/assets/scss/breakpoints';

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

export const DataTableContainer = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`;

export const TableHeader = styled.div``;

export const TableTitle = styled.h3``;

export const TableActions = styled.div``;

export const SearchAndFilters = styled.div``;

export const FilterButton = styled.button<{ $active?: boolean }>`
  ${({ $active }) => $active && `
    border-color: #667eea;
    background: #667eea;
    color: white;
  `}
  
  &:hover {
    border-color: #667eea;
    color: ${({ $active }) => $active ? 'white' : '#667eea'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TableWrapper = styled.div`
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

export const Table = styled.table``;

export const TableHead = styled.thead``;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr<{ $selectable?: boolean; $selected?: boolean; $loading?: boolean }>`
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
`;

export const TableHeaderCell = styled.th<{ 
  $sortable?: boolean; 
  $align?: 'left' | 'center' | 'right';
  $width?: string;
  $hideOnMobile?: boolean;
}>`
  ${({ $align = 'left' }) => `text-align: ${$align};`}
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
  ${({ $align = 'left' }) => `text-align: ${$align};`}
  
  ${({ $hideOnMobile }) => $hideOnMobile && mediaDown.md(`
    display: none;
  `)}
`;

export const SortIndicator = styled.span<{ $direction?: 'asc' | 'desc' | null }>`
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

export const RowActions = styled.div``;

export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
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

export const CheckboxCell = styled.td``;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })<{ $indeterminate?: boolean }>`
  ${({ $indeterminate }) => $indeterminate && css`
    &:checked {
      opacity: 0.7;
    }
  `}
`;

export const EmptyState = styled.div``;

export const EmptyIcon = styled.div``;

export const EmptyMessage = styled.p``;

export const EmptyDescription = styled.p``;

export const LoadingOverlay = styled.div``;

export const LoadingSkeleton = styled.div`
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

export const LoadingSpinner = styled.div`
  animation: ${spin} 1s linear infinite;
`;

export const PaginationContainer = styled.div`
  ${mediaDown.md(`
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
    padding: 12px 16px;
  `)}
`;

export const PaginationInfo = styled.div`
  ${mediaDown.md(`
    text-align: center;
  `)}
`;

export const PaginationControls = styled.div`
  ${mediaDown.md(`
    justify-content: center;
  `)}
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  ${({ $active }) => $active && `
    border-color: #667eea;
    background: #667eea;
    color: white;
  `}
  
  &:hover:not(:disabled) {
    border-color: #667eea;
    color: ${({ $active }) => $active ? 'white' : '#667eea'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PaginationEllipsis = styled.span``;

export const MobileCard = styled.div<{ $selected?: boolean }>`
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

export const MobileCardHeader = styled.div``;

export const MobileCardTitle = styled.h4``;

export const MobileCardActions = styled.div``;

export const MobileCardBody = styled.div``;

export const MobileCardField = styled.div``;

export const MobileCardLabel = styled.span``;

export const MobileCardValue = styled.span``;
