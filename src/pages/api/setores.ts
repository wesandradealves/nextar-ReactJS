import { NextApiRequest, NextApiResponse } from 'next';
import { Setor } from '@/types';
import { getSetoresData, saveSetoresData, generateNewId } from '@/utils/storage';

/**
 * API endpoint para gerenciar setores
 * 
 * @description
 * Endpoints disponíveis:
 * - GET: Lista todos os setores
 * - POST: Cria um novo setor
 * 
 * @param req - Request object do Next.js
 * @param res - Response object do Next.js
 * 
 * @example
 * ```typescript
 * // GET /api/setores - Listar setores
 * const response = await fetch('/api/setores');
 * const setores = await response.json();
 * 
 * // POST /api/setores - Criar setor
 * const response = await fetch('/api/setores', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     nome: 'Recursos Humanos',
 *     sigla: 'RH',
 *     responsavel: 'Maria Silva'
 *   })
 * });
 * ```
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const setores = getSetoresData();
        res.status(200).json(setores);
      } catch {
        res.status(500).json({ message: 'Erro ao carregar setores' });
      }
      break;

    case 'POST':
      try {
        const newSetor: Omit<Setor, 'id'> = req.body;
        const setores = getSetoresData();
        
        // Gerar novo ID
        const newId = generateNewId(setores.map(s => s.id));
        const setorWithId: Setor = { ...newSetor, id: newId };
        
        setores.push(setorWithId);
        
        // Salvar de volta no arquivo
        saveSetoresData(setores);
        
        res.status(201).json(setorWithId);
      } catch {
        res.status(500).json({ message: 'Erro ao criar setor' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
