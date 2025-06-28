import { PermissionMap } from '@/types';

/**
 * ENUMs e constantes do sistema de manutenção da Antártica
 * Centraliza todos os valores de enumeração e constantes relacionadas
 */

// ENUMs para valores relacionados e limitados
export enum ChamadoStatus {
  ABERTO = 'aberto',
  EM_PROGRESSO = 'em_progresso',
  CONCLUIDO = 'concluido'
}

export enum TipoManutencao {
  CORRETIVA = 'corretiva',
  PREVENTIVA = 'preventiva'
}

export enum Prioridade {
  BAIXA = 'baixa',
  MEDIA = 'media',
  ALTA = 'alta'
}

export enum PerfilUsuario {
  PESQUISADOR = 'pesquisador',
  AGENTE = 'agente',
  GESTAO = 'gestao'
}

// Mapeamento de permissões por perfil de usuário
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

// Categorias científicas para setores
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

// Labels para exibição
export const LABELS = {
  STATUS: {
    [ChamadoStatus.ABERTO]: 'Aberto',
    [ChamadoStatus.EM_PROGRESSO]: 'Em Progresso',
    [ChamadoStatus.CONCLUIDO]: 'Concluído'
  },
  TIPO: {
    [TipoManutencao.CORRETIVA]: 'Corretiva',
    [TipoManutencao.PREVENTIVA]: 'Preventiva'
  },
  PRIORIDADE: {
    [Prioridade.BAIXA]: 'Baixa',
    [Prioridade.MEDIA]: 'Média',
    [Prioridade.ALTA]: 'Alta'
  },
  PERFIL: {
    [PerfilUsuario.PESQUISADOR]: 'Pesquisador',
    [PerfilUsuario.AGENTE]: 'Agente de Manutenção',
    [PerfilUsuario.GESTAO]: 'Gestão'
  }
} as const;

// Cores para status (para uso em componentes)
export const STATUS_COLORS = {
  [ChamadoStatus.ABERTO]: '#ef4444', // red-500
  [ChamadoStatus.EM_PROGRESSO]: '#f59e0b', // amber-500
  [ChamadoStatus.CONCLUIDO]: '#10b981' // emerald-500
} as const;

// Cores para prioridade
export const PRIORIDADE_COLORS = {
  [Prioridade.BAIXA]: '#6b7280', // gray-500
  [Prioridade.MEDIA]: '#f59e0b', // amber-500
  [Prioridade.ALTA]: '#ef4444' // red-500
} as const;
