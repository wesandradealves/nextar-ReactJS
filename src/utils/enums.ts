/**
 * @fileoverview ENUMs e constantes do sistema de manutenção da Antártica
 * @description Centraliza todos os valores de enumeração e constantes relacionadas
 * @author Sistema NextAR
 * @version 1.0.0
 */

import { PermissionMap } from '@/types';

/**
 * ENUMs e constantes do sistema de manutenção da Antártica
 * Centraliza todos os valores de enumeração e constantes relacionadas
 */


/**
 * Status possíveis para chamados de manutenção
 * @enum {string}
 */
export enum ChamadoStatus {
  /** Chamado recém-criado, aguardando atribuição */
  ABERTO = 'aberto',
  /** Chamado sendo executado por um agente */
  EM_PROGRESSO = 'em_progresso',
  /** Chamado finalizado com sucesso */
  CONCLUIDO = 'concluido'
}

/**
 * Tipos de manutenção disponíveis
 * @enum {string}
 */
export enum TipoManutencao {
  /** Manutenção reativa para correção de falhas */
  CORRETIVA = 'corretiva',
  /** Manutenção programada para prevenção */
  PREVENTIVA = 'preventiva'
}

/**
 * Níveis de prioridade para chamados
 * @enum {string}
 */
export enum Prioridade {
  /** Prioridade baixa - não crítico */
  BAIXA = 'baixa',
  /** Prioridade média - importante */
  MEDIA = 'media',
  /** Prioridade alta - crítico */
  ALTA = 'alta'
}

/**
 * Perfis de usuário no sistema
 * @enum {string}
 */
export enum PerfilUsuario {
  /** Pesquisador - pode criar chamados */
  PESQUISADOR = 'pesquisador',
  /** Agente de manutenção - executa serviços */
  AGENTE = 'agente',
  /** Gestão - acesso administrativo total */
  GESTAO = 'gestao'
}


/**
 * Mapeamento de permissões por perfil de usuário
 * Define quais ações cada tipo de usuário pode realizar
 * @const {PermissionMap}
 */
export const PERMISSIONS: PermissionMap = {
  [PerfilUsuario.PESQUISADOR]: [
    'view_chamados',
    'create_chamados'
  ],
  [PerfilUsuario.AGENTE]: [
    'view_own_chamados',
    'update_chamados'
  ],
  [PerfilUsuario.GESTAO]: [
    'all'
  ]
};

/**
 * Categorias científicas para setores da estação antártica
 * @const {readonly string[]}
 */
export const CATEGORIAS_CIENTIFICAS = [
  'Biologia',
  'Meteorologia',
  'Glaciologia',
  'Astronomia',
  'Geologia',
  'Oceanografia',
  'Física Atmosférica',
  'Medicina',
  'Comunicações',
  'Logística'
] as const;


/**
 * Labels legíveis para exibição na interface
 * Mapeia valores de enum para textos amigáveis ao usuário
 * @const {object}
 */
export const LABELS = {
  /** Labels para status de chamados */
  STATUS: {
    [ChamadoStatus.ABERTO]: 'Aberto',
    [ChamadoStatus.EM_PROGRESSO]: 'Em Progresso',
    [ChamadoStatus.CONCLUIDO]: 'Concluído'
  },
  /** Labels para tipos de manutenção */
  TIPO: {
    [TipoManutencao.CORRETIVA]: 'Corretiva',
    [TipoManutencao.PREVENTIVA]: 'Preventiva'
  },
  /** Labels para prioridades */
  PRIORIDADE: {
    [Prioridade.BAIXA]: 'Baixa',
    [Prioridade.MEDIA]: 'Média',
    [Prioridade.ALTA]: 'Alta'
  },
  /** Labels para perfis de usuário */
  PERFIL: {
    [PerfilUsuario.PESQUISADOR]: 'Pesquisador',
    [PerfilUsuario.AGENTE]: 'Agente de Manutenção',
    [PerfilUsuario.GESTAO]: 'Gestão'
  }
} as const;

/**
 * Workflow de transições de status permitidas
 * Define quais status podem ser alterados para quais outros status
 * @constant
 */
export const STATUS_WORKFLOW: Record<ChamadoStatus, ChamadoStatus[]> = {
  [ChamadoStatus.ABERTO]: [ChamadoStatus.EM_PROGRESSO],
  [ChamadoStatus.EM_PROGRESSO]: [ChamadoStatus.CONCLUIDO],
  [ChamadoStatus.CONCLUIDO]: []
};

/**
 * Labels legíveis para os status
 * @constant
 */
export const STATUS_LABELS = {
  [ChamadoStatus.ABERTO]: 'Aberto',
  [ChamadoStatus.EM_PROGRESSO]: 'Em Progresso',
  [ChamadoStatus.CONCLUIDO]: 'Concluído'
} as const;

/**
 * Cores dos status para interface
 * @constant
 */
export const STATUS_COLORS = {
  [ChamadoStatus.ABERTO]: '#ef4444',
  [ChamadoStatus.EM_PROGRESSO]: '#f97316',
  [ChamadoStatus.CONCLUIDO]: '#22c55e'
} as const;

/**
 * Verifica se uma transição de status é válida
 * @param {ChamadoStatus} statusAtual - Status atual do chamado
 * @param {ChamadoStatus} novoStatus - Novo status desejado
 * @returns {boolean} True se a transição é válida
 */
export function isValidStatusTransition(
  statusAtual: ChamadoStatus, 
  novoStatus: ChamadoStatus
): boolean {
  const transicoesPossveis = STATUS_WORKFLOW[statusAtual];
  return transicoesPossveis.includes(novoStatus);
}

/**
 * Obtém os status possíveis para transição a partir do status atual
 * @param {ChamadoStatus} statusAtual - Status atual do chamado
 * @returns {ChamadoStatus[]} Array com os status possíveis
 */
export function getAvailableStatusTransitions(statusAtual: ChamadoStatus): ChamadoStatus[] {
  return STATUS_WORKFLOW[statusAtual] || [];
}

/**
 * Verifica se um status requer campos obrigatórios específicos
 * @param {ChamadoStatus} status - Status a verificar
 * @returns {boolean} True se requer campos de finalização
 */
export function statusRequiresFinalizationFields(status: ChamadoStatus): boolean {
  return status === ChamadoStatus.CONCLUIDO;
}
