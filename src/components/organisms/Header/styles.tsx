import styled from 'styled-components';

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: opacity 0.3s ease, transform 0.3s ease;
  
  /* Estado de logout - mantém visível mas com feedback visual */
  &.logging-out {
    opacity: 0.9;
    pointer-events: none;
    
    /* Sutis indicações visuais de que está em processo de logout */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, 
        #667eea 0%, 
        #764ba2 50%, 
        #667eea 100%
      );
      animation: logoutProgress 2s ease-in-out;
    }
  }
  
  @keyframes logoutProgress {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(0); }
  }
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLink = styled.a<{ $active?: boolean }>`
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  color: ${props => props.$active ? '#667eea' : '#6b7280'};
  font-weight: ${props => props.$active ? '600' : '500'};
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    color: #667eea;
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const SearchSection = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

export const UserSection = styled.div`
  position: relative;
`;

export const UserMenu = styled.div`
  position: relative;
`;

export const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #f3f4f6;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const UserMenuDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  margin-top: 8px;
`;

export const MenuItem = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background 0.2s ease;
  font-size: 0.875rem;
  color: ${props => props.disabled ? '#9ca3af' : '#374151'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    background: #f3f4f6;
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
    color: ${props => props.disabled ? '#9ca3af' : '#ef4444'};
    border-top: 1px solid #e5e7eb;
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    background: #f3f4f6;
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '16px', height: '16px' }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);