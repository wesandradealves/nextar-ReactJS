/**
 * Tipos para o componente Button
 */

export interface ButtonProps {
  /** Conteúdo do botão */
  children: React.ReactNode;
  /** Variante visual do botão */
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  /** Tamanho do botão */
  size?: 'small' | 'medium' | 'large';
  /** Se o botão está desabilitado */
  disabled?: boolean;
  /** Se o botão está em estado de carregamento */
  loading?: boolean;
  /** Tipo do botão HTML */
  type?: 'button' | 'submit' | 'reset';
  /** Classes CSS adicionais */
  className?: string;
  /** Função executada ao clicar */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Se o botão deve ocupar toda a largura */
  fullWidth?: boolean;
  /** Ícone do botão (opcional) */
  icon?: React.ReactNode;
  /** Posição do ícone */
  iconPosition?: 'left' | 'right';
}
