import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { User } from '@/types';

/**
 * Endpoint para atualização de perfil do usuário
 * GET: Busca dados do usuário autenticado
 * PUT: Atualiza dados do usuário autenticado
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const usersFilePath = path.join(process.cwd(), 'public/api/resources/users.json');
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    if (req.method === 'GET') {
      // Buscar usuário pelo ID (deve vir do token/sessão em um sistema real)
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'ID do usuário é obrigatório' 
        });
      }

      const user = usersData.find((u: User) => u.id === userId);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'Usuário não encontrado' 
        });
      }

      // Remover senha da resposta
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { senha: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({
        success: true,
        data: userWithoutPassword
      });
    }

    if (req.method === 'PUT') {
      const userId = req.query.userId as string;
      const { nome, email } = req.body;

      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'ID do usuário é obrigatório' 
        });
      }

      if (!nome || !email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Nome e email são obrigatórios' 
        });
      }

      // Verificar se email já está em uso por outro usuário
      const emailExists = usersData.find((u: User) => 
        u.email === email && u.id !== userId
      );

      if (emailExists) {
        return res.status(409).json({ 
          success: false, 
          message: 'Este email já está sendo usado por outro usuário' 
        });
      }

      // Encontrar e atualizar o usuário
      const userIndex = usersData.findIndex((u: User) => u.id === userId);
      
      if (userIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'Usuário não encontrado' 
        });
      }

      // Atualizar dados (manter senha e perfil)
      usersData[userIndex] = {
        ...usersData[userIndex],
        nome,
        email
      };

      // Salvar arquivo atualizado
      fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));

      // Retornar dados atualizados sem senha
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { senha: _, ...updatedUser } = usersData[userIndex];

      return res.status(200).json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: updatedUser
      });
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).json({ 
      success: false, 
      message: `Método ${req.method} não permitido` 
    });

  } catch (error) {
    console.error('Erro no endpoint de perfil:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
}
