"use client";

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
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
export const Logo = ({
  variant = 'default',
  size = 'medium',
  className,
  src = '/logo.png',
  alt = 'NextAR - Sistema de Manutenção da Antártica'
}: LogoProps) => {
  // Size classes
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-20 h-20',
    large: 'w-32 h-32'
  };
  
  // Variant-specific classes
  const variantClasses = {
    default: '',
    header: 'mr-4',
    login: 'mx-auto mb-6 filter drop-shadow'
  };
  
  return (
    <LogoContainer 
      className={`
        flex items-center justify-center
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className || ''}
      `}
      $variant={variant}
      $size={size}
    >
      <LazyLoadImage
        src={src}
        alt={alt}
        effect="blur"
        threshold={100}
        className="w-full h-full object-contain rounded-lg"
      />
    </LogoContainer>
  );
};
