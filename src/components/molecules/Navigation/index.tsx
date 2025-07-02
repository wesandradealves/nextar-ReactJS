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
      className={`${className || ''} ${isMobile 
        ? 'fixed top-[70px] left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 shadow-lg transform transition-transform duration-300 ease-in-out ' + (isOpen ? 'translate-y-0' : '-translate-y-full') + ' py-4 md:block lg:hidden'
        : 'flex items-center gap-8 md:hidden lg:flex'}`}
    >
      <NavList 
        $isMobile={isMobile} 
        className={`list-none m-0 p-0 w-full ${isMobile 
          ? 'flex flex-col items-start gap-0 space-y-2' 
          : 'flex flex-row items-center gap-8 space-x-4 md:space-x-6 lg:space-x-8'}`}
      >
        {visibleItems.map((item) => {
          const isActive = activePath === item.href || item.active;
          
          return (
            <StyledNavItem 
              key={item.href} 
              $isMobile={isMobile} 
              className={`${isMobile 
                ? 'w-full border-b border-gray-100 dark:border-gray-700 last:border-b-0' 
                : ''}`}
            >
              <NavLink 
                href={item.href}
                $active={isActive}
                $isMobile={isMobile}
                onClick={() => handleItemClick(item)}
                className={`
                  flex items-center gap-2 transition-colors duration-200 w-full
                  ${isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}
                  ${isMobile 
                    ? 'py-4 px-6 text-base rounded-none ' + (isActive ? 'border-l-4 border-indigo-500' : '') 
                    : 'py-2 px-3 text-sm rounded-md'}
                `}
              >
                {item.icon && (
                  <NavIcon className="flex-shrink-0 text-lg flex items-center">{item.icon}</NavIcon>
                )}
                <NavLabel className="truncate whitespace-nowrap">{item.label}</NavLabel>
              </NavLink>
            </StyledNavItem>
          );
        })}
      </NavList>
    </NavigationContainer>
  );
};

export default Navigation;
