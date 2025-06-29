"use client";

import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { PerfilUsuario } from '@/utils/enums';
import {
  UserCardContainer,
  Avatar,
  OnlineIndicator,
  UserInfo,
  UserName,
  UserEmail,
  ProfileBadge
} from './styles';
import type { UserCardProps } from './types';

/**
 * Componente molecular UserCard
 * Combina Avatar + Nome + Perfil + Status
 * Segue padrão Atomic Design - Molecule
 * 
 * @example
 * ```tsx
 * // UserCard básico
 * <UserCard
 *   name="João Silva"
 *   email="joao@antartica.gov.br"
 *   profile={PerfilUsuario.TECNICO}
 * />
 * 
 * // UserCard clicável com status online
 * <UserCard
 *   name="Maria Santos"
 *   profile={PerfilUsuario.ADMINISTRADOR}
 *   isOnline={true}
 *   clickable
 *   onClick={() => console.log('Clicou no usuário')}
 * />
 * ```
 */
export const UserCard = ({
  name,
  email,
  profile,
  avatar,
  isOnline = false,
  size = 'medium',
  clickable = false,
  onClick,
  className
}: UserCardProps) => {
  // Gera iniciais do nome para o avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };
  
  // Define a cor do badge baseado no perfil
  const getProfileVariant = (profile: PerfilUsuario) => {
    switch (profile) {
      case PerfilUsuario.GESTAO:
        return 'danger' as const;
      case PerfilUsuario.AGENTE:
        return 'warning' as const;
      case PerfilUsuario.PESQUISADOR:
        return 'primary' as const;
      default:
        return 'default' as const;
    }
  };
  
  // Define o label do perfil
  const getProfileLabel = (profile: PerfilUsuario) => {
    switch (profile) {
      case PerfilUsuario.GESTAO:
        return 'Gestão';
      case PerfilUsuario.AGENTE:
        return 'Agente';
      case PerfilUsuario.PESQUISADOR:
        return 'Pesquisador';
      default:
        return profile;
    }
  };
  
  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };
  
  return (
    <UserCardContainer
      className={className}
      $size={size}
      $clickable={clickable}
      onClick={handleClick}
    >
      <Avatar $size={size}>
        {avatar ? (
          <LazyLoadImage
            src={avatar}
            alt={name}
            effect="blur"
            width="100%"
            height="100%"
            style={{ 
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        ) : (
          getInitials(name)
        )}
        {isOnline && <OnlineIndicator $size={size} />}
      </Avatar>
      
      <UserInfo>
        <UserName $size={size}>{name}</UserName>
        {email && (
          <UserEmail $size={size}>{email}</UserEmail>
        )}
      </UserInfo>
      
      <ProfileBadge
        variant={getProfileVariant(profile)}
        size={size === 'large' ? 'medium' : 'small'}
        $size={size}
      >
        {getProfileLabel(profile)}
      </ProfileBadge>
    </UserCardContainer>
  );
};
