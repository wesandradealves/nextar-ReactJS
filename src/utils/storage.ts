import path from 'path';
import fs from 'fs';
import { User, Setor, Equipamento, Chamado } from '@/types';

// Diretório base dos recursos
const RESOURCES_DIR = path.join(process.cwd(), 'public', 'api', 'resources');

/**
 * Utilitários para gerenciamento de armazenamento de dados
 * Funções para ler e escrever arquivos JSON dos recursos da aplicação
 */

// Usuários
export const getUsersData = (): User[] => {
  const filePath = path.join(RESOURCES_DIR, 'users.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
};

export const saveUsersData = (users: User[]): void => {
  const filePath = path.join(RESOURCES_DIR, 'users.json');
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

// Setores
export const getSetoresData = (): Setor[] => {
  const filePath = path.join(RESOURCES_DIR, 'setores.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
};

export const saveSetoresData = (setores: Setor[]): void => {
  const filePath = path.join(RESOURCES_DIR, 'setores.json');
  fs.writeFileSync(filePath, JSON.stringify(setores, null, 2));
};

// Equipamentos
export const getEquipamentosData = (): Equipamento[] => {
  const filePath = path.join(RESOURCES_DIR, 'equipamentos.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
};

export const saveEquipamentosData = (equipamentos: Equipamento[]): void => {
  const filePath = path.join(RESOURCES_DIR, 'equipamentos.json');
  fs.writeFileSync(filePath, JSON.stringify(equipamentos, null, 2));
};

// Chamados
export const getChamadosData = (): Chamado[] => {
  const filePath = path.join(RESOURCES_DIR, 'chamados.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
};

export const saveChamadosData = (chamados: Chamado[]): void => {
  const filePath = path.join(RESOURCES_DIR, 'chamados.json');
  fs.writeFileSync(filePath, JSON.stringify(chamados, null, 2));
};

/**
 * Geração de IDs únicos para novos registros
 * Gera um ID sequencial baseado nos IDs existentes
 */
export const generateNewId = (existingIds: string[]): string => {
  const numericIds = existingIds.map(id => parseInt(id)).filter(id => !isNaN(id));
  const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
  return (maxId + 1).toString();
};
