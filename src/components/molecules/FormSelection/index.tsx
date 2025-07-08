import React from 'react';
import {
  SelectionContainer,
  SelectionOption,
  RadioContainer,
  CustomRadio,
  OptionLabel,
  OptionDescription
} from './styles';
import { FormSelectionProps } from './types';

/**
 * Componente de seleção padronizado para formulários
 * 
 * @version 2.0.1
 * @description
 * Componente reutilizável para seleções em formulários:
 * - Seleção única ou múltipla
 * - Estilos consistentes com a aplicação
 * - Suporte a ícones e descrições
 * - Estados visuais (hover, focus, disabled)
 * - Acessibilidade (keyboard navigation)
 * 
 * @example
 * ```tsx
 * <FormSelection
 *   options={[
 *     { id: 'opt1', label: 'Opção 1', description: 'Descrição', color: '#3b82f6' },
 *     { id: 'opt2', label: 'Opção 2', color: '#10b981' }
 *   ]}
 *   value={selectedValue}
 *   onChange={setSelectedValue}
 * />
 * ```
 */
export const FormSelection = ({
  options,
  value,
  onChange,
  size = 'medium',
  multiple = false,
  values = [],
  onMultipleChange,
  className,
  showIndicator = true,
  disabled = false
}: FormSelectionProps) => {
  const handleOptionClick = (optionId: string, itemDisabled?: boolean) => {
    if (disabled || itemDisabled) return;

    if (multiple && onMultipleChange) {
      const newValues = values.includes(optionId)
        ? values.filter(v => v !== optionId)
        : [...values, optionId];
      onMultipleChange(newValues);
    } else {
      onChange(optionId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, optionId: string, itemDisabled?: boolean) => {
    if (disabled || itemDisabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionClick(optionId, itemDisabled);
    }
  };

  const isSelected = (optionId: string) => {
    return multiple ? values.includes(optionId) : value === optionId;
  };

  // Helper para determinar padding com base no tamanho
  const getPadding = (optionSize: 'small' | 'medium' | 'large') => {
    switch (optionSize) {
      case 'small': return 'py-3 px-4';
      case 'large': return 'py-5 px-6';
      default: return 'p-4'; // medium
    }
  };

  return (
    <SelectionContainer 
      className={`flex flex-col gap-2 ${disabled ? 'opacity-70' : ''} ${className || ''}`}
    >
      {options.map((option) => {
        const selected = isSelected(option.id);
        const optionColor = option.color || '#3b82f6';
        const isDisabled = disabled || option.disabled;
        
        return (
          <SelectionOption
            key={option.id}
            $selected={selected}
            $color={optionColor}
            $size={size}
            onClick={() => handleOptionClick(option.id, option.disabled)}
            onKeyDown={(e) => handleKeyDown(e, option.id, option.disabled)}
            tabIndex={isDisabled ? -1 : 0}
            role={multiple ? 'checkbox' : 'radio'}
            aria-checked={selected}
            aria-disabled={isDisabled}
            className={`
              ${getPadding(size)}
              transition-all duration-200 
              rounded-lg border-2
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-opacity-[0.08]'}
              focus:outline-none focus:ring-2 focus:ring-offset-2
            `}
            style={{
              borderColor: selected ? optionColor : '#e5e7eb',
              backgroundColor: selected ? `${optionColor}08` : 'white',
              ...(selected && { boxShadow: `0 0 0 1px ${optionColor}10` }),
            }}
          >
            <RadioContainer className="flex items-center gap-3">
              {showIndicator && (
                <CustomRadio
                  $selected={selected}
                  $color={optionColor}
                  className={`w-4 h-4 flex-shrink-0 flex items-center justify-center transition-all ${multiple ? 'rounded' : 'rounded-full'}`}
                />
              )}
              
              <div className="flex-1">
                <OptionLabel className="font-semibold text-sm text-gray-900 mb-1">
                  {option.icon && (
                    <span className="mr-2">{option.icon}</span>
                  )}
                  {option.label}
                </OptionLabel>
                
                {option.description && (
                  <OptionDescription className="text-xs text-gray-500 leading-relaxed">
                    {option.description}
                  </OptionDescription>
                )}
              </div>
            </RadioContainer>
          </SelectionOption>
        );
      })}
    </SelectionContainer>
  );
};

export default FormSelection;