/**
 * Tipos para o componente FormField
 */

import { InputProps } from '@/components/atoms/Input/types';

export interface FormFieldProps extends Omit<InputProps, 'id'> {
  /** ID único do campo */
  id: string;
  /** Label do campo */
  label: string;
  /** Mensagem de erro */
  error?: string;
  /** Se o campo é obrigatório (adiciona * no label) */
  required?: boolean;
  /** Texto de ajuda abaixo do campo */
  helpText?: string;
  /** Classes CSS adicionais para o container */
  className?: string;
}
