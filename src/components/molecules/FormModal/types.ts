import { ReactNode } from 'react';

/**
 * Props para o FormModal genérico
 */
export interface FormModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Função para fechar o modal */
  onClose: () => void;
  /** Título do modal */
  title: string;
  /** Subtítulo opcional */
  subtitle?: string;
  /** Conteúdo do formulário */
  children: ReactNode;
  /** Texto do botão de confirmação */
  confirmText?: string;
  /** Texto do botão de cancelar */
  cancelText?: string;
  /** Função chamada ao confirmar */
  onConfirm?: () => void;
  /** Se está carregando/salvando */
  isLoading?: boolean;
  /** Se o botão de confirmar está desabilitado */
  isConfirmDisabled?: boolean;
  /** Variante do botão de confirmação */
  confirmVariant?: 'primary' | 'secondary' | 'danger' | 'outline';
  /** Tamanho do modal */
  size?: 'small' | 'medium' | 'large';
  /** Se deve mostrar o footer com botões */
  showFooter?: boolean;
  /** Footer customizado (substitui os botões padrão) */
  customFooter?: ReactNode;
  /** Se deve fechar ao clicar fora */
  closeOnOverlayClick?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}
