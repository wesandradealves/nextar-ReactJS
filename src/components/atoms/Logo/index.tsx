"use client";

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { LogoContainer } from './styles';
import type { LogoProps } from './types';

/**
 * Componente atômico Logo
 * Exibe o logotipo da aplicação com carregamento lazy
 * Segue padrão Atomic Design
 * 
 * @example
 * ```tsx
 * // Logo no header
 * <Logo variant="header" size="small" />
 * 
 * // Logo na página de login
 * <Logo variant="login" size="large" />
 * ```
 */
export default function Logo({
  variant = 'default',
  size = 'medium',
  className,
  src = '/logo.png',
  alt = 'NextAR - Sistema de Manutenção da Antártica'
}: LogoProps) {
  return (
    <LogoContainer 
      className={className}
      $variant={variant}
      $size={size}
    >
      <LazyLoadImage
        src={src}
        alt={alt}
        effect="blur"
        threshold={100}
      />
    </LogoContainer>
  );
}
