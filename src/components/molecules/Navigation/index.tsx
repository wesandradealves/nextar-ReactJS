"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  NavigationContainer,
  NavList,
  NavItem as StyledNavItem,
  NavLink,
  NavIcon,
  NavLabel
} from './styles';
import type { NavigationProps, NavItem } from './types';

/**
 * Componente molecular Navigation
 * Menu de navegação reutilizável para desktop e mobile
 * Inclui controle de permissões por perfil
 * Segue padrão Atomic Design - Molecule
 * 
 * @example
 * ```tsx
 * <Navigation
 *   items={navItems}
 *   userProfile={PerfilUsuario.PESQUISADOR}
 *   isMobile={false}
 * />
 * ```
 */
export const Navigation = ({
  items,
  currentPath,
  userProfile,
  isMobile = false,
  isOpen = false,
  onItemClick,
  className
}: NavigationProps) => {
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  // Filtrar itens baseado nas permissões do usuário
  const visibleItems = items.filter(item => {
    if (!item.permissions || !userProfile) return true;
    return item.permissions.includes(userProfile);
  });

  const handleItemClick = (item: NavItem) => {
    onItemClick?.(item);
  };

  return (
    <NavigationContainer 
      $isMobile={isMobile} 
      $isOpen={isOpen}
      className={className}
    >
      <NavList $isMobile={isMobile}>
        {visibleItems.map((item) => {
          const isActive = activePath === item.href || item.active;
          
          return (
            <StyledNavItem key={item.href} $isMobile={isMobile}>
              <NavLink 
                href={item.href}
                $active={isActive}
                $isMobile={isMobile}
                onClick={() => handleItemClick(item)}
              >
                {item.icon && (
                  <NavIcon>{item.icon}</NavIcon>
                )}
                <NavLabel>{item.label}</NavLabel>
              </NavLink>
            </StyledNavItem>
          );
        })}
      </NavList>
    </NavigationContainer>
  );
};

export default Navigation;
