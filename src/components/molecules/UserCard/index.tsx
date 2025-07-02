"use client";

import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { PerfilUsuario } from '@/utils/enums';
import {
  UserCardContainer,
  Avatar,
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
      className={`${className || ''} flex items-center 
        ${size === 'small' ? 'gap-2 p-2' : size === 'medium' ? 'gap-3 p-3' : 'gap-4 p-4'} 
        rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700
        ${clickable ? 'cursor-pointer hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 dark:hover:border-blue-400' : ''}
      `}
      $size={size}
      $clickable={clickable}
      onClick={handleClick}
    >
      <Avatar $size={size} className={`
        relative overflow-hidden rounded-full flex items-center justify-center
        bg-blue-500 dark:bg-blue-600 text-white font-semibold
        ${size === 'small' ? 'w-8 h-8 text-xs' : size === 'medium' ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base'}
      `}>
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
        {/* {isOnline && <OnlineIndicator $size={size} />} */}
      </Avatar>
      
      <UserInfo className="flex flex-col gap-0.5 flex-1 min-w-0">
        <UserName $size={size} className={`
          font-semibold text-gray-700 dark:text-gray-200 truncate
          ${size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-lg'}
        `}>
          {name}
        </UserName>
        {email && (
          <UserEmail $size={size} className={`
            text-gray-500 dark:text-gray-400 truncate
            ${size === 'small' ? 'text-xs' : 'text-sm'}
          `}>
            {email}
          </UserEmail>
        )}
      </UserInfo>
      
      <ProfileBadge
        variant={getProfileVariant(profile)}
        size={size === 'large' ? 'medium' : 'small'}
        $size={size}
        className={`
          ${size === 'small' ? 'text-xs px-1.5 py-0.5' : size === 'large' ? 'text-sm px-2 py-1' : ''}
        `}
      >
        {getProfileLabel(profile)}
      </ProfileBadge>
    </UserCardContainer>
  );
};
