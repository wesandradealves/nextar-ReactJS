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
      className={className}
      $hasError={hasError}
      {...props}
    >
      {placeholder && (
        <option value="" disabled={!props.value && !props.defaultValue}>
          {placeholder}
        </option>
      )}
      
      {/* Renderizar opções via props */}
      {options.map((option) => (
        <option 
          key={option.value} 
          value={option.value}
          disabled={option.disabled}
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
