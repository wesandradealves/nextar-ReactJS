"use client";

import { BadgeElement } from './styles';
import type { BadgeProps } from './types';

/**
 * Componente atômico Badge
 * Tag/etiqueta para status, categorias e indicadores
 * Segue padrão Atomic Design
 * 
 * @example
 * ```tsx
 * // Badge básico
 * <Badge>Novo</Badge>
 * 
 * // Badge de status
 * <Badge variant="success">Concluído</Badge>
 * 
 * // Badge ponto
 * <Badge variant="danger" dot />
 * ```
 */
export const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  dot = false,
  className,
  onClick
}: BadgeProps) => {
  return (
    <BadgeElement
      className={className}
      onClick={onClick}
      $variant={variant}
      $size={size}
      $dot={dot}
      $clickable={!!onClick}
    >
      {!dot && children}
    </BadgeElement>
  );
};
