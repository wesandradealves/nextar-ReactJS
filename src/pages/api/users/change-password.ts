import { NextApiRequest, NextApiResponse } from 'next';
import { getUsersData, saveUsersData } from '@/utils/storage';
import { hashPassword, verifyPassword } from '@/utils/crypto';
import { PerfilUsuario } from '@/utils/enums';

/**
 * API endpoint para alteração de senha de usuário
 * 
 * @description
 * Permite alteração de senha de duas formas:
 * 1. Usuário alterando sua própria senha (requer senha atual)
 * 2. Administrador alterando senha de outro usuário (requer perfil GESTAO)
 * 
 * @param req - Request object do Next.js
 * @param res - Response object do Next.js
 * 
 * @example
 * ```typescript
 * // Usuário alterando própria senha
 * const response = await fetch('/api/users/change-password', {
 *   method: 'PUT',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     userId: '1',
 *     currentPassword: 'senhaAtual123',
 *     newPassword: 'novaSenha456'
 *   })
 * });
 * 
 * // Administrador alterando senha de outro usuário
 * const response = await fetch('/api/users/change-password', {
 *   method: 'PUT',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     userId: '5', // usuário alvo
 *     adminUserId: '1', // administrador
 *     newPassword: 'novaSenha456',
 *     isAdminChange: true
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
    const { userId, currentPassword, newPassword, adminUserId, isAdminChange } = req.body;

    // Validar campos obrigatórios
    if (!userId || !newPassword) {
      return res.status(400).json({ 
        message: 'ID do usuário e nova senha são obrigatórios' 
      });
    }

    // Validar comprimento da nova senha
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'Nova senha deve ter pelo menos 6 caracteres' 
      });
    }

    const users = getUsersData();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const user = users[userIndex];

    // Verificar se o usuário está ativo
    if (!user.ativo) {
      return res.status(400).json({ 
        message: 'Não é possível alterar senha de usuário inativo' 
      });
    }

    // Verificar se é alteração por administrador
    if (isAdminChange) {
      if (!adminUserId) {
        return res.status(400).json({ 
          message: 'ID do administrador é obrigatório para alteração administrativa' 
        });
      }

      // Verificar se o administrador existe e tem permissão
      const adminUser = users.find(u => u.id === adminUserId);
      if (!adminUser) {
        return res.status(404).json({ message: 'Administrador não encontrado' });
      }

      if (adminUser.perfil !== PerfilUsuario.GESTAO) {
        return res.status(403).json({ 
          message: 'Acesso negado. Apenas usuários com perfil GESTAO podem alterar senhas de outros usuários' 
        });
      }

      if (!adminUser.ativo) {
        return res.status(403).json({ 
          message: 'Administrador deve estar ativo para realizar essa operação' 
        });
      }

      // Criptografar nova senha
      const hashedNewPassword = hashPassword(newPassword);
      
      // Atualizar senha
      users[userIndex] = { 
        ...user, 
        senha: hashedNewPassword,
        updatedAt: new Date().toISOString()
      };
      
      // Salvar alterações
      saveUsersData(users);

      return res.status(200).json({ 
        message: `Senha do usuário ${user.nome} alterada com sucesso pelo administrador ${adminUser.nome}`,
        success: true,
        targetUser: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          usuario: user.usuario
        }
      });
    } else {
      // Alteração da própria senha - requer senha atual
      if (!currentPassword) {
        return res.status(400).json({ 
          message: 'Senha atual é obrigatória para alteração da própria senha' 
        });
      }

      // Verificar senha atual
      if (!user.senha || !verifyPassword(currentPassword, user.senha)) {
        return res.status(401).json({ message: 'Senha atual incorreta' });
      }

      // Criptografar nova senha
      const hashedNewPassword = hashPassword(newPassword);
      
      // Atualizar senha
      users[userIndex] = { 
        ...user, 
        senha: hashedNewPassword,
        updatedAt: new Date().toISOString()
      };
      
      // Salvar alterações
      saveUsersData(users);

      return res.status(200).json({ 
        message: 'Senha alterada com sucesso',
        success: true
      });
    }

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
