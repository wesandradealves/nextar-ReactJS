import type { Chamado } from '@/types';

/**
 * Props do modal de chamados
 */
export interface ChamadoModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Callback para fechar o modal */
  onClose: () => void;
  /** Callback para submeter o formulário */
  onSubmit: (data: ChamadoFormData, chamadoId?: string) => Promise<void>;
  /** Chamado sendo editado (undefined para criação) */
  chamado?: Chamado;
  /** Se está carregando */
  isLoading?: boolean;
  /** Modo do modal */
  mode?: 'create' | 'edit' | 'view';
  /** Callback para mudar o modo do modal (view -> edit) */
  onModeChange?: (mode: 'create' | 'edit' | 'view') => void;
}

/**
 * Dados do formulário de chamado
 */
export interface ChamadoFormData {
  tipo: string;
  prioridade: string;
  titulo?: string;
  descricao: string;
  setorId: string;
  equipamentoId?: string;
  agenteId?: string;
  observacoes?: string;
  dataExecucao?: string;
  observacoesFinalizacao?: string;
  pecasUtilizadas?: Array<{ nome: string; quantidade: number }>;
  status?: string;
  solicitanteId?: string;
  [key: string]: unknown;
}
