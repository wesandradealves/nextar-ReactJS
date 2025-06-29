import { ReactNode } from 'react';

/**
 * Configuração de um campo do formulário
 */
export interface FormFieldConfig {
  /** ID único do campo */
  id: string;
  /** Label do campo */
  label: string;
  /** Tipo do input */
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  /** Placeholder do campo */
  placeholder?: string;
  /** Se o campo é obrigatório */
  required?: boolean;
  /** Texto de ajuda */
  helpText?: string;
  /** Valor inicial do campo */
  defaultValue?: string;
  /** Validação customizada */
  validation?: {
    /** Expressão regular para validação */
    pattern?: RegExp;
    /** Valor mínimo (para números) */
    min?: number;
    /** Valor máximo (para números) */
    max?: number;
    /** Comprimento mínimo */
    minLength?: number;
    /** Comprimento máximo */
    maxLength?: number;
    /** Função de validação customizada */
    custom?: (value: string) => string | null;
  };
}

/**
 * Dados de um campo com valor e erro
 */
export interface FormFieldData {
  /** Valor atual do campo */
  value: string;
  /** Mensagem de erro, se houver */
  error?: string | undefined;
}

/**
 * Estado do formulário
 */
export interface FormState {
  /** Dados de todos os campos */
  fields: Record<string, FormFieldData>;
  /** Se o formulário está sendo submetido */
  isSubmitting: boolean;
  /** Se o formulário é válido */
  isValid: boolean;
  /** Se o formulário foi modificado */
  isDirty: boolean;
}

/**
 * Props do FormContainer
 */
export interface FormContainerProps {
  /** Configurações dos campos */
  fields: FormFieldConfig[];
  /** Callback quando o formulário é submetido */
  onSubmit: (data: Record<string, string>) => void | Promise<void>;
  /** Estado inicial dos campos */
  initialValues?: Record<string, string>;
  /** Se deve validar em tempo real */
  validateOnChange?: boolean;
  /** Se deve validar quando o campo perde o foco */
  validateOnBlur?: boolean;
  /** Texto do botão de submit */
  submitText?: string;
  /** Se o botão de submit deve estar habilitado */
  submitDisabled?: boolean;
  /** Texto do botão de reset */
  resetText?: string;
  /** Se deve mostrar o botão de reset */
  showReset?: boolean;
  /** Callback quando o formulário é resetado */
  onReset?: () => void;
  /** Callback quando há mudanças no formulário */
  onChange?: (state: FormState) => void;
  /** Conteúdo adicional a ser renderizado */
  children?: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Props dos styled components
 */
export interface StyledFormContainerProps {
  /** Se o formulário está sendo submetido */
  $isSubmitting?: boolean;
}

export interface StyledFormActionsProps {
  /** Se deve centralizar os botões */
  $centered?: boolean;
}
