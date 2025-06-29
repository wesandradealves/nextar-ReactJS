import { NextApiRequest, NextApiResponse } from 'next';
import { getUsersData, saveUsersData } from '@/utils/storage';
import { hashPassword, verifyPassword } from '@/utils/crypto';

/**
 * API endpoint para alteração de senha de usuário
 * 
 * @description
 * Permite que um usuário altere sua senha fornecendo a senha atual e a nova senha
 * A senha atual é verificada antes da alteração para segurança
 * 
 * @param req - Request object do Next.js
 * @param res - Response object do Next.js
 * 
 * @example
 * ```typescript
 * // PUT /api/users/change-password
 * const response = await fetch('/api/users/change-password', {
 *   method: 'PUT',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     userId: '1',
 *     currentPassword: 'senhaAtual123',
 *     newPassword: 'novaSenha456'
 *   })
 * });
 * ```
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const { userId, currentPassword, newPassword } = req.body;

    // Validar campos obrigatórios
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'ID do usuário, senha atual e nova senha são obrigatórios' 
      });
    }

    // Validar comprimento da nova senha
    if (newPassword.length < 3) {
      return res.status(400).json({ 
        message: 'Nova senha deve ter pelo menos 3 caracteres' 
      });
    }

    const users = getUsersData();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const user = users[userIndex];

    // Verificar senha atual
    if (!user.senha || !verifyPassword(currentPassword, user.senha)) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }

    // Criptografar nova senha
    const hashedNewPassword = hashPassword(newPassword);
    
    // Atualizar senha
    users[userIndex] = { ...user, senha: hashedNewPassword };
    
    // Salvar alterações
    saveUsersData(users);

    res.status(200).json({ 
      message: 'Senha alterada com sucesso',
      success: true
    });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
