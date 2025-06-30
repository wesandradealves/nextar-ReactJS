export interface TextareaProps {
  /** Valor do textarea */
  value: string;
  /** Callback quando valor muda */
  onChange: (value: string) => void;
  /** Placeholder do textarea */
  placeholder?: string;
  /** Se o textarea está desabilitado */
  disabled?: boolean;
  /** Se o textarea é obrigatório */
  required?: boolean;
  /** Número mínimo de linhas */
  rows?: number;
  /** Classes CSS adicionais */
  className?: string;
  /** ID do textarea */
  id?: string;
  /** Nome do textarea */
  name?: string;
  /** Texto de ajuda ou erro */
  helperText?: string;
  /** Se está em estado de erro */
  error?: boolean;
  /** Máximo de caracteres */
  maxLength?: number;
}
