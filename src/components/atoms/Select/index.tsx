"use client";

import React from 'react';
import { SelectElement } from './styles';
import type { SelectProps } from './types';

/**
 * Componente atômico Select
 * Campo de seleção reutilizável com estados de validação
 * Segue padrão Atomic Design
 * 
 * @example
 * ```tsx
 * // Select básico com opções via children
 * <Select placeholder="Selecione uma opção">
 *   <option value="1">Opção 1</option>
 *   <option value="2">Opção 2</option>
 * </Select>
 * 
 * // Select com opções via props
 * <Select 
 *   placeholder="Selecione um status"
 *   options={[
 *     { value: 'ativo', label: 'Ativo' },
 *     { value: 'inativo', label: 'Inativo' }
 *   ]}
 * />
 * 
 * // Select com erro
 * <Select hasError placeholder="Campo obrigatório">
 *   <option value="">Selecione</option>
 *   <option value="1">Opção 1</option>
 * </Select>
 * ```
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  hasError = false,
  className,
  placeholder,
  options = [],
  children,
  ...props
}, ref) => {
  return (
    <SelectElement
      ref={ref}
      className={`
        w-full py-3 px-4 pr-10
        text-sm font-normal
        border-2 rounded-lg
        ${hasError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}
        ${props.disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 cursor-pointer'}
        hover:border-${hasError ? 'red-600' : 'gray-300 dark:border-gray-600'}
        focus:outline-none focus:ring-2 focus:ring-opacity-50 
        ${hasError ? 'focus:ring-red-300 focus:border-red-500' : 'focus:ring-blue-300 focus:border-blue-500'}
        transition-all duration-200 shadow-sm
        appearance-none
        ${props.value === '' ? 'text-gray-500 dark:text-gray-400' : ''}
        ${className || ''}
      `}
      $hasError={hasError}
      {...props}
    >
      {placeholder && (
        <option value="" disabled={!props.value && !props.defaultValue} className="text-gray-500 dark:text-gray-400">
          {placeholder}
        </option>
      )}
      
      {/* Renderizar opções via props */}
      {options.map((option) => (
        <option 
          key={option.value} 
          value={option.value}
          disabled={option.disabled}
          className={`
            py-2 px-3
            ${option.disabled ? 'text-gray-400' : 'text-gray-800 dark:text-gray-200'}
            disabled:text-gray-400
            checked:bg-blue-500 checked:text-white
          `}
        >
          {option.label}
        </option>
      ))}
      
      {/* Renderizar children (opções customizadas) */}
      {children}
    </SelectElement>
  );
});

Select.displayName = 'Select';
