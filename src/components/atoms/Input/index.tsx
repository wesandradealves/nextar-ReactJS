"use client";

import React from 'react';
import { InputElement } from './styles';
import type { InputProps } from './types';

/**
 * Componente atômico Input
 * Campo de entrada reutilizável com estados de validação
 * Segue padrão Atomic Design
 * 
 * @example
 * ```tsx
 * // Input básico
 * <Input placeholder="Digite seu nome" />
 * 
 * // Input com erro
 * <Input hasError placeholder="Email inválido" />
 * 
 * // Input de busca
 * <Input type="search" placeholder="Buscar..." />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  hasError = false,
  className,
  ...props
}, ref) => {
  return (
    <InputElement
      ref={ref}
      type={type}
      className={className}
      $hasError={hasError}
      {...props}
    />
  );
});

Input.displayName = 'Input';
