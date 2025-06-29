import { NextApiRequest, NextApiResponse } from 'next';
import { User, UpdateUserData } from '@/types';
import { getUsersData, saveUsersData } from '@/utils/storage';
import { hashPassword } from '@/utils/crypto';

/**
 * API endpoint para operações com usuário individual
 * 
 * @description
 * Endpoints disponíveis:
 * - GET: Busca usuário por ID
 * - PUT: Atualiza usuário por ID
 * - DELETE: Remove usuário por ID
 * 
 * @param req - Request object do Next.js
 * @param res - Response object do Next.js
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID do usuário é obrigatório' });
  }

  const users = getUsersData();
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  switch (method) {
    case 'GET':
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { senha: _, ...user } = users[userIndex];
        res.status(200).json(user);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ message: 'Erro ao buscar usuário' });
      }
      break;

    case 'PUT':
      try {
        const updateData: UpdateUserData = req.body;

        // Validar apenas se campos obrigatórios estão sendo atualizados
        if (updateData.nome !== undefined && !updateData.nome.trim()) {
          return res.status(400).json({ message: 'Nome não pode estar vazio' });
        }
        if (updateData.email !== undefined && !updateData.email.trim()) {
          return res.status(400).json({ message: 'Email não pode estar vazio' });
        }
        if (updateData.perfil !== undefined && !updateData.perfil) {
          return res.status(400).json({ message: 'Perfil não pode estar vazio' });
        }

        // Verificar se email já existe em outro usuário (apenas se email está sendo atualizado)
        if (updateData.email) {
          const emailExists = users.some(user => 
            user.email === updateData.email && user.id !== id
          );
          if (emailExists) {
            return res.status(400).json({ 
              message: 'Email já está em uso por outro usuário' 
            });
          }
        }

        // Atualizar usuário
        const updatedUser: User = {
          ...users[userIndex],
          ...updateData,
          dataAtualizacao: new Date().toISOString(),
          ...(updateData.senha && { senha: hashPassword(updateData.senha) })
        };

        users[userIndex] = updatedUser;
        saveUsersData(users);

        // Retornar usuário sem senha
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { senha: _, ...userResponse } = updatedUser;
        res.status(200).json(userResponse);

      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
      }
      break;

    case 'DELETE':
      try {
        users.splice(userIndex, 1);
        saveUsersData(users);
        res.status(200).json({ message: 'Usuário removido com sucesso' });

      } catch (error) {
        console.error('Erro ao remover usuário:', error);
        res.status(500).json({ message: 'Erro ao remover usuário' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
      break;
  }
}
