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
        ? `fixed top-[70px] left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-[60] shadow-xl max-h-[calc(100vh-70px)] overflow-y-auto ${isOpen ? 'block' : 'hidden'}`
        : 'hidden md:flex md:flex-1 items-center gap-8'}`}
    >
      <NavList 
        $isMobile={isMobile} 
        className={`list-none md:justify-center m-0 p-0 w-full ${isMobile 
          ? 'flex flex-col divide-y divide-gray-100 dark:divide-gray-700' 
          : 'flex flex-row items-center gap-8'}`}
      >
        {visibleItems.map((item) => {
          const isActive = activePath === item.href || item.active;
          
          return (
            <StyledNavItem 
              key={item.href} 
              $isMobile={isMobile} 
              className={isMobile ? 'w-full' : ''}
            >
              <NavLink 
                href={item.href}
                $active={isActive}
                $isMobile={isMobile}
                onClick={() => handleItemClick(item)}
                className={`
                  flex items-center gap-3 transition-colors duration-200 w-full
                  ${isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}
                  ${isMobile 
                    ? 'py-4 px-6 text-base font-medium ' + (isActive ? 'border-l-4 border-indigo-500' : '') 
                    : 'py-2 px-3 text-sm rounded-md'}
                `}
              >
                {item.icon && (
                  <NavIcon className={`flex-shrink-0 flex items-center ${isMobile ? 'text-xl w-6' : 'text-lg'}`}>{item.icon}</NavIcon>
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
