import { NextApiRequest, NextApiResponse } from 'next';
import { Chamado } from '@/types';
import { getChamadosData, saveChamadosData, generateNewId } from '@/utils/storage';

/**
 * API endpoint para gerenciar chamados
 * 
 * @description
 * Endpoints disponíveis:
 * - GET: Lista chamados com filtros opcionais (status, agenteId, tipo)
 * - POST: Cria um novo chamado
 * - PUT: Atualiza um chamado existente
 * - DELETE: Remove um chamado
 * 
 * @param req - Request object do Next.js
 * @param res - Response object do Next.js
 * 
 * @example
 * ```typescript
 * // GET /api/chamados?status=ABERTO - Listar chamados abertos
 * const response = await fetch('/api/chamados?status=ABERTO');
 * const chamados = await response.json();
 * 
 * // POST /api/chamados - Criar chamado
 * const response = await fetch('/api/chamados', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     titulo: 'Problema no equipamento',
 *     descricao: 'Equipamento não liga',
 *     solicitanteId: '1',
 *     equipamentoId: '1',
 *     prioridade: 'ALTA'
 *   })
 * });
 * ```
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const chamados = getChamadosData();
        const { status, agenteId, tipo, setorId } = req.query;

        // Aplicar filtros se especificados
        let filteredChamados = chamados;
        
        if (status && typeof status === 'string') {
          filteredChamados = filteredChamados.filter(c => c.status === status);
        }
        
        if (agenteId && typeof agenteId === 'string') {
          filteredChamados = filteredChamados.filter(c => c.agenteId === agenteId);
        }
        
        if (tipo && typeof tipo === 'string') {
          filteredChamados = filteredChamados.filter(c => c.tipo === tipo);
        }

        if (setorId && typeof setorId === 'string') {
          filteredChamados = filteredChamados.filter(c => c.setorId === setorId);
        }

        res.status(200).json(filteredChamados);
      } catch {
        res.status(500).json({ message: 'Erro ao carregar chamados' });
      }
      break;

    case 'POST':
      try {
        const newChamado: Omit<Chamado, 'id' | 'dataAbertura'> = req.body;
        const chamados = getChamadosData();
        
        // Gerar novo ID e data de abertura
        const newId = generateNewId(chamados.map(c => c.id));
        const chamadoWithId = { 
          ...newChamado, 
          id: newId,
          dataAbertura: new Date().toISOString()
        } as Chamado;
        
        chamados.push(chamadoWithId);
        saveChamadosData(chamados);
        
        res.status(201).json(chamadoWithId);
      } catch {
        res.status(500).json({ message: 'Erro ao criar chamado' });
      }
      break;

    case 'PUT':
      // PUT agora está na rota /api/chamados/[id]
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ message: `Use /api/chamados/[id] para atualizar chamados` });
      break;

    case 'DELETE':
      // DELETE agora está na rota /api/chamados/[id]
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ message: `Use /api/chamados/[id] para deletar chamados` });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
