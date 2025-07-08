"use client";

import { ClipLoader, BeatLoader, PulseLoader, RingLoader } from 'react-spinners';
import { SpinnerContainer } from './styles';
import type { SpinnerProps } from './types';

/**
 * Componente atômico Spinner modernizado
 * Exibe um indicador de carregamento animado usando react-spinners
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
 * <Spinner size="large" color="#667eea" variant="dots" />
 * 
 * // Spinner de pulso
 * <Spinner variant="pulse" color="#10b981" />
 * ```
 */
export const Spinner = ({
  size = 'medium',
  color = '#667eea',
  overlay = false,
  className,
  visible = true,
  variant = 'circle'
}: SpinnerProps) => {
  if (!visible) return null;

  const sizeMap = {
    small: { circle: 20, dots: 8, pulse: 12, ring: 24 },
    medium: { circle: 32, dots: 12, pulse: 16, ring: 40 },
    large: { circle: 48, dots: 16, pulse: 20, ring: 60 }
  };

  const currentSize = sizeMap[size][variant];

  const renderSpinner = () => {
    const commonProps = { color, size: currentSize };

    switch (variant) {
      case 'dots':
        return <BeatLoader {...commonProps} />;
      case 'pulse':
        return <PulseLoader {...commonProps} />;
      case 'ring':
        return <RingLoader {...commonProps} />;
      case 'circle':
      default:
        return <ClipLoader {...commonProps} />;
    }
  };

  return (
    <SpinnerContainer 
      $overlay={overlay}
      className={`flex items-center justify-center ${overlay 
        ? 'fixed inset-0 bg-black/50 z-50' 
        : ''} ${className || ''}`}
    >
      {renderSpinner()}
    </SpinnerContainer>
  );
}

export default Spinner;
