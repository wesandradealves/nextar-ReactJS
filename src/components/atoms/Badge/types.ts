/**
 * Tipos para o componente Badge
 */

export interface BadgeProps {
  /** Conteúdo do badge (opcional quando dot=true) */
  children?: React.ReactNode;
  /** Variante visual do badge */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /** Tamanho do badge */
  size?: 'small' | 'medium' | 'large';
  /** Se o badge é apenas um ponto (sem texto) */
  dot?: boolean;
  /** Classes CSS adicionais */
  className?: string;
  /** Função executada ao clicar (torna o badge clicável) */
  onClick?: () => void;
}
