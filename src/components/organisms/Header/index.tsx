"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Logo } from '@/components/atoms';
import { SearchBox, UserCard } from '@/components/molecules';
import {
  HeaderContainer,
  LeftSection,
  Navigation,
  NavLink,
  RightSection,
  SearchSection,
  UserSection,
  UserMenu,
  UserMenuButton,
  UserMenuDropdown,
  MenuItem,
  MobileMenuButton,
  MenuIcon,
  ChevronDownIcon
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
  isOnline = true,
  isLoggingOut = false,
  onLogout,
  onProfileClick,
  className
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSearch = (value: string) => {
    console.log('Buscando:', value);
    // Aqui seria implementada a lógica de busca global
  };
  
  const handleProfileClick = () => {
    setIsMenuOpen(false);
    onProfileClick?.();
  };
  
  const handleLogout = () => {
    if (!isLoggingOut) {
      setIsMenuOpen(false);
      onLogout?.();
    }
  };
  
  return (
    <HeaderContainer 
      className={`${className || ''} ${isLoggingOut ? 'logging-out' : ''}`.trim()}
    >
      <LeftSection>
        <Logo variant="header" size="small" />
        
        <Navigation>
          <NavLink href="/dashboard" $active>
            Dashboard
          </NavLink>
          <NavLink href="/chamados">
            Chamados
          </NavLink>
          <NavLink href="/equipamentos">
            Equipamentos
          </NavLink>
          <NavLink href="/usuarios">
            Usuários
          </NavLink>
        </Navigation>
      </LeftSection>
      
      <RightSection>
        <SearchSection>
          <SearchBox
            value={searchTerm}
            placeholder="Buscar chamados, equipamentos..."
            onChange={setSearchTerm}
            onSearch={handleSearch}
            disabled={isLoggingOut}
          />
        </SearchSection>
        
        <UserSection>
          <UserMenu ref={menuRef}>
            <UserMenuButton 
              onClick={() => !isLoggingOut && setIsMenuOpen(!isMenuOpen)}
              disabled={isLoggingOut}
            >
              <UserCard
                name={userName}
                profile={userProfile}
                isOnline={isOnline && !isLoggingOut}
                size="small"
              />
              <ChevronDownIcon />
            </UserMenuButton>
            
            <UserMenuDropdown $isOpen={isMenuOpen && !isLoggingOut}>
              <MenuItem onClick={handleProfileClick} disabled={isLoggingOut}>
                Meu Perfil
              </MenuItem>
              <MenuItem onClick={() => setIsMenuOpen(false)} disabled={isLoggingOut}>
                Configurações
              </MenuItem>
              <MenuItem onClick={() => setIsMenuOpen(false)} disabled={isLoggingOut}>
                Ajuda
              </MenuItem>
              <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? '🔄 Saindo...' : 'Sair'}
              </MenuItem>
            </UserMenuDropdown>
          </UserMenu>
        </UserSection>
        
        <MobileMenuButton>
          <MenuIcon />
        </MobileMenuButton>
      </RightSection>
    </HeaderContainer>
  );
};
