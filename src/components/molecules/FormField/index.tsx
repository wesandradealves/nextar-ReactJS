"use client";

import React from 'react';
import { Input } from '@/components/atoms';
import { FormFieldContainer, Label, ErrorMessage, HelpText } from './styles';
import type { FormFieldProps } from './types';

/**
 * Componente molecular FormField
 * Combina Label + Input + ErrorMessage + HelpText
 * Segue padrão Atomic Design - Molecule
 * 
 * @example
 * ```tsx
 * // Campo básico
 * <FormField
 *   id="email"
 *   label="Email"
 *   type="email"
 *   placeholder="seu@email.com"
 * />
 * 
 * // Campo com erro
 * <FormField
 *   id="password"
 *   label="Senha"
 *   type="password"
 *   required
 *   error="Senha deve ter pelo menos 8 caracteres"
 * />
 * 
 * // Campo com ajuda
 * <FormField
 *   id="phone"
 *   label="Telefone"
 *   type="tel"
 *   helpText="Formato: (11) 99999-9999"
 * />
 * ```
 */
export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(({
  id,
  label,
  error,
  required = false,
  helpText,
  className,
  ...inputProps
}, ref) => {
  return (
    <FormFieldContainer className={className}>
      <Label htmlFor={id} $required={required}>
        {label}
      </Label>
      
      <Input
        ref={ref}
        id={id}
        name={id}
        hasError={!!error}
        required={required}
        {...inputProps}
      />
      
      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}
      
      {!error && helpText && (
        <HelpText>{helpText}</HelpText>
      )}
    </FormFieldContainer>
  );
});

FormField.displayName = 'FormField';
