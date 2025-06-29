export interface ChangePasswordModalProps {
  /** Se o modal está visível */
  isOpen: boolean;
  
  /** Função para fechar o modal */
  onClose: () => void;
  
  /** Função chamada quando a senha for alterada com sucesso */
  onSuccess?: () => void;
  
  /** Estado de loading durante a operação */
  isLoading?: boolean;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
