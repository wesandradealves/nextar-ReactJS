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
        className={`${className || ''} ${isLoggingOut ? 'logging-out' : ''}`.trim()}
      >
        <HeaderContentWrapper>
          <LeftSection>
            <Logo variant="header" size="small" />
            
            {/* Navigation Desktop */}
            <Navigation
              items={navigationItems}
              userProfile={userProfile}
              isMobile={false}
            />
          </LeftSection>
          
          <RightSection>
            <UserSection>
              <UserMenu ref={userMenuRef}>
                <UserMenuButton 
                  onClick={() => !isLoggingOut && setIsUserMenuOpen(!isUserMenuOpen)}
                  disabled={isLoggingOut}
                >
                  <UserCard
                    name={userName}
                    profile={userProfile}
                    size="small"
                  />
                </UserMenuButton>
                
                <UserMenuDropdown $isOpen={isUserMenuOpen && !isLoggingOut}>
                  <MenuItem onClick={handleProfileClick} disabled={isLoggingOut}>
                    Meu Perfil
                  </MenuItem>
                  <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
                    Sair
                  </MenuItem>
                </UserMenuDropdown>
              </UserMenu>
            </UserSection>
            
            <MobileMenuButton 
              onClick={handleMobileMenuToggle}
              disabled={isLoggingOut}
              $isOpen={isMobileMenuOpen}
            >
              <MenuIcon />
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
