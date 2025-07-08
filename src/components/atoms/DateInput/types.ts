/**
 * Props para o componente DateInput
 */
export interface DateInputProps {
  /** Valor da data em formato ISO (yyyy-mm-dd) ou Date */
  value?: string | Date;
  /** Função chamada quando a data muda */
  onChange?: (value: string) => void;
  /** Placeholder do input */
  placeholder?: string;
  /** Se o input está desabilitado */
  disabled?: boolean;
  /** Se o input é obrigatório */
  required?: boolean;
  /** Data mínima permitida */
  min?: string;
  /** Data máxima permitida */
  max?: string;
  /** Se tem erro de validação */
  hasError?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}
