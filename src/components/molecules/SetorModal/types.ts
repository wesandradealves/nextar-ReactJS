import { Setor } from '@/types';
import { CreateSetorData, UpdateSetorData } from '@/types';

/**
 * Props do SetorModal
 */
export interface SetorModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Função para fechar o modal */
  onClose: () => void;
  /** Setor para edição (undefined para criação) */
  setor?: Setor;
  /** Callback após criar/salvar com sucesso */
  onSuccess?: () => void;
  /** IDs dos setores que não podem ser selecionados como setor pai */
  disabledSetorIds?: string[];
  /** Se está em estado de carregamento */
  isLoading?: boolean;
  /** Função chamada ao confirmar o formulário */
  onSubmit?: (data: CreateSetorData | UpdateSetorData, id?: string) => Promise<void>;
}
