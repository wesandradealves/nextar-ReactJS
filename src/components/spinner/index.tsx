"use client";

import { SpinnerContainer, SpinnerWheel } from './styles';
import type { SpinnerProps } from './types';

/**
 * Componente atômico Spinner
 * Exibe um indicador de carregamento animado
 * Segue padrão Atomic Design
 * 
 * @example
 * ```tsx
 * // Spinner básico
 * <Spinner />
 * 
 * // Spinner com overlay
 * <Spinner overlay visible />
 * 
 * // Spinner customizado
 * <Spinner size="large" color="#ff0000" />
 * ```
 */
export default function Spinner({
  size = 'medium',
  color = '#667eea',
  overlay = false,
  className,
  visible = true
}: SpinnerProps) {
  if (!visible) return null;

  return (
    <SpinnerContainer 
      className={className}
      $overlay={overlay}
    >
      <SpinnerWheel 
        $size={size}
        $color={color}
      />
    </SpinnerContainer>
  );
}
