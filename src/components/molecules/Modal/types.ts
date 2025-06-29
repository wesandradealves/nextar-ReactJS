import { ReactNode } from 'react';

/**
 * Tamanhos disponíveis para o modal
 */
export type ModalSize = 'small' | 'medium' | 'large' | 'xlarge';

/**
 * Props do componente Modal
 */
export interface ModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Callback para fechar o modal */
  onClose: () => void;
  /** Título do modal */
  title?: string;
  /** Conteúdo do modal */
  children: ReactNode;
  /** Conteúdo do footer (ações) */
  footer?: ReactNode;
  /** Tamanho do modal */
  size?: ModalSize;
  /** Se deve mostrar o botão de fechar */
  showCloseButton?: boolean;
  /** Se deve fechar ao clicar no overlay */
  closeOnOverlayClick?: boolean;
  /** Se deve fechar ao pressionar ESC */
  closeOnEsc?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Props para styled components do Modal
 */
export interface ModalStyledProps {
  /** Tamanho do modal */
  $size?: ModalSize;
}
