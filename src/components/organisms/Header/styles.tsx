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
  @media (max-width: 1024px) {
    display: none;
  }
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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
  
  &:hover {
    background: #f3f4f6;
  }
`;

export const UserMenuDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 50;
  
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

export const MenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 0.875rem;
  color: #374151;
  
  &:hover {
    background: #f3f4f6;
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
    color: #ef4444;
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
