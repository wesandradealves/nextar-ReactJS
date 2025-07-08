/**
 * Tipos para o componente Spinner
 */

export interface SpinnerProps {
  /** Tamanho do spinner */
  size?: 'small' | 'medium' | 'large';
  /** Cor do spinner */
  color?: string;
  /** Se deve mostrar o overlay de fundo */
  overlay?: boolean;
  /** Classes CSS adicionais */
  className?: string;
  /** Se o spinner está visível */
  visible?: boolean;
  /** Tipo de spinner a ser usado */
  variant?: 'circle' | 'dots' | 'pulse' | 'ring';
}
