import { NextApiRequest, NextApiResponse } from 'next';
import { Setor, PaginatedResponse, CreateSetorData } from '@/types';
import { getSetoresData, saveSetoresData, generateNewId } from '@/utils/storage';

/**
 * API endpoint para gerenciar setores
 * 
 * @description
 * Endpoints disponíveis:
 * - GET: Lista setores com suporte a paginação, busca e filtros
 * - POST: Cria um novo setor
 * 
 * @param req - Request object do Next.js
 * @param res - Response object do Next.js
 * 
 * @example
 * ```typescript
 * // GET /api/setores?page=1&limit=10&search=lab&categoria=Biologia&sortBy=nome&sortOrder=asc
 * // POST /api/setores - Criar setor
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
          categoria,
          ativo,
          sortBy = 'nome',
          sortOrder = 'asc',
          all = 'false'
        } = req.query;

        const allSetores = getSetoresData();
        let filteredSetores = [...allSetores];

        // Se "all=true", retornar todos os setores sem paginação
        if (all === 'true') {
          const response = {
            data: filteredSetores,
            total: filteredSetores.length
          };
          return res.status(200).json(response);
        }

        // Aplicar busca por nome ou descrição
        if (search && typeof search === 'string') {
          const searchTerm = search.toLowerCase();
          filteredSetores = filteredSetores.filter(setor =>
            setor.nome.toLowerCase().includes(searchTerm) ||
            (setor.descricao && setor.descricao.toLowerCase().includes(searchTerm)) ||
            setor.categoria.toLowerCase().includes(searchTerm)
          );
        }

        // Aplicar filtro por categoria
        if (categoria && typeof categoria === 'string') {
          filteredSetores = filteredSetores.filter(setor => setor.categoria === categoria);
        }

        // Aplicar filtro por status ativo/inativo
        if (ativo !== undefined && typeof ativo === 'string') {
          const isAtivo = ativo === 'true';
          filteredSetores = filteredSetores.filter(setor => setor.ativo === isAtivo);
        }

        // Aplicar ordenação
        if (typeof sortBy === 'string') {
          filteredSetores.sort((a, b) => {
            const aValue = String(a[sortBy as keyof Setor] || '');
            const bValue = String(b[sortBy as keyof Setor] || '');
            
            const comparison = aValue.localeCompare(bValue);
            return sortOrder === 'desc' ? -comparison : comparison;
          });
        }

        // Aplicar paginação
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const offset = (pageNum - 1) * limitNum;
        const paginatedSetores = filteredSetores.slice(offset, offset + limitNum);

        const response: PaginatedResponse<Setor> = {
          data: paginatedSetores,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: filteredSetores.length,
            totalPages: Math.ceil(filteredSetores.length / limitNum)
          },
          sorting: {
            sortBy: sortBy as string,
            sortOrder: sortOrder as 'asc' | 'desc'
          }
        };

        res.status(200).json(response);
      } catch (error) {
        console.error('Erro ao carregar setores:', error);
        res.status(500).json({ message: 'Erro ao carregar setores' });
      }
      break;

    case 'POST':
      try {
        const setorData: CreateSetorData = req.body;
        
        // Validação básica
        if (!setorData.nome || !setorData.categoria) {
          return res.status(400).json({ 
            message: 'Nome e categoria são obrigatórios' 
          });
        }

        const allSetores = getSetoresData();
        
        // Verificar se já existe um setor com o mesmo nome
        const existingSetor = allSetores.find(
          setor => setor.nome.toLowerCase() === setorData.nome.toLowerCase()
        );
        
        if (existingSetor) {
          return res.status(409).json({ 
            message: 'Já existe um setor com este nome' 
          });
        }

        // Gerar novo ID
        const newId = generateNewId(allSetores.map(s => s.id));
        
        // Criar novo setor com dados padrão
        const newSetor: Setor = {
          id: newId,
          nome: setorData.nome,
          categoria: setorData.categoria,
          descricao: setorData.descricao || '',
          ativo: setorData.ativo !== undefined ? setorData.ativo : true,
          dataCriacao: new Date().toISOString(),
          dataAtualizacao: new Date().toISOString(),
          equipamentosCount: 0
        };
        
        allSetores.push(newSetor);
        
        // Salvar de volta no arquivo
        saveSetoresData(allSetores);
        
        res.status(201).json(newSetor);
      } catch (error) {
        console.error('Erro ao criar setor:', error);
        res.status(500).json({ message: 'Erro ao criar setor' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
