import { Chamado } from '../../../types';

/**
 * Props do ChamadoModal
 */
export interface ChamadoModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Função para fechar o modal */
  onClose: () => void;
  /** Chamado para edição (undefined para criação) */
  chamado?: Chamado;
  /** Callback para salvar chamado */
  onSave: (chamadoData: Partial<Chamado>) => Promise<void>;
  /** Se está salvando */
  isSaving?: boolean;
  /** Modo inicial do modal */
  mode?: 'view' | 'edit' | 'create';
}

/**
 * Interface para os dados de uma peça usada no chamado
 */
export interface PartItem {
  /** ID único da peça */
  id: string;
  /** Nome da peça */
  nome: string;
  /** Quantidade utilizada */
  quantidade: number;
  /** Valor unitário */
  valorUnitario: number;
}

/**
 * Interface para os dados de um anexo no chamado
 */
export interface AttachmentItem {
  /** ID único do anexo */
  id: string;
  /** Nome do arquivo */
  nome: string;
  /** URL do arquivo */
  url: string;
  /** Tipo do arquivo */
  tipo: string;
  /** Tamanho do arquivo em bytes */
  tamanho: number;
  /** Data de upload */
  dataUpload: string;
}

/**
 * Estado do formulário do chamado
 */
export interface ChamadoFormState {
  /** Título do chamado */
  titulo: string;
  /** Descrição do chamado */
  descricao: string;
  /** Tipo de manutenção */
  tipoManutencao: string;
  /** Prioridade */
  prioridade: string;
  /** Status */
  status: string;
  /** ID do equipamento */
  equipamentoId: string;
  /** ID do setor */
  setorId: string;
  /** ID do solicitante */
  solicitanteId: string;
  /** ID do técnico responsável */
  responsavelId: string;
  /** Data de abertura */
  dataAbertura: string;
  /** Data prevista para conclusão */
  dataPrevista: string;
  /** Data de conclusão */
  dataConclusao: string;
  /** Lista de peças utilizadas */
  pecas: PartItem[];
  /** Observações técnicas */
  observacoes: string;
  /** Solução aplicada */
  solucao: string;
  /** Anexos */
  anexos: AttachmentItem[];
}
