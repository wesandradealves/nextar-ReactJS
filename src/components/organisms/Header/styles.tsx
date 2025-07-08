import styled from 'styled-components';
import { mediaDown } from '@/assets/scss/breakpoints';

export const HeaderContainer = styled.header`
  transition: all 0.3s ease;
  
  &.logging-out {
    opacity: 0.8;
    pointer-events: none;
  }
`;

export const HeaderContentWrapper = styled.div``;

export const LeftSection = styled.div``;

export const RightSection = styled.div``;

export const SearchSection = styled.div`
  ${mediaDown.lg(`
    display: none;
  `)}
`;

export const UserSection = styled.div``;

export const UserMenu = styled.div`
  position: relative;
`;

export const UserMenuButton = styled.button<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
`;

export const UserMenuDropdown = styled.div<{ $isOpen: boolean }>`
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transform: ${({ $isOpen }) => $isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

export const MenuItem = styled.button<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
`;

export const MobileMenuButton = styled.button<{ disabled?: boolean; $isOpen?: boolean }>`
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  color: ${({ $isOpen }) => $isOpen ? '#667eea' : '#64748b'};
`;

export const MenuIcon = styled.span`
  &::before {
    content: '☰';
    font-size: 1.2rem;
  }
`;

export const ChevronDownIcon = styled.span<{ $isOpen?: boolean }>`
  transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.2s ease;
  
  &::before {
    content: '▼';
    font-size: 0.75rem;
    color: #9ca3af;
  }
`;