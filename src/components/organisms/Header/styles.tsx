import styled from 'styled-components';
import { mediaDown } from '@/assets/scss/breakpoints';

export const HeaderContainer = styled.header`
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  height: 70px;
  
  &.logging-out {
    opacity: 0.8;
    pointer-events: none;
  }
`;

export const HeaderContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  
  ${mediaDown.md(`
    padding: 12px 16px;
  `)}
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
  
  ${mediaDown.md(`
    gap: 16px;
  `)}
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 0 0 auto;
`;

export const SearchSection = styled.div`
  ${mediaDown.lg(`
    display: none;
  `)}
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
`;

export const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const UserMenuButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    background-color: #f8fafc;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;

export const UserMenuDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transform: ${({ $isOpen }) => $isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
  z-index: 1001;
`;

export const MenuItem = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  border: none;
  background: none;
  font-size: 0.875rem;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    background-color: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
    border-radius: 0 0 8px 8px;
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
`;

export const MobileMenuButton = styled.button<{ disabled?: boolean; $isOpen?: boolean }>`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  color: ${({ $isOpen }) => $isOpen ? '#667eea' : '#64748b'};
  
  &:hover:not(:disabled) {
    background-color: #f1f5f9;
    color: #667eea;
  }
  
  ${mediaDown.md(`
    display: flex;
    align-items: center;
    justify-content: center;
  `)}
`;

export const MenuIcon = styled.span`
  display: block;
  width: 20px;
  height: 20px;
  position: relative;
  
  &::before {
    content: '☰';
    font-size: 1.2rem;
  }
`;

export const ChevronDownIcon = styled.span<{ $isOpen?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  
  &::before {
    content: '▼';
    font-size: 0.75rem;
    color: #9ca3af;
  }
`;