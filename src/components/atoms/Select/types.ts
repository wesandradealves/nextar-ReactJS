/**
 * Tipos para o componente Select
 */

export interface SelectOption {
  /** Valor da opção */
  value: string;
  /** Texto exibido da opção */
  label: string;
  /** Se a opção está desabilitada */
  disabled?: boolean;
}

export interface SelectProps {
  /** Valor selecionado */
  value?: string;
  /** Valor padrão */
  defaultValue?: string;
  /** Placeholder quando nenhuma opção está selecionada */
  placeholder?: string;
  /** Se o select está desabilitado */
  disabled?: boolean;
  /** Se o select é obrigatório */
  required?: boolean;
  /** Se o select tem erro */
  hasError?: boolean;
  /** Classes CSS adicionais */
  className?: string;
  /** ID do select */
  id?: string;
  /** Nome do select */
  name?: string;
  /** Opções do select */
  options?: SelectOption[];
  /** Children (opções como JSX) */
  children?: React.ReactNode;
  /** Função executada na mudança */
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Função executada no foco */
  onFocus?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  /** Função executada na perda de foco */
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
}
