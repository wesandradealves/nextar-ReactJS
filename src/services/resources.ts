import { User, Setor, Equipamento, Chamado } from '@/types';
import api from './api';

/**
 * Service para gerenciar recursos da aplicação
 * Integra com as APIs internas do Next.js usando axios configurado
 * com interceptors de loading e autenticação
 */
export class ResourcesService {

  // Usuários
  async getUsers(): Promise<User[]> {
    const response = await api.get('/api/users');
    return response.data;
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await api.post('/api/users', user);
    return response.data;
  }

  // Setores
  async getSetores(): Promise<Setor[]> {
    const response = await api.get('/api/setores');
    return response.data;
  }

  async createSetor(setor: Omit<Setor, 'id'>): Promise<Setor> {
    const response = await api.post('/api/setores', setor);
    return response.data;
  }

  // Equipamentos
  async getEquipamentos(setorId?: string): Promise<Equipamento[]> {
    const params = setorId ? { setorId } : {};
    const response = await api.get('/api/equipamentos', { params });
    return response.data;
  }

  async createEquipamento(equipamento: Omit<Equipamento, 'id'>): Promise<Equipamento> {
    const response = await api.post('/api/equipamentos', equipamento);
    return response.data;
  }

  // Chamados
  async getChamados(filters?: {
    status?: string;
    agenteId?: string;
    tipo?: string;
  }): Promise<Chamado[]> {
    const response = await api.get('/api/chamados', { params: filters });
    return response.data;
  }

  async createChamado(chamado: Omit<Chamado, 'id' | 'dataAbertura'>): Promise<Chamado> {
    const response = await api.post('/api/chamados', chamado);
    return response.data;
  }

  async updateChamado(id: string, updates: Partial<Chamado>): Promise<Chamado> {
    const response = await api.put('/api/chamados', updates, { params: { id } });
    return response.data;
  }

  // Autenticação
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
