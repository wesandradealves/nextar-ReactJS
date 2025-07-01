import { NextApiRequest, NextApiResponse } from 'next';
import { getUsersData } from '@/utils/storage';
import { verifyPassword } from '@/utils/crypto';

/**
 * API endpoint para autenticação de usuários
 * 
 * @description
 * Realiza autenticação baseada em email/senha
 * Compara credenciais com dados mockados em JSON
 * Retorna dados do usuário (sem senha) e token mock para sessão
 * 
 * @param req - Request object do Next.js
 * @param res - Response object do Next.js
 * 
 * @example
 * ```typescript
 * // POST /api/auth/login - Fazer login
 * const response = await fetch('/api/auth/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     email: 'admin@nextar.com',
 *     password: 'admin123'
 *   })
 * });
 * 
 * const { user, token } = await response.json();
 * 
 * // Credenciais disponíveis para teste:
 * // admin@nextar.com / admin123 (Gestão)
 * // ana.silva@antartica.br / admin123 (Gestão) 
 * // joao.costa@antartica.br / agente123 (Agente)
 * // maria.santos@antartica.br / pesq123 (Pesquisador)
 * ```
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const users = getUsersData();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Verificar senha usando hash MD5
    if (!user.senha || !verifyPassword(password, user.senha)) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Remover senha dos dados retornados por segurança
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha, ...userWithoutPassword } = user;

    // Simular token (em produção seria JWT real)
    const token = `mock-token-${user.id}-${Date.now()}`;

    res.status(200).json({
      user: userWithoutPassword,
      token,
      message: 'Login realizado com sucesso'
    });

  } catch {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
