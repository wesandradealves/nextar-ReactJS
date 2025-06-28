import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/types';
import { getUsersData, saveUsersData, generateNewId } from '@/utils/storage';

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
        const users = getUsersData();
        
        // Gerar novo ID
        const newId = generateNewId(users.map(u => u.id));
        const userWithId: User = { ...newUser, id: newId };
        
        users.push(userWithId);
        
        // Salvar de volta no arquivo (em produção seria no banco)
        saveUsersData(users);
        
        res.status(201).json(userWithId);
      } catch {
        res.status(500).json({ message: 'Erro ao criar usuário' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
