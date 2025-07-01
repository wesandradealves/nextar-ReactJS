import { NextApiRequest, NextApiResponse } from 'next';
import { Setor, UpdateSetorData } from '@/types';
import { getSetoresData, saveSetoresData } from '@/utils/storage';

/**
 * API endpoint para operações individuais de setores
 * 
 * @description
 * Endpoints disponíveis:
 * - GET: Busca um setor específico pelo ID
 * - PUT: Atualiza um setor existente
 * - DELETE: Remove um setor
 * 
 * @param req - Request object do Next.js
 * @param res - Response object do Next.js
 * 
 * @example
 * ```typescript
 * // GET /api/setores/1 - Buscar setor
 * // PUT /api/setores/1 - Atualizar setor
 * // DELETE /api/setores/1 - Excluir setor
 * ```
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID do setor é obrigatório' });
  }

  switch (method) {
    case 'GET':
      try {
        const setores = getSetoresData();
        const setor = setores.find(s => s.id === id);
        
        if (!setor) {
          return res.status(404).json({ message: 'Setor não encontrado' });
        }
        
        res.status(200).json(setor);
      } catch (error) {
        console.error('Erro ao buscar setor:', error);
        res.status(500).json({ message: 'Erro ao buscar setor' });
      }
      break;

    case 'PUT':
      try {
        const updateData: UpdateSetorData = req.body;
        const setores = getSetoresData();
        const setorIndex = setores.findIndex(s => s.id === id);
        
        if (setorIndex === -1) {
          return res.status(404).json({ message: 'Setor não encontrado' });
        }

        const existingSetor = setores[setorIndex];

        // Validação de nome único (se nome está sendo alterado)
        if (updateData.nome && updateData.nome !== existingSetor.nome) {
          const duplicateSetor = setores.find(
            s => s.id !== id && s.nome.toLowerCase() === updateData.nome!.toLowerCase()
          );
          
          if (duplicateSetor) {
            return res.status(409).json({ 
              message: 'Já existe um setor com este nome' 
            });
          }
        }

        // Atualizar apenas os campos fornecidos
        const updatedSetor: Setor = {
          ...existingSetor,
          ...updateData,
          dataAtualizacao: new Date().toISOString()
        };

        setores[setorIndex] = updatedSetor;
        
        // Salvar no arquivo
        saveSetoresData(setores);
        
        res.status(200).json(updatedSetor);
      } catch (error) {
        console.error('Erro ao atualizar setor:', error);
        res.status(500).json({ message: 'Erro ao atualizar setor' });
      }
      break;

    case 'DELETE':
      try {
        const setores = getSetoresData();
        const setorIndex = setores.findIndex(s => s.id === id);
        
        if (setorIndex === -1) {
          return res.status(404).json({ message: 'Setor não encontrado' });
        }

        // Verificar se o setor pode ser excluído
        // (adicionar validações específicas se necessário, como equipamentos vinculados)
        
        setores.splice(setorIndex, 1);
        
        // Salvar no arquivo
        saveSetoresData(setores);
        
        res.status(200).json({ message: 'Setor excluído com sucesso' });
      } catch (error) {
        console.error('Erro ao excluir setor:', error);
        res.status(500).json({ message: 'Erro ao excluir setor' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
