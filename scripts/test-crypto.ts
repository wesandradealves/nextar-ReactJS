/**
 * Script para testar as funções de criptografia
 * Execute com: npx ts-node scripts/test-crypto.ts
 */

import { hashPassword, verifyPassword } from '../src/utils/crypto';

console.log('🔐 Testando sistema de criptografia MD5...\n');

// Testes das senhas de exemplo
const testPasswords = ['admin123', 'agente123', 'pesq123'];

testPasswords.forEach(password => {
  const hash = hashPassword(password);
  const isValid = verifyPassword(password, hash);
  const isInvalid = verifyPassword('senhaErrada', hash);
  
  console.log(`📝 Senha: "${password}"`);
  console.log(`🔑 Hash:  ${hash}`);
  console.log(`✅ Verificação correta: ${isValid}`);
  console.log(`❌ Verificação incorreta: ${isInvalid}`);
  console.log('---');
});

console.log('\n🎉 Teste concluído!');
