import React from 'react';
import {
  SelectionContainer,
  SelectionOption,
  RadioContainer,
  CustomRadio,
  OptionLabel,
  OptionDescription
} from '../Modal/formStyles';

/**
 * Opção de seleção
 */
export interface SelectionItem {
  /** ID único da opção */
  id: string;
  /** Label principal */
  label: string;
  /** Descrição opcional */
  description?: string;
  /** Cor da opção */
  color?: string;
  /** Se a opção está desabilitada */
  disabled?: boolean;
  /** Ícone ou emoji da opção */
  icon?: string;
}

/**
 * Props do FormSelection
 */
export interface FormSelectionProps {
  /** Lista de opções */
  options: SelectionItem[];
  /** Valor selecionado atual */
  value: string;
  /** Callback quando uma opção é selecionada */
  onChange: (value: string) => void;
  /** Tamanho das opções */
  size?: 'small' | 'medium' | 'large';
  /** Se permite múltipla seleção */
  multiple?: boolean;
  /** Valores selecionados (para múltipla seleção) */
  values?: string[];
  /** Callback para múltipla seleção */
  onMultipleChange?: (values: string[]) => void;
  /** Classes CSS adicionais */
  className?: string;
  /** Se deve mostrar radio/checkbox visual */
  showIndicator?: boolean;
}

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
export const FormSelection: React.FC<FormSelectionProps> = ({
  options,
  value,
  onChange,
  size = 'medium',
  multiple = false,
  values = [],
  onMultipleChange,
  className,
  showIndicator = true
}) => {
  const handleOptionClick = (optionId: string, disabled?: boolean) => {
    if (disabled) return;

    if (multiple && onMultipleChange) {
      const newValues = values.includes(optionId)
        ? values.filter(v => v !== optionId)
        : [...values, optionId];
      onMultipleChange(newValues);
    } else {
      onChange(optionId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, optionId: string, disabled?: boolean) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionClick(optionId, disabled);
    }
  };

  const isSelected = (optionId: string) => {
    return multiple ? values.includes(optionId) : value === optionId;
  };

  return (
    <SelectionContainer className={className}>
      {options.map((option) => (
        <SelectionOption
          key={option.id}
          $selected={isSelected(option.id)}
          $color={option.color}
          $size={size}
          onClick={() => handleOptionClick(option.id, option.disabled)}
          onKeyDown={(e) => handleKeyDown(e, option.id, option.disabled)}
          tabIndex={option.disabled ? -1 : 0}
          role={multiple ? 'checkbox' : 'radio'}
          aria-checked={isSelected(option.id)}
          aria-disabled={option.disabled}
          style={{
            opacity: option.disabled ? 0.5 : 1,
            cursor: option.disabled ? 'not-allowed' : 'pointer'
          }}
        >
          <RadioContainer>
            {showIndicator && (
              <CustomRadio
                $selected={isSelected(option.id)}
                $color={option.color}
                style={{
                  borderRadius: multiple ? '4px' : '50%'
                }}
              />
            )}
            
            <div style={{ flex: 1 }}>
              <OptionLabel>
                {option.icon && (
                  <span style={{ marginRight: '8px' }}>{option.icon}</span>
                )}
                {option.label}
              </OptionLabel>
              
              {option.description && (
                <OptionDescription>{option.description}</OptionDescription>
              )}
            </div>
          </RadioContainer>
        </SelectionOption>
      ))}
    </SelectionContainer>
  );
};

export default FormSelection;
