import styled from 'styled-components';
import Link from 'next/link';

export const NavigationContainer = styled.nav<{ $isMobile?: boolean; $isOpen?: boolean }>`
  ${({ $isMobile, $isOpen }) => $isMobile && `
    display: ${$isOpen ? 'block' : 'none'};
    transition: all 0.3s ease;
  `}
`;

export const NavList = styled.ul<{ $isMobile?: boolean }>``;

export const NavItem = styled.li<{ $isMobile?: boolean }>``;

export const NavLink = styled(Link)<{ $active?: boolean; $isMobile?: boolean }>`
  ${({ $active, $isMobile }) => $active && $isMobile && `
    border-left: 4px solid #0369a1;
  `}
`;

export const NavIcon = styled.span``;

export const NavLabel = styled.span``;
