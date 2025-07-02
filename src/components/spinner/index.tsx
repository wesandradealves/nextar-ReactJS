"use client";

import { SpinnerContainer, SpinnerElement } from './styles';
import type { SpinnerProps } from './types';

/**
 * Componente atômico Spinner
 * Exibe um indicador de carregamento animado
 * Segue padrão Atomic Design e híbrido Tailwind + styled-components
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
export const Spinner = ({
  size = 'medium',
  color = '#667eea',
  overlay = false,
  className,
  visible = true
}: SpinnerProps) => {
  if (!visible) return null;

  return (
    <SpinnerContainer 
      $overlay={overlay}
      className={className}
    >
      <SpinnerElement
        $size={size}
        $color={color}
        className="animate-spin"
      />
    </SpinnerContainer>
  );
}

// Exportação padrão para compatibilidade com código existente
export default Spinner;
