/**
 * @fileoverview Tipos centralizados para o sistema de manutenção da Antártica
 * @description Definições de interfaces, tipos e contratos de dados para toda a aplicação
 * @author Sistema NextAR
 * @version 1.0.0
 */

// Tipos centralizados para o sistema de manutenção da Antártica
import { ChamadoStatus, TipoManutencao, Prioridade, PerfilUsuario } from '@/utils/enums';

/**
 * Representa um usuário do sistema
 * @interface User
 */
export interface User {
  /** Identificador único do usuário */
  id: string;
  /** Nome completo do usuário */
  nome: string;
  /** Email único para autenticação */
  email: string;
  /** Senha para autenticação (apenas para dados mock) */
  senha?: string;
  /** Perfil/função do usuário no sistema */
  perfil: PerfilUsuario;
}

/**
 * Representa um setor científico da estação
 * @interface Setor
 */
export interface Setor {
  /** Identificador único do setor */
  id: string;
  /** Nome do setor */
  nome: string;
  /** Categoria científica (Biologia, Meteorologia, etc.) */
  categoria: string;
}

/**
 * Representa um equipamento da estação
 * @interface Equipamento
 */
export interface Equipamento {
  /** Identificador único do equipamento */
  id: string;
  /** Nome do equipamento */
  nome: string;
  /** Código identificador hexadecimal único */
  codigo: string;
  /** Modelo do equipamento */
  modelo: string;
  /** ID do setor ao qual pertence */
  setorId: string;
  /** Data da próxima manutenção (ISO date string) */
  proximaManutencao: string;
  /** Observações adicionais sobre o equipamento */
  observacoes?: string;
}

/**
 * Representa um chamado de manutenção
 * @interface Chamado
 */
export interface Chamado {
  /** Identificador único do chamado */
  id: string;
  /** Tipo de manutenção (corretiva ou preventiva) */
  tipo: TipoManutencao;
  /** Status atual do chamado */
  status: ChamadoStatus;
  /** Prioridade do chamado */
  prioridade: Prioridade;
  /** Descrição detalhada do problema/serviço */
  descricao: string;
  /** ID do setor solicitante */
  setorId: string;
  /** ID do usuário solicitante */
  solicitanteId: string;
  /** ID do agente responsável (opcional) */
  agenteId?: string;
  /** ID do equipamento relacionado (opcional) */
  equipamentoId?: string;
  /** Data de abertura do chamado (ISO date string) */
  dataAbertura: string;
  /** Data de execução do serviço (opcional) */
  dataExecucao?: string;
  /** Observações de finalização do serviço */
  observacoesFinalizacao?: string;
  /** Lista de peças utilizadas na manutenção */
  pecasUtilizadas?: Array<{ nome: string; quantidade: number }>;
}

/**
 * Representa uma peça utilizada em manutenção
 * @interface PecaUtilizada
 */
export interface PecaUtilizada {
  /** Nome da peça */
  nome: string;
  /** Quantidade utilizada */
  quantidade: number;
}

// ========================================
// TIPOS PARA FILTROS E CONSULTAS
// ========================================

/**
 * Filtros para consulta de chamados
 * @interface ChamadoFilters
 */
export interface ChamadoFilters {
  /** Filtrar por tipo de manutenção */
  tipo?: TipoManutencao;
  /** Filtrar por status do chamado */
  status?: ChamadoStatus;
  /** Filtrar por agente responsável */
  agenteId?: string;
  /** Filtrar por setor */
  setorId?: string;
  /** Filtrar por equipamento */
  equipamentoId?: string;
  /** Data de início para filtro de período */
  dataInicio?: string;
  /** Data de fim para filtro de período */
  dataFim?: string;
}

// ========================================
// TIPOS PARA DASHBOARD E MÉTRICAS
// ========================================

/**
 * Métricas principais do dashboard
 * @interface DashboardMetrics
 */
export interface DashboardMetrics {
  /** Total de chamados em aberto */
  chamadosAbertos: number;
  /** Total de chamados em progresso */
  chamadosEmProgresso: number;
  /** Total de chamados concluídos */
  chamadosConcluidos: number;
  /** Total geral de chamados */
  totalChamados: number;
}

/**
 * Distribuição de chamados por tipo
 * @interface ChamadosPorTipo
 */
export interface ChamadosPorTipo {
  /** Quantidade de chamados corretivos */
  [TipoManutencao.CORRETIVA]: number;
  /** Quantidade de chamados preventivos */
  [TipoManutencao.PREVENTIVA]: number;
}

/**
 * Estatísticas de chamados por agente
 * @interface ChamadosPorAgente
 */
export interface ChamadosPorAgente {
  /** ID do agente */
  agenteId: string;
  /** Nome do agente */
  nomeAgente: string;
  /** Quantidade de chamados atribuídos */
  quantidade: number;
}

// ========================================
// TIPOS PARA PERMISSÕES E SEGURANÇA
// ========================================

/**
 * Permissões disponíveis no sistema
 * @typedef {string} Permission
 */
export type Permission = 
  | 'view_chamados'          // Visualizar chamados
  | 'create_chamados'        // Criar novos chamados
  | 'view_own_chamados'      // Visualizar apenas próprios chamados
  | 'update_chamados'        // Atualizar chamados existentes
  | 'manage_users'           // Gerenciar usuários
  | 'manage_setores'         // Gerenciar setores
  | 'manage_equipamentos'    // Gerenciar equipamentos
  | 'view_dashboard'         // Acessar dashboard
  | 'view_historico'         // Visualizar histórico
  | 'all';                   // Acesso total (gestão)

/**
 * Mapeamento de permissões por perfil de usuário
 * @interface PermissionMap
 */
export interface PermissionMap {
  /** Permissões para pesquisadores */
  [PerfilUsuario.PESQUISADOR]: Permission[];
  /** Permissões para agentes de manutenção */
  [PerfilUsuario.AGENTE]: Permission[];
  /** Permissões para gestão */
  [PerfilUsuario.GESTAO]: Permission[];
}

// ========================================
// TIPOS PARA FORMULÁRIOS
// ========================================

/**
 * Dados do formulário de login
 * @interface LoginFormData
 */
export interface LoginFormData {
  /** Email do usuário */
  email: string;
  /** Senha do usuário */
  password: string;
  /** Opção para lembrar credenciais */
  rememberMe?: boolean;
}

/**
 * Dados do formulário de criação de chamados
 * @interface ChamadoForm
 */
export interface ChamadoForm {
  /** Tipo de manutenção */
  tipo: TipoManutencao;
  /** Prioridade do chamado */
  prioridade: Prioridade;
  /** Descrição do problema/serviço */
  descricao: string;
  /** ID do setor solicitante */
  setorId: string;
  /** ID do equipamento (opcional) */
  equipamentoId?: string;
}

/**
 * Dados do formulário de criação de usuários
 * @interface UsuarioForm
 */
export interface UsuarioForm {
  /** Nome completo */
  nome: string;
  /** Email único */
  email: string;
  /** Senha de acesso */
  senha: string;
  /** Perfil do usuário */
  perfil: PerfilUsuario;
}

/**
 * Dados do formulário de criação de setores
 * @interface SetorForm
 */
export interface SetorForm {
  /** Nome do setor */
  nome: string;
  /** Categoria científica */
  categoria: string;
}

/**
 * Dados do formulário de criação de equipamentos
 * @interface EquipamentoForm
 */
export interface EquipamentoForm {
  /** Nome do equipamento */
  nome: string;
  /** Código identificador */
  codigo: string;
  /** Modelo do equipamento */
  modelo: string;
  /** ID do setor proprietário */
  setorId: string;
  /** Data da próxima manutenção */
  proximaManutencao: string;
  /** Observações adicionais */
  observacoes?: string;
}

// ========================================
// TIPOS PARA RESPOSTAS DA API
// ========================================

/**
 * Formato padrão de resposta da API
 * @interface ApiResponse
 * @template T Tipo dos dados retornados
 */
export interface ApiResponse<T> {
  /** Indica se a operação foi bem-sucedida */
  success: boolean;
  /** Dados retornados pela API */
  data: T;
  /** Mensagem adicional (opcional) */
  message?: string;
}

/**
 * Resposta de autenticação/login
 * @interface LoginResponse
 */
export interface LoginResponse {
  /** Dados do usuário autenticado */
  user: User;
  /** Token de acesso */
  token: string;
}
