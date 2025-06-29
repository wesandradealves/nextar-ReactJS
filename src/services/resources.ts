/**
 * @fileoverview Service para gerenciar recursos da aplicação
 * @description Integra com as APIs internas do Next.js usando axios configurado
 * @author Sistema NextAR
 * @version 1.0.0
 */

import { User, Setor, Equipamento, Chamado } from '@/types';
import api from './api';

/**
 * Service para gerenciar recursos da aplicação
 * Integra com as APIs internas do Next.js usando axios configurado
 * com interceptors de loading e autenticação
 */
export class ResourcesService {

  // ========================================
  // OPERAÇÕES COM USUÁRIOS
  // ========================================

  /**
   * Busca todos os usuários do sistema
   * @returns {Promise<User[]>} Lista de usuários
   * @throws {Error} Se a requisição falhar
   */
  async getUsers(): Promise<User[]> {
    const response = await api.get('/api/users');
    return response.data;
  }

  /**
   * Cria um novo usuário no sistema
   * @param {Omit<User, 'id'>} user - Dados do usuário sem ID
   * @returns {Promise<User>} Usuário criado com ID
   * @throws {Error} Se a criação falhar
   */
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await api.post('/api/users', user);
    return response.data;
  }

  /**
   * Atualiza um usuário existente
   * @param {string} id - ID do usuário
   * @param {Partial<User>} updates - Dados para atualização
   * @returns {Promise<User>} Usuário atualizado
   * @throws {Error} Se a atualização falhar
   */
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const response = await api.put('/api/users', { id, ...updates });
    return response.data;
  }

  /**
   * Altera a senha de um usuário
   * @param {string} userId - ID do usuário
   * @param {string} currentPassword - Senha atual
   * @param {string} newPassword - Nova senha
   * @returns {Promise<{success: boolean, message: string}>} Resultado da operação
   * @throws {Error} Se a alteração falhar
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{success: boolean, message: string}> {
    const response = await api.put('/api/users/change-password', {
      userId,
      currentPassword,
      newPassword
    });
    return response.data;
  }

  // ========================================
  // OPERAÇÕES COM SETORES
  // ========================================

  /**
   * Busca todos os setores do sistema
   * @returns {Promise<Setor[]>} Lista de setores
   * @throws {Error} Se a requisição falhar
   */
  async getSetores(): Promise<Setor[]> {
    const response = await api.get('/api/setores');
    return response.data;
  }

  /**
   * Cria um novo setor no sistema
   * @param {Omit<Setor, 'id'>} setor - Dados do setor sem ID
   * @returns {Promise<Setor>} Setor criado com ID
   * @throws {Error} Se a criação falhar
   */
  async createSetor(setor: Omit<Setor, 'id'>): Promise<Setor> {
    const response = await api.post('/api/setores', setor);
    return response.data;
  }

  // ========================================
  // OPERAÇÕES COM EQUIPAMENTOS
  // ========================================

  /**
   * Busca equipamentos do sistema, opcionalmente filtrados por setor
   * @param {string} [setorId] - ID do setor para filtrar (opcional)
   * @returns {Promise<Equipamento[]>} Lista de equipamentos
   * @throws {Error} Se a requisição falhar
   */
  async getEquipamentos(setorId?: string): Promise<Equipamento[]> {
    const params = setorId ? { setorId } : {};
    const response = await api.get('/api/equipamentos', { params });
    return response.data;
  }

  /**
   * Cria um novo equipamento no sistema
   * @param {Omit<Equipamento, 'id'>} equipamento - Dados do equipamento sem ID
   * @returns {Promise<Equipamento>} Equipamento criado com ID
   * @throws {Error} Se a criação falhar
   */
  async createEquipamento(equipamento: Omit<Equipamento, 'id'>): Promise<Equipamento> {
    const response = await api.post('/api/equipamentos', equipamento);
    return response.data;
  }

  // ========================================
  // OPERAÇÕES COM CHAMADOS
  // ========================================

  /**
   * Busca chamados do sistema com filtros opcionais
   * @param {object} [filters] - Filtros para a busca
   * @param {string} [filters.status] - Filtrar por status
   * @param {string} [filters.agenteId] - Filtrar por agente
   * @param {string} [filters.tipo] - Filtrar por tipo
   * @returns {Promise<Chamado[]>} Lista de chamados filtrados
   * @throws {Error} Se a requisição falhar
   */
  async getChamados(filters?: {
    status?: string;
    agenteId?: string;
    tipo?: string;
  }): Promise<Chamado[]> {
    const response = await api.get('/api/chamados', { params: filters });
    return response.data;
  }

  /**
   * Cria um novo chamado de manutenção
   * @param {Omit<Chamado, 'id' | 'dataAbertura'>} chamado - Dados do chamado (ID e data são gerados automaticamente)
   * @returns {Promise<Chamado>} Chamado criado com ID e data
   * @throws {Error} Se a criação falhar
   */
  async createChamado(chamado: Omit<Chamado, 'id' | 'dataAbertura'>): Promise<Chamado> {
    const response = await api.post('/api/chamados', chamado);
    return response.data;
  }

  /**
   * Atualiza um chamado existente
   * @param {string} id - ID do chamado a ser atualizado
   * @param {Partial<Chamado>} updates - Dados a serem atualizados
   * @returns {Promise<Chamado>} Chamado atualizado
   * @throws {Error} Se a atualização falhar
   */
  async updateChamado(id: string, updates: Partial<Chamado>): Promise<Chamado> {
    const response = await api.put('/api/chamados', updates, { params: { id } });
    return response.data;
  }

  // ========================================
  // AUTENTICAÇÃO
  // ========================================

  /**
   * Realiza login no sistema
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<{user: User, token: string}>} Dados do usuário e token
   * @throws {Error} Se as credenciais forem inválidas
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  }

  // Dashboard
  async getDashboardStats() {
    const response = await api.get('/api/dashboard');
    return response.data;
  }
}

/**
 * Instância singleton do serviço de recursos
 * Usar esta instância para todas as operações de API
 */
export const resources = new ResourcesService();
