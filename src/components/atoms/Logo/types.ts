/**
 * Tipos para o componente Logo
 */

export interface LogoProps {
  /** Variação visual do logo */
  variant?: 'default' | 'header' | 'login';
  /** Tamanho do logo */
  size?: 'small' | 'medium' | 'large';
  /** Classes CSS adicionais */
  className?: string;
  /** URL da imagem (opcional, usa padrão se não especificado) */
  src?: string;
  /** Texto alternativo */
  alt?: string;
}
