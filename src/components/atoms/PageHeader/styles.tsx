import styled from 'styled-components';
import { mediaDown } from '@/assets/scss/breakpoints';

// =================================
// HEADER DA PÁGINA
// =================================

export const PageHeaderContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 20px 0;
  
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
    width: 100%;
    justify-content: flex-end;
  `)}
  
  button {
    white-space: nowrap;
  }
`;
