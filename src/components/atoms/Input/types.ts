/**
 * Tipos para o componente Input
 */

export interface InputProps {
  /** Tipo do input HTML */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  /** Valor do input */
  value?: string;
  /** Valor padrão */
  defaultValue?: string;
  /** Placeholder */
  placeholder?: string;
  /** Se o input está desabilitado */
  disabled?: boolean;
  /** Se o input é obrigatório */
  required?: boolean;
  /** Se o input é somente leitura */
  readOnly?: boolean;
  /** Se o input tem erro */
  hasError?: boolean;
  /** Classes CSS adicionais */
  className?: string;
  /** ID do input */
  id?: string;
  /** Nome do input */
  name?: string;
  /** Função executada na mudança */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Função executada no foco */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Função executada na perda de foco */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Função executada ao pressionar uma tecla */
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Referência do input */
  ref?: React.Ref<HTMLInputElement>;
}
