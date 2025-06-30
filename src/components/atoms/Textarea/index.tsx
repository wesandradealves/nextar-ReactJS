import React from 'react';
import { TextareaContainer, StyledTextarea, HelperText, CharacterCount } from './styles';
import type { TextareaProps } from './types';

/**
 * Componente atômico Textarea
 * Campo de texto multilinha reutilizável
 * Segue padrão Atomic Design - Atom
 * 
 * @example
 * ```tsx
 * <Textarea
 *   value={description}
 *   onChange={setDescription}
 *   placeholder="Digite a descrição"
 *   rows={4}
 *   maxLength={500}
 * />
 * ```
 */
export default function Textarea({
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  rows = 3,
  className,
  id,
  name,
  helperText,
  error = false,
  maxLength
}: TextareaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const showCharacterCount = maxLength && maxLength > 0;
  const currentLength = value.length;

  return (
    <TextareaContainer className={className}>
      <StyledTextarea
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        $error={error}
        $disabled={disabled}
      />
      
      {(helperText || showCharacterCount) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {helperText && (
            <HelperText $error={error}>
              {helperText}
            </HelperText>
          )}
          
          {showCharacterCount && (
            <CharacterCount>
              {currentLength}/{maxLength}
            </CharacterCount>
          )}
        </div>
      )}
    </TextareaContainer>
  );
}
