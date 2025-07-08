import { User } from '../../../types';
import { PerfilUsuario } from '../../../utils/enums';

/**
 * Props do UserModal
 */
export interface UserModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Função para fechar o modal */
  onClose: () => void;
  /** Usuário para edição (undefined para criação) */
  user?: User;
  /** Callback para salvar usuário */
  onSave: (userData: Partial<User>) => Promise<void>;
  /** Callback para alterar senha (apenas para gestores) */
  onChangePassword?: (userId: string, newPassword: string) => Promise<void>;
  /** Se está salvando */
  isSaving?: boolean;
}

/**
 * Estado do formulário do usuário
 */
export interface UserFormState {
  /** Nome completo do usuário */
  nome: string;
  /** Email do usuário */
  email: string;
  /** Perfil/papel do usuário no sistema */
  perfil: PerfilUsuario;
  /** Setor do usuário */
  setor: string;
  /** Index signature para compatibilidade com User */
  [key: string]: unknown;
}

/**
 * Estado dos campos de senha
 */
export interface PasswordState {
  /** Nova senha */
  newPassword: string;
  /** Confirmação de senha */
  confirmPassword: string;
}

/**
 * Tipo para validação de senha
 */
export interface PasswordValidation {
  /** Se a senha tem pelo menos 8 caracteres */
  hasMinLength: boolean;
  /** Se a senha tem letra maiúscula */
  hasUppercase: boolean;
  /** Se a senha tem letra minúscula */
  hasLowercase: boolean;
  /** Se a senha tem número */
  hasNumber: boolean;
  /** Se a senha tem caractere especial */
  hasSpecialChar: boolean;
  /** Se as senhas coincidem */
  passwordsMatch: boolean;
}
