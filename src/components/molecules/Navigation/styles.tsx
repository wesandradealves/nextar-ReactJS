import styled from 'styled-components';
import Link from 'next/link';
import { mediaDown } from '@/assets/scss/breakpoints';

export const NavigationContainer = styled.nav<{ $isMobile?: boolean; $isOpen?: boolean }>`
  ${({ $isMobile, $isOpen }) => $isMobile ? `
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 999;
    transform: translateY(${$isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
    padding: 16px 0;
    
    ${mediaDown.md(`
      display: block;
    `)}
    
    @media (min-width: 769px) {
      display: none;
    }
  ` : `
    display: flex;
    align-items: center;
    gap: 32px;
    
    ${mediaDown.md(`
      display: none;
    `)}
  `}
`;

export const NavList = styled.ul<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => $isMobile ? '0' : '32px'};
  flex-direction: ${({ $isMobile }) => $isMobile ? 'column' : 'row'};
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
`;

export const NavItem = styled.li<{ $isMobile?: boolean }>`
  ${({ $isMobile }) => $isMobile && `
    width: 100%;
    border-bottom: 1px solid #f1f5f9;
    
    &:last-child {
      border-bottom: none;
    }
  `}
`;

export const NavLink = styled(Link)<{ $active?: boolean; $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${({ $isMobile }) => $isMobile ? '16px 24px' : '8px 16px'};
  font-weight: 500;
  font-size: ${({ $isMobile }) => $isMobile ? '1rem' : '0.875rem'};
  color: ${({ $active }) => $active ? '#667eea' : '#64748b'};
  text-decoration: none;
  border-radius: ${({ $isMobile }) => $isMobile ? '0' : '6px'};
  transition: all 0.2s ease;
  width: ${({ $isMobile }) => $isMobile ? '100%' : 'auto'};
  
  &:hover {
    color: #667eea;
    background-color: ${({ $isMobile }) => $isMobile ? '#f8fafc' : '#f1f5f9'};
  }
  
  ${({ $active, $isMobile }) => $active && !$isMobile && `
    background-color: #ede9fe;
    color: #7c3aed;
  `}
  
  ${({ $active, $isMobile }) => $active && $isMobile && `
    background-color: #f0f9ff;
    color: #0369a1;
    border-left: 4px solid #0369a1;
  `}
`;

export const NavIcon = styled.span`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
`;

export const NavLabel = styled.span`
  white-space: nowrap;
`;
