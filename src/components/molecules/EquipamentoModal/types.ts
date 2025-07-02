import { Equipamento } from '@/types';
import { CreateEquipamentoData, UpdateEquipamentoData } from '@/types';

/**
 * Props do EquipamentoModal
 */
export interface EquipamentoModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Função para fechar o modal */
  onClose: () => void;
  /** Equipamento para edição (undefined para criação) */
  equipamento?: Equipamento;
  /** Callback após criar/salvar com sucesso */
  onSuccess?: () => void;
  /** Se está em estado de carregamento */
  isLoading?: boolean;
  /** Modo de operação do modal */
  mode?: 'view' | 'edit' | 'create';
  /** Função chamada ao confirmar o formulário */
  onSubmit?: (data: CreateEquipamentoData | UpdateEquipamentoData, id?: string) => Promise<void>;
}
