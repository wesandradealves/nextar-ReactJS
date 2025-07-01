import { Setor, CreateSetorData, UpdateSetorData } from '@/types';

/**
 * Props do SetorModal
 */
export interface SetorModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Callback para fechar o modal */
  onClose: () => void;
  /** Callback para submeter os dados */
  onSubmit: (data: CreateSetorData | UpdateSetorData, setorId?: string) => Promise<void>;
  /** Setor para edição (opcional, se não fornecido será criação) */
  setor?: Setor;
  /** Se está carregando */
  isLoading?: boolean;
}
