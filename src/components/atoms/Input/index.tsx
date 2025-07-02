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
      className={`
        w-full py-3 px-4 
        border-2 rounded-lg text-base
        ${hasError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}
        ${props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed opacity-60' : 'bg-white dark:bg-gray-800'}
        ${props.readOnly ? 'bg-slate-50 cursor-default' : ''}
        focus:outline-none focus:ring-2 focus:ring-opacity-50 
        ${hasError ? 'focus:ring-red-300 focus:border-red-500' : 'focus:ring-blue-300 focus:border-blue-500'}
        placeholder:text-gray-400
        transition-all duration-200 shadow-sm
        valid:not-placeholder-shown:${hasError ? 'border-red-500' : 'border-green-500'}
        invalid:not-placeholder-shown:border-red-500
        ${type === 'search' ? 'pr-10' : ''}
        ${className || ''}
      `}
      $hasError={hasError}
      {...props}
    />
  );
});

Input.displayName = 'Input';
