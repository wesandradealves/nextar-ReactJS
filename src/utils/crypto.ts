/**
 * @fileoverview Utilitários para criptografia de senhas
 * @description Funções para hash MD5 de senhas e validação
 * @author Sistema NextAR
 * @version 1.0.0
 */

import CryptoJS from 'crypto-js';

/**
 * Gera hash MD5 de uma senha
 * @param password - Senha em texto plano
 * @returns {string} Hash MD5 da senha
 * 
 * @example
 * ```typescript
 * const hashedPassword = hashPassword('admin123');
 * console.log(hashedPassword); // "0192023a7bbd73250516f069df18b500"
 * ```
 */
export function hashPassword(password: string): string {
  return CryptoJS.MD5(password).toString();
}

/**
 * Verifica se uma senha em texto plano corresponde ao hash MD5
 * @param password - Senha em texto plano
 * @param hashedPassword - Hash MD5 para comparação
 * @returns {boolean} true se a senha corresponder ao hash
 * 
 * @example
 * ```typescript
 * const isValid = verifyPassword('admin123', '0192023a7bbd73250516f069df18b500');
 * console.log(isValid); // true
 * ```
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const inputHash = hashPassword(password);
  return inputHash === hashedPassword;
}

/**
 * Gera senhas hash para os usuários de teste
 * Usado apenas para desenvolvimento/setup inicial
 * @returns {Record<string, string>} Mapeamento de senhas para seus hashes
 */
export function generateTestPasswordHashes(): Record<string, string> {
  const testPasswords = {
    'admin123': hashPassword('admin123'),
    'agente123': hashPassword('agente123'),
    'pesq123': hashPassword('pesq123'),
  };
  
  console.log('Hashes das senhas de teste:', testPasswords);
  return testPasswords;
}
