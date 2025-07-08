/**
 * @fileoverview Utilitários para verificação de perfil de usuário
 * @description Funções auxiliares para verificar perfis e permissões de usuários
 * @author Sistema NextAR
 * @version 1.0.0
 */

import { PerfilUsuario } from '@/utils/enums';
import { User } from '@/types';

/**
 * Verifica se o usuário tem um perfil específico
 * Lida com problemas de tipagem entre enum e string literal
 * 
 * @param user - Usuário para verificar
 * @param perfil - Perfil esperado
 * @returns boolean indicando se o usuário tem o perfil especificado
 */
export function hasProfile(user: User | null | undefined, perfil: PerfilUsuario): boolean {
  if (!user) return false;
  return (user.perfil as string) === perfil;
}

/**
 * Verifica se o usuário é gestor
 * @param user - Usuário para verificar
 * @returns boolean indicando se é gestor
 */
export function isGestor(user: User | null | undefined): boolean {
  return hasProfile(user, PerfilUsuario.GESTAO);
}

/**
 * Verifica se o usuário é agente
 * @param user - Usuário para verificar
 * @returns boolean indicando se é agente
 */
export function isAgente(user: User | null | undefined): boolean {
  return hasProfile(user, PerfilUsuario.AGENTE);
}

/**
 * Verifica se o usuário é pesquisador
 * @param user - Usuário para verificar
 * @returns boolean indicando se é pesquisador
 */
export function isPesquisador(user: User | null | undefined): boolean {
  return hasProfile(user, PerfilUsuario.PESQUISADOR);
}

/**
 * Filtra usuários por perfil
 * Lida com problemas de tipagem entre enum e string literal
 * 
 * @param usuarios - Array de usuários
 * @param perfil - Perfil para filtrar
 * @returns Array de usuários com o perfil especificado
 */
export function filterByProfile(usuarios: User[], perfil: PerfilUsuario): User[] {
  if (!Array.isArray(usuarios)) return [];
  return usuarios.filter(u => (u.perfil as string) === perfil);
}

/**
 * Obtém lista de agentes
 * @param usuarios - Array de usuários
 * @returns Array de usuários com perfil de agente
 */
export function getAgentes(usuarios: User[]): User[] {
  if (!Array.isArray(usuarios)) return [];
  return usuarios.filter(u => (u.perfil as string) === 'agente');
}

/**
 * Obtém lista de pesquisadores
 * @param usuarios - Array de usuários
 * @returns Array de usuários com perfil de pesquisador
 */
export function getPesquisadores(usuarios: User[]): User[] {
  return filterByProfile(usuarios, PerfilUsuario.PESQUISADOR);
}

/**
 * Obtém lista de gestores
 * @param usuarios - Array de usuários
 * @returns Array de usuários com perfil de gestor
 */
export function getGestores(usuarios: User[]): User[] {
  return filterByProfile(usuarios, PerfilUsuario.GESTAO);
}
