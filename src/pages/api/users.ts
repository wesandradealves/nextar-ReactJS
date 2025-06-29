import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/types';
import { getUsersData, saveUsersData, generateNewId } from '@/utils/storage';
import { hashPassword } from '@/utils/crypto';

/**
 * API endpoint para gerenciar usuários
 * 
 * @description
 * Endpoints disponíveis:
 * - GET: Lista todos os usuários
 * - POST: Cria um novo usuário (senha será criptografada)
 * - PUT: Atualiza um usuário existente (senha será criptografada se fornecida)
 * 
 * @param req - Request object do Next.js
 * @param res - Response object do Next.js
 * 
 * @example
 * ```typescript
 * // GET /api/users - Listar usuários
 * const response = await fetch('/api/users');
 * const users = await response.json();
 * 
 * // POST /api/users - Criar usuário
 * const response = await fetch('/api/users', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     nome: 'João Silva',
 *     email: 'joao@email.com',
 *     perfil: 'USER',
 *     setor: 'TI'
 *   })
 * });
 * ```
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const users = getUsersData();
        res.status(200).json(users);
      } catch {
        res.status(500).json({ message: 'Erro ao carregar usuários' });
      }
      break;

    case 'POST':
      try {
        const newUser: Omit<User, 'id'> = req.body;
        
        // Validar campos obrigatórios
        if (!newUser.senha) {
          return res.status(400).json({ message: 'Senha é obrigatória' });
        }
        
        const users = getUsersData();
        
        // Criptografar senha antes de salvar
        const hashedPassword = hashPassword(newUser.senha);
        
        // Gerar novo ID
        const newId = generateNewId(users.map(u => u.id));
        const userWithId: User = { 
          ...newUser, 
          id: newId, 
          senha: hashedPassword 
        };
        
        users.push(userWithId);
        
        // Salvar de volta no arquivo (em produção seria no banco)
        saveUsersData(users);
        
        // Remover senha da resposta por segurança
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { senha, ...userResponse } = userWithId;
        
        res.status(201).json(userResponse);
      } catch {
        res.status(500).json({ message: 'Erro ao criar usuário' });
      }
      break;

    case 'PUT':
      try {
        const { id, ...updateData }: Partial<User> & { id: string } = req.body;
        
        if (!id) {
          return res.status(400).json({ message: 'ID do usuário é obrigatório' });
        }
        
        const users = getUsersData();
        const userIndex = users.findIndex(u => u.id === id);
        
        if (userIndex === -1) {
          return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        
        // Se senha foi fornecida, criptografar
        if (updateData.senha) {
          updateData.senha = hashPassword(updateData.senha);
        }
        
        // Atualizar usuário
        users[userIndex] = { ...users[userIndex], ...updateData };
        
        // Salvar de volta
        saveUsersData(users);
        
        // Remover senha da resposta por segurança
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { senha, ...userResponse } = users[userIndex];
        
        res.status(200).json(userResponse);
      } catch {
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
