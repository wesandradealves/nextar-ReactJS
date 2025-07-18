"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Squash as Hamburger } from 'hamburger-react';
import { Logo } from '@/components/atoms';
import { UserCard, Navigation } from '@/components/molecules';
import { navigationItems } from '@/data/navigation';
import {
  HeaderContainer,
  HeaderContentWrapper,
  LeftSection,
  RightSection,
  UserSection,
  UserMenu,
  UserMenuButton,
  UserMenuDropdown,
  MenuItem
} from './styles';
import type { HeaderProps } from './types';

/**
 * Componente organism Header
 * Combina Logo + Navigation + SearchBox + UserCard
 * Segue padrão Atomic Design - Organism
 * 
 * @example
 * ```tsx
 * <Header
 *   userName="João Silva"
 *   userEmail="joao@antartica.gov.br"
 *   userProfile={PerfilUsuario.PESQUISADOR}
 *   onLogout={handleLogout}
 * />
 * ```
 */
export const Header = ({
  userName,
  userProfile,
  isLoggingOut = false,
  onLogout,
  onProfileClick,
  className
}: HeaderProps) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Fecha o menu de usuário ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // UX melhorada para mobile menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element)?.closest('[data-hamburger]')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);
  
  const handleProfileClick = () => {
    setIsUserMenuOpen(false);
    onProfileClick?.();
  };
  
  const handleLogout = () => {
    if (!isLoggingOut) {
      setIsUserMenuOpen(false);
      onLogout?.();
    }
  };
  
  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    <>
      <HeaderContainer 
        className={`bg-white dark:bg-gray-800 shadow-sm border-b border-slate-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50 h-[70px] ${className || ''} ${isLoggingOut ? 'logging-out' : ''}`.trim()}
      >
        <HeaderContentWrapper className="flex items-center justify-between px-6 md:px-4 max-w-screen-xl mx-auto h-full">
          <LeftSection className="flex items-center gap-8 md:gap-4 flex-1">
            <Logo variant="header" size="small" />
            
            {/* Navigation Desktop */}
            <Navigation
              items={navigationItems}
              userProfile={userProfile}
              isMobile={false}
            />
          </LeftSection>
          
          <RightSection className="flex items-center gap-4 flex-shrink-0">
            <UserSection className="flex items-center">
              <UserMenu ref={userMenuRef} className="flex items-center relative">
                <UserMenuButton 
                  onClick={() => !isLoggingOut && setIsUserMenuOpen(!isUserMenuOpen)}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 bg-transparent border-none p-2 rounded-lg transition-all duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <UserCard
                    name={userName}
                    profile={userProfile}
                    size="small"
                  />
                </UserMenuButton>
                
                <UserMenuDropdown 
                  $isOpen={isUserMenuOpen && !isLoggingOut}
                  className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[200px] z-[70]"
                >
                  <MenuItem 
                    onClick={handleProfileClick} 
                    disabled={isLoggingOut}
                    className="w-full py-3 px-4 text-left border-none bg-transparent text-sm transition-colors duration-200 border-b border-slate-100 dark:border-gray-700 rounded-t-lg hover:bg-slate-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    Meu Perfil
                  </MenuItem>
                  <MenuItem 
                    onClick={handleLogout} 
                    disabled={isLoggingOut}
                    className="w-full py-3 px-4 text-left border-none bg-transparent text-sm transition-colors duration-200 rounded-b-lg hover:bg-slate-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    Sair
                  </MenuItem>
                </UserMenuDropdown>
              </UserMenu>
            </UserSection>
            
            <div 
              className="flex md:hidden items-center justify-center"
              data-hamburger
            >
              <Hamburger
                toggled={isMobileMenuOpen}
                toggle={setIsMobileMenuOpen}
                size={20}
                duration={0.8}
                distance="lg"
                color="currentColor"
                hideOutline={false}
                disabled={isLoggingOut}
              />
            </div>
          </RightSection>
        </HeaderContentWrapper>
      </HeaderContainer>
      
      {/* Navigation Mobile */}
      <div ref={mobileMenuRef}>
        <Navigation
          items={navigationItems}
          userProfile={userProfile}
          isMobile={true}
          isOpen={isMobileMenuOpen}
          onItemClick={handleMobileNavClick}
        />
      </div>
    </>
  );
};

export default Header;
