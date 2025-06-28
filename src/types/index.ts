// Tipos centralizados para o sistema de manutenção da Antártica
import { ChamadoStatus, TipoManutencao, Prioridade, PerfilUsuario } from '@/utils/enums';

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
}

export interface Setor {
  id: string;
  nome: string;
  categoria: string; // Biologia, Meteorologia, etc.
}

export interface Equipamento {
  id: string;
  nome: string;
  codigo: string; // identificador hexadecimal
  modelo: string;
  setorId: string;
  proximaManutencao: string; // ISO date string
  observacoes?: string;
}

export interface Chamado {
  id: string;
  tipo: TipoManutencao;
  status: ChamadoStatus;
  prioridade: Prioridade;
  descricao: string;
  setorId: string;
  solicitanteId: string;
  agenteId?: string;
  equipamentoId?: string; // opcional - pode ser relacionado a um local
  dataAbertura: string; // ISO date string
  dataExecucao?: string;
  observacoesFinalizacao?: string;
  pecasUtilizadas?: Array<{ nome: string; quantidade: number }>;
}

export interface PecaUtilizada {
  nome: string;
  quantidade: number;
}

// Tipos para filtros
export interface ChamadoFilters {
  tipo?: TipoManutencao;
  status?: ChamadoStatus;
  agenteId?: string;
  setorId?: string;
  equipamentoId?: string;
  dataInicio?: string;
  dataFim?: string;
}

// Tipos para dashboard/métricas
export interface DashboardMetrics {
  chamadosAbertos: number;
  chamadosEmProgresso: number;
  chamadosConcluidos: number;
  totalChamados: number;
}

export interface ChamadosPorTipo {
  [TipoManutencao.CORRETIVA]: number;
  [TipoManutencao.PREVENTIVA]: number;
}

export interface ChamadosPorAgente {
  agenteId: string;
  nomeAgente: string;
  quantidade: number;
}

// Tipos para permissões
export type Permission = 
  | 'view_chamados'
  | 'create_chamados'
  | 'view_own_chamados'
  | 'update_chamados'
  | 'manage_users'
  | 'manage_setores'
  | 'manage_equipamentos'
  | 'view_dashboard'
  | 'view_historico'
  | 'all';

export interface PermissionMap {
  [PerfilUsuario.PESQUISADOR]: Permission[];
  [PerfilUsuario.AGENTE]: Permission[];
  [PerfilUsuario.GESTAO]: Permission[];
}

// Tipos para formulários
export interface ChamadoForm {
  tipo: TipoManutencao;
  prioridade: Prioridade;
  descricao: string;
  setorId: string;
  equipamentoId?: string;
}

export interface UsuarioForm {
  nome: string;
  email: string;
  senha: string;
  perfil: PerfilUsuario;
}

export interface SetorForm {
  nome: string;
  categoria: string;
}

export interface EquipamentoForm {
  nome: string;
  codigo: string;
  modelo: string;
  setorId: string;
  proximaManutencao: string;
  observacoes?: string;
}

// Tipos para API responses (quando integrar com backend)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
