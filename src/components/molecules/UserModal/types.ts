import { User, CreateUserData, UpdateUserData } from '@/types';

/**
 * Props do UserModal
 */
export interface UserModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Callback para fechar o modal */
  onClose: () => void;
  /** Callback para submeter os dados */
  onSubmit: (data: CreateUserData | UpdateUserData, userId?: string) => Promise<void>;
  /** Usuário para edição (opcional, se não fornecido será criação) */
  user?: User;
  /** Se está carregando */
  isLoading?: boolean;
}
