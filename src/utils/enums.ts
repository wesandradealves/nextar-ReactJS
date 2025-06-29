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

// ========================================
// ENUMERAÇÕES PRINCIPAIS
// ========================================

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

// ========================================
// CONFIGURAÇÕES E PERMISSÕES
// ========================================

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
    'all' // Gestor tem acesso total
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

// ========================================
// LABELS E MAPEAMENTOS VISUAIS
// ========================================

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

// ========================================
// ESQUEMAS DE CORES PARA UI
// ========================================

/**
 * Cores para status de chamados (compatível com Tailwind CSS)
 * @const {object}
 */
export const STATUS_COLORS = {
  /** Vermelho para chamados abertos (urgente) */
  [ChamadoStatus.ABERTO]: '#ef4444', // red-500
  /** Âmbar para chamados em progresso */
  [ChamadoStatus.EM_PROGRESSO]: '#f59e0b', // amber-500
  /** Verde para chamados concluídos */
  [ChamadoStatus.CONCLUIDO]: '#10b981' // emerald-500
} as const;

/**
 * Cores para níveis de prioridade (compatível com Tailwind CSS)
 * @const {object}
 */
export const PRIORIDADE_COLORS = {
  /** Cinza para prioridade baixa */
  [Prioridade.BAIXA]: '#6b7280', // gray-500
  /** Âmbar para prioridade média */
  [Prioridade.MEDIA]: '#f59e0b', // amber-500
  /** Vermelho para prioridade alta */
  [Prioridade.ALTA]: '#ef4444' // red-500
} as const;
