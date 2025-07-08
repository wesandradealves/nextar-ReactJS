import { NextApiRequest, NextApiResponse } from 'next';
import { Chamado, UpdateChamadoData } from '@/types';
import { getChamadosData, saveChamadosData } from '@/utils/storage';

/**
 * API endpoint para operações com chamado individual
 * 
 * @description
 * Endpoints disponíveis:
 * - GET: Busca chamado por ID
 * - PUT: Atualiza chamado por ID
 * - DELETE: Remove chamado por ID
 * 
 * @param req - Request object do Next.js
 * @param res - Response object do Next.js
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID do chamado é obrigatório' });
  }

  const chamados = getChamadosData();
  const chamadoIndex = chamados.findIndex(chamado => chamado.id === id);

  if (chamadoIndex === -1) {
    return res.status(404).json({ message: 'Chamado não encontrado' });
  }

  switch (method) {
    case 'GET':
      try {
        res.status(200).json(chamados[chamadoIndex]);
      } catch (error) {
        console.error('Erro ao buscar chamado:', error);
        res.status(500).json({ message: 'Erro ao buscar chamado' });
      }
      break;

    case 'PUT':
      try {
        const updateData: UpdateChamadoData = req.body;

        if (updateData.descricao !== undefined && !updateData.descricao.trim()) {
          return res.status(400).json({ message: 'Descrição não pode estar vazia' });
        }
        if (updateData.setorId !== undefined && !updateData.setorId.trim()) {
          return res.status(400).json({ message: 'Setor é obrigatório' });
        }

        const updatedChamado: Chamado = {
          ...chamados[chamadoIndex],
          ...updateData,
          dataAtualizacao: new Date().toISOString()
        };

        chamados[chamadoIndex] = updatedChamado;
        saveChamadosData(chamados);

        res.status(200).json(updatedChamado);

      } catch (error) {
        console.error('Erro ao atualizar chamado:', error);
        res.status(500).json({ message: 'Erro ao atualizar chamado' });
      }
      break;

    case 'DELETE':
      try {
        const deletedChamado = chamados[chamadoIndex];
        chamados.splice(chamadoIndex, 1);
        saveChamadosData(chamados);
        res.status(200).json({ 
          message: 'Chamado removido com sucesso',
          deletedChamado 
        });

      } catch (error) {
        console.error('Erro ao remover chamado:', error);
        res.status(500).json({ message: 'Erro ao remover chamado' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
      break;
  }
}
