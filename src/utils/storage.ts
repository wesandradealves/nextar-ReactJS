/**
 * @fileoverview Utilitários para gerenciamento de armazenamento de dados JSON
 * @description Funções para leitura e escrita de arquivos JSON dos recursos da aplicação
 * @author Sistema NextAR
 * @version 1.0.0
 */

import path from 'path';
import fs from 'fs';
import { User, Setor, Equipamento, Chamado } from '@/types';

/** Diretório base dos recursos JSON */
const RESOURCES_DIR = path.join(process.cwd(), 'public', 'api', 'resources');

/**
 * Utilitários para gerenciamento de armazenamento de dados
 * Funções para ler e escrever arquivos JSON dos recursos da aplicação
 */


/**
 * Lê dados dos usuários do arquivo JSON
 * @returns {User[]} Array de usuários
 * @throws {Error} Se não conseguir ler o arquivo
 */
export const getUsersData = (): User[] => {
  const filePath = path.join(RESOURCES_DIR, 'users.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
};

/**
 * Salva dados dos usuários no arquivo JSON
 * @param {User[]} users - Array de usuários para salvar
 * @throws {Error} Se não conseguir escrever o arquivo
 */
export const saveUsersData = (users: User[]): void => {
  const filePath = path.join(RESOURCES_DIR, 'users.json');
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};


/**
 * Lê dados dos setores do arquivo JSON
 * @returns {Setor[]} Array de setores
 * @throws {Error} Se não conseguir ler o arquivo
 */
export const getSetoresData = (): Setor[] => {
  const filePath = path.join(RESOURCES_DIR, 'setores.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
};

/**
 * Salva dados dos setores no arquivo JSON
 * @param {Setor[]} setores - Array de setores para salvar
 * @throws {Error} Se não conseguir escrever o arquivo
 */
export const saveSetoresData = (setores: Setor[]): void => {
  const filePath = path.join(RESOURCES_DIR, 'setores.json');
  fs.writeFileSync(filePath, JSON.stringify(setores, null, 2));
};


/**
 * Lê dados dos equipamentos do arquivo JSON
 * @returns {Equipamento[]} Array de equipamentos
 * @throws {Error} Se não conseguir ler o arquivo
 */
export const getEquipamentosData = (): Equipamento[] => {
  const filePath = path.join(RESOURCES_DIR, 'equipamentos.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
};

/**
 * Salva dados dos equipamentos no arquivo JSON
 * @param {Equipamento[]} equipamentos - Array de equipamentos para salvar
 * @throws {Error} Se não conseguir escrever o arquivo
 */
export const saveEquipamentosData = (equipamentos: Equipamento[]): void => {
  const filePath = path.join(RESOURCES_DIR, 'equipamentos.json');
  fs.writeFileSync(filePath, JSON.stringify(equipamentos, null, 2));
};


/**
 * Lê dados dos chamados do arquivo JSON
 * @returns {Chamado[]} Array de chamados
 * @throws {Error} Se não conseguir ler o arquivo
 */
export const getChamadosData = (): Chamado[] => {
  const filePath = path.join(RESOURCES_DIR, 'chamados.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
};

/**
 * Salva dados dos chamados no arquivo JSON
 * @param {Chamado[]} chamados - Array de chamados para salvar
 * @throws {Error} Se não conseguir escrever o arquivo
 */
export const saveChamadosData = (chamados: Chamado[]): void => {
  const filePath = path.join(RESOURCES_DIR, 'chamados.json');
  fs.writeFileSync(filePath, JSON.stringify(chamados, null, 2));
};


/**
 * Gera um ID único sequencial para novos registros
 * @param {string[]} existingIds - Array de IDs existentes
 * @returns {string} Novo ID sequencial
 * @description Gera um ID sequencial baseado nos IDs existentes
 */
export const generateNewId = (existingIds: string[]): string => {
  const numericIds = existingIds.map(id => parseInt(id)).filter(id => !isNaN(id));
  const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
  return (maxId + 1).toString();
};
