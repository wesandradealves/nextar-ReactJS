"use client";

import React, { useState, useRef, useEffect } from 'react';
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
  MenuItem,
  MobileMenuButton,
  MenuIcon
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
  
  // Fecha menu mobile ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
  
  const handleMobileMenuToggle = () => {
    if (!isLoggingOut) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };
  
  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    <>
      <HeaderContainer 
        className={`bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50 h-[70px] ${className || ''} ${isLoggingOut ? 'logging-out' : ''}`.trim()}
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
                  className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg min-w-[200px] z-[1001]"
                >
                  <MenuItem 
                    onClick={handleProfileClick} 
                    disabled={isLoggingOut}
                    className="w-full py-3 px-4 text-left border-none bg-transparent text-sm transition-colors duration-200 border-b border-slate-100 rounded-t-lg hover:bg-slate-50"
                  >
                    Meu Perfil
                  </MenuItem>
                  <MenuItem 
                    onClick={handleLogout} 
                    disabled={isLoggingOut}
                    className="w-full py-3 px-4 text-left border-none bg-transparent text-sm transition-colors duration-200 rounded-b-lg hover:bg-slate-50"
                  >
                    Sair
                  </MenuItem>
                </UserMenuDropdown>
              </UserMenu>
            </UserSection>
            
            <MobileMenuButton 
              onClick={handleMobileMenuToggle}
              disabled={isLoggingOut}
              $isOpen={isMobileMenuOpen}
              className="hidden md:flex items-center justify-center bg-transparent border-none p-2 rounded-md transition-all duration-200 hover:bg-slate-100"
            >
              <MenuIcon className="block w-5 h-5 relative" />
            </MobileMenuButton>
          </RightSection>
        </HeaderContentWrapper>
      </HeaderContainer>
      
      {/* Navigation Mobile */}
      <Navigation
        items={navigationItems}
        userProfile={userProfile}
        isMobile={true}
        isOpen={isMobileMenuOpen}
        onItemClick={handleMobileNavClick}
      />
    </>
  );
};

export default Header;
