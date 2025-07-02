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
  /** Se o componente inteiro está desabilitado */
  disabled?: boolean;
}
