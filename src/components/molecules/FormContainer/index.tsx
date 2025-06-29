import React, { useState, useCallback, useEffect, FormEvent } from 'react';
import { FormField } from '../FormField';
import { Button } from '../../atoms/Button';
import { FormContainerProps, FormState, FormFieldData, FormFieldConfig } from './types';
import {
  StyledFormContainer,
  StyledFormFields,
  StyledFormActions,
  StyledFormContent,
  StyledValidationWrapper,
  StyledValidationProgress
} from './styles';

/**
 * Valida um campo específico
 */
const validateField = (config: FormFieldConfig, value: string): string | undefined => {
  // Campo obrigatório
  if (config.required && !value.trim()) {
    return `${config.label} é obrigatório`;
  }

  // Se não há valor e não é obrigatório, é válido
  if (!value.trim()) {
    return undefined;
  }

  const validation = config.validation;
  if (!validation) return undefined;

  // Validação de padrão (regex)
  if (validation.pattern && !validation.pattern.test(value)) {
    return `${config.label} tem formato inválido`;
  }

  // Validação de comprimento
  if (validation.minLength && value.length < validation.minLength) {
    return `${config.label} deve ter pelo menos ${validation.minLength} caracteres`;
  }

  if (validation.maxLength && value.length > validation.maxLength) {
    return `${config.label} deve ter no máximo ${validation.maxLength} caracteres`;
  }

  // Validação numérica
  if (config.type === 'number') {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return `${config.label} deve ser um número válido`;
    }

    if (validation.min !== undefined && numValue < validation.min) {
      return `${config.label} deve ser pelo menos ${validation.min}`;
    }

    if (validation.max !== undefined && numValue > validation.max) {
      return `${config.label} deve ser no máximo ${validation.max}`;
    }
  }

  // Validação customizada
  if (validation.custom) {
    const customResult = validation.custom(value);
    return customResult || undefined;
  }

  return undefined;
};

/**
 * Container de formulário com validação automática
 * Permite agrupar múltiplos FormFields com validação centralizada
 * 
 * @example
 * ```tsx
 * const fields = [
 *   {
 *     id: 'name',
 *     label: 'Nome',
 *     type: 'text',
 *     required: true,
 *     validation: { minLength: 2 }
 *   },
 *   {
 *     id: 'email',
 *     label: 'E-mail',
 *     type: 'email',
 *     required: true,
 *     validation: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
 *   }
 * ];
 * 
 * <FormContainer
 *   fields={fields}
 *   onSubmit={(data) => console.log(data)}
 *   submitText="Cadastrar"
 *   validateOnChange
 * />
 * ```
 */
export default function FormContainer({
  fields,
  onSubmit,
  initialValues = {},
  validateOnChange = false,
  validateOnBlur = true,
  submitText = 'Enviar',
  submitDisabled = false,
  resetText = 'Limpar',
  showReset = false,
  onReset,
  onChange,
  children,
  className
}: FormContainerProps) {
  // Estado do formulário
  const [formState, setFormState] = useState<FormState>(() => {
    const initialFields: Record<string, FormFieldData> = {};
    
    fields.forEach(field => {
      initialFields[field.id] = {
        value: initialValues[field.id] || field.defaultValue || '',
        error: undefined
      };
    });

    return {
      fields: initialFields,
      isSubmitting: false,
      isValid: false,
      isDirty: false
    };
  });

  /**
   * Valida todos os campos
   */
  const validateForm = useCallback((): boolean => {
    const newFields = { ...formState.fields };
    let isValid = true;

    fields.forEach(fieldConfig => {
      const fieldData = newFields[fieldConfig.id];
      const error = validateField(fieldConfig, fieldData.value);
      
      newFields[fieldConfig.id] = {
        ...fieldData,
        error
      };

      if (error) {
        isValid = false;
      }
    });

    setFormState(prev => ({
      ...prev,
      fields: newFields,
      isValid
    }));

    return isValid;
  }, [fields, formState.fields]);

  /**
   * Valida um campo específico
   */
  const validateSingleField = useCallback((fieldId: string): void => {
    const fieldConfig = fields.find(f => f.id === fieldId);
    if (!fieldConfig) return;

    const fieldData = formState.fields[fieldId];
    const error = validateField(fieldConfig, fieldData.value);

    setFormState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldId]: {
          ...fieldData,
          error
        }
      }
    }));
  }, [fields, formState.fields]);

  /**
   * Manipula mudança de valor de campo
   */
  const handleFieldChange = useCallback((fieldId: string, value: string): void => {
    setFormState(prev => {
      const newState = {
        ...prev,
        fields: {
          ...prev.fields,
          [fieldId]: {
            ...prev.fields[fieldId],
            value
          }
        },
        isDirty: true
      };

      // Validação em tempo real se habilitada
      if (validateOnChange) {
        const fieldConfig = fields.find(f => f.id === fieldId);
        if (fieldConfig) {
          const error = validateField(fieldConfig, value);
          newState.fields[fieldId].error = error;
        }
      }

      return newState;
    });
  }, [fields, validateOnChange]);

  /**
   * Manipula blur de campo
   */
  const handleFieldBlur = useCallback((fieldId: string): void => {
    if (validateOnBlur) {
      validateSingleField(fieldId);
    }
  }, [validateOnBlur, validateSingleField]);

  /**
   * Manipula submit do formulário
   */
  const handleSubmit = useCallback(async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    // Valida o formulário
    const isValid = validateForm();
    if (!isValid) return;

    // Prepara os dados
    const data: Record<string, string> = {};
    Object.entries(formState.fields).forEach(([key, field]) => {
      data[key] = field.value;
    });

    // Submete
    setFormState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      await onSubmit(data);
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formState.fields, onSubmit, validateForm]);

  /**
   * Manipula reset do formulário
   */
  const handleReset = useCallback((): void => {
    const resetFields: Record<string, FormFieldData> = {};
    
    fields.forEach(field => {
      resetFields[field.id] = {
        value: initialValues[field.id] || field.defaultValue || '',
        error: undefined
      };
    });

    setFormState({
      fields: resetFields,
      isSubmitting: false,
      isValid: false,
      isDirty: false
    });

    onReset?.();
  }, [fields, initialValues, onReset]);

  /**
   * Atualiza isValid quando os campos mudam
   */
  useEffect(() => {
    const isValid = fields.every(fieldConfig => {
      const fieldData = formState.fields[fieldConfig.id];
      return !validateField(fieldConfig, fieldData.value);
    });

    setFormState(prev => ({ ...prev, isValid }));
  }, [fields, formState.fields]);

  /**
   * Notifica mudanças para o componente pai
   */
  useEffect(() => {
    onChange?.(formState);
  }, [formState, onChange]);

  /**
   * Calcula progresso de validação
   */
  const validationProgress = React.useMemo(() => {
    const totalFields = fields.length;
    const validFields = fields.filter(fieldConfig => {
      const fieldData = formState.fields[fieldConfig.id];
      return !validateField(fieldConfig, fieldData.value);
    }).length;

    return totalFields > 0 ? (validFields / totalFields) * 100 : 0;
  }, [fields, formState.fields]);

  return (
    <StyledFormContainer
      $isSubmitting={formState.isSubmitting}
      onSubmit={handleSubmit}
      className={className}
    >
      <StyledValidationProgress style={{ '--progress': `${validationProgress}%` } as React.CSSProperties} />
      
      <StyledFormFields>
        {fields.map(fieldConfig => (
          <StyledValidationWrapper
            key={fieldConfig.id}
            className={formState.fields[fieldConfig.id]?.error ? 'field-error' : ''}
          >
            <FormField
              id={fieldConfig.id}
              label={fieldConfig.label}
              type={fieldConfig.type}
              placeholder={fieldConfig.placeholder}
              required={fieldConfig.required}
              helpText={fieldConfig.helpText}
              value={formState.fields[fieldConfig.id]?.value || ''}
              error={formState.fields[fieldConfig.id]?.error}
              onChange={(event) => handleFieldChange(fieldConfig.id, event.target.value)}
              onBlur={() => handleFieldBlur(fieldConfig.id)}
            />
          </StyledValidationWrapper>
        ))}
      </StyledFormFields>

      {children && (
        <StyledFormContent>
          {children}
        </StyledFormContent>
      )}

      <StyledFormActions $centered={showReset}>
        {showReset && (
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={formState.isSubmitting || !formState.isDirty}
          >
            {resetText}
          </Button>
        )}
        
        <Button
          type="submit"
          variant="primary"
          className='w-full'
          disabled={submitDisabled || formState.isSubmitting || !formState.isValid}
          loading={formState.isSubmitting}
        >
          {submitText}
        </Button>
      </StyledFormActions>
    </StyledFormContainer>
  );
}
