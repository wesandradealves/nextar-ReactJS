import { NextApiRequest, NextApiResponse } from 'next';
import { User, PaginatedResponse, CreateUserData } from '@/types';
import { getUsersData, saveUsersData, generateNewId } from '@/utils/storage';
import { hashPassword } from '@/utils/crypto';

/**
 * API endpoint para gerenciar usuários
 * 
 * @description
 * Endpoints disponíveis:
 * - GET: Lista usuários com suporte a paginação, busca e filtros
 * - POST: Cria um novo usuário (senha será criptografada)
 * - PUT: Atualiza um usuário existente (senha será criptografada se fornecida)
 * 
 * @param req - Request object do Next.js
 * @param res - Response object do Next.js
 * 
 * @example
 * ```typescript
 * // GET /api/users?page=1&limit=10&search=joão&perfil=PESQUISADOR&sortBy=nome&sortOrder=asc
 * // POST /api/users - Criar usuário
 * // PUT /api/users/123 - Atualizar usuário
 * ```
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const {
          page = '1',
          limit = '10',
          search = '',
          perfil,
          sortBy = 'nome',
          sortOrder = 'asc'
        } = req.query;

        const allUsers = getUsersData();
        let filteredUsers = [...allUsers];

        // Aplicar busca por nome ou email
        if (search && typeof search === 'string') {
          const searchTerm = search.toLowerCase();
          filteredUsers = filteredUsers.filter(user =>
            user.nome.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
          );
        }

        // Aplicar filtro por perfil
        if (perfil && typeof perfil === 'string') {
          filteredUsers = filteredUsers.filter(user => user.perfil === perfil);
        }

        // Aplicar ordenação
        if (typeof sortBy === 'string') {
          filteredUsers.sort((a, b) => {
            const aValue = String(a[sortBy as keyof User] || '');
            const bValue = String(b[sortBy as keyof User] || '');
            
            const comparison = aValue.localeCompare(bValue);
            return sortOrder === 'desc' ? -comparison : comparison;
          });
        }

        // Aplicar paginação
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const offset = (pageNum - 1) * limitNum;
        const paginatedUsers = filteredUsers.slice(offset, offset + limitNum);

        // Remover senhas dos dados retornados
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const safeUsers = paginatedUsers.map(({ senha: _senha, ...user }) => user);

        const response: PaginatedResponse<Omit<User, 'senha'>> = {
          data: safeUsers,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: filteredUsers.length,
            totalPages: Math.ceil(filteredUsers.length / limitNum)
          },
          sorting: {
            sortBy: sortBy as string,
            sortOrder: sortOrder as 'asc' | 'desc'
          }
        };

        res.status(200).json(response);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        res.status(500).json({ message: 'Erro ao carregar usuários' });
      }
      break;

    case 'POST':
      try {
        const newUser: CreateUserData = req.body;
        
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
          senha: hashedPassword,
          ativo: true,
          dataCriacao: new Date().toISOString()
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
