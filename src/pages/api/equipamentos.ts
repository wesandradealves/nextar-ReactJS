import { NextApiRequest, NextApiResponse } from 'next';
import { Equipamento, PaginatedResponse, CreateEquipamentoData } from '@/types';
import { getEquipamentosData, saveEquipamentosData, generateNewId } from '@/utils/storage';

/**
 * API endpoint para gerenciar equipamentos
 * 
 * @description
 * Endpoints disponíveis:
 * - GET: Lista equipamentos com suporte a paginação, busca e filtros
 * - POST: Cria um novo equipamento
 * 
 * @param req - Request object do Next.js
 * @param res - Response object do Next.js
 * 
 * @example
 * ```typescript
 * // GET /api/equipamentos?page=1&limit=10&search=microscópio&setorId=1&sortBy=nome&sortOrder=asc
 * // POST /api/equipamentos - Criar equipamento
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
          setorId,
          ativo,
          sortBy = 'nome',
          sortOrder = 'asc',
          all = 'false'
        } = req.query;

        const allEquipamentos = getEquipamentosData();
        let filteredEquipamentos = [...allEquipamentos];

        // Se "all=true", retornar todos os equipamentos sem paginação
        if (all === 'true') {
          const response = {
            data: filteredEquipamentos,
            total: filteredEquipamentos.length
          };
          return res.status(200).json(response);
        }

        // Aplicar busca por nome, código ou modelo
        if (search && typeof search === 'string') {
          const searchTerm = search.toLowerCase();
          filteredEquipamentos = filteredEquipamentos.filter(equipamento =>
            equipamento.nome.toLowerCase().includes(searchTerm) ||
            equipamento.codigo.toLowerCase().includes(searchTerm) ||
            equipamento.modelo.toLowerCase().includes(searchTerm) ||
            (equipamento.observacoes && equipamento.observacoes.toLowerCase().includes(searchTerm))
          );
        }

        // Aplicar filtro por setor
        if (setorId && typeof setorId === 'string') {
          filteredEquipamentos = filteredEquipamentos.filter(equipamento => equipamento.setorId === setorId);
        }

        // Aplicar filtro por status ativo/inativo
        if (ativo !== undefined && typeof ativo === 'string') {
          const isAtivo = ativo === 'true';
          filteredEquipamentos = filteredEquipamentos.filter(equipamento => equipamento.ativo === isAtivo);
        }

        // Aplicar ordenação
        if (typeof sortBy === 'string') {
          filteredEquipamentos.sort((a, b) => {
            const aValue = String(a[sortBy as keyof Equipamento] || '');
            const bValue = String(b[sortBy as keyof Equipamento] || '');
            
            const comparison = aValue.localeCompare(bValue);
            return sortOrder === 'desc' ? -comparison : comparison;
          });
        }

        // Aplicar paginação
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const offset = (pageNum - 1) * limitNum;
        const paginatedEquipamentos = filteredEquipamentos.slice(offset, offset + limitNum);

        const response: PaginatedResponse<Equipamento> = {
          data: paginatedEquipamentos,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: filteredEquipamentos.length,
            totalPages: Math.ceil(filteredEquipamentos.length / limitNum)
          },
          sorting: {
            sortBy: sortBy as string,
            sortOrder: sortOrder as 'asc' | 'desc'
          }
        };

        res.status(200).json(response);
      } catch (error) {
        console.error('Erro ao buscar equipamentos:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Erro interno do servidor ao buscar equipamentos' 
        });
      }
      break;

    case 'POST':
      try {
        const equipamentoData: CreateEquipamentoData = req.body;

        // Validação dos dados obrigatórios
        if (!equipamentoData.nome || !equipamentoData.codigo || !equipamentoData.modelo || 
            !equipamentoData.setorId || !equipamentoData.proximaManutencao) {
          return res.status(400).json({ 
            success: false, 
            message: 'Campos obrigatórios: nome, código, modelo, setorId e proximaManutencao' 
          });
        }

        const allEquipamentos = getEquipamentosData();

        // Verificar se o código já existe
        const codigoExists = allEquipamentos.some(eq => 
          eq.codigo.toLowerCase() === equipamentoData.codigo.toLowerCase()
        );

        if (codigoExists) {
          return res.status(400).json({ 
            success: false, 
            message: 'Já existe um equipamento com este código' 
          });
        }

        // Validar formato hexadecimal do código (formato sugerido: AAA###X)
        const hexPattern = /^[A-Z]{3}\d{3}[A-Z]$/;
        if (!hexPattern.test(equipamentoData.codigo)) {
          return res.status(400).json({ 
            success: false, 
            message: 'Código deve seguir o formato hexadecimal (ex: BIO001A)' 
          });
        }

        // Validar data da próxima manutenção
        const proximaManutencao = new Date(equipamentoData.proximaManutencao);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Reset horas para comparação apenas de data

        if (proximaManutencao < hoje) {
          return res.status(400).json({ 
            success: false, 
            message: 'A data da próxima manutenção deve ser futura' 
          });
        }

        // Criar novo equipamento
        const novoEquipamento: Equipamento = {
          id: generateNewId(allEquipamentos.map(eq => eq.id)),
          nome: equipamentoData.nome.trim(),
          codigo: equipamentoData.codigo.toUpperCase().trim(),
          modelo: equipamentoData.modelo.trim(),
          setorId: equipamentoData.setorId,
          proximaManutencao: equipamentoData.proximaManutencao,
          observacoes: equipamentoData.observacoes?.trim() || '',
          ativo: equipamentoData.ativo ?? true,
          dataCriacao: new Date().toISOString(),
          dataAtualizacao: new Date().toISOString(),
          manutencaosCount: 0
        };

        // Salvar equipamentos atualizados
        const equipamentosAtualizados = [...allEquipamentos, novoEquipamento];
        saveEquipamentosData(equipamentosAtualizados);

        res.status(201).json({ 
          success: true, 
          data: novoEquipamento,
          message: 'Equipamento criado com sucesso' 
        });
      } catch (error) {
        console.error('Erro ao criar equipamento:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Erro interno do servidor ao criar equipamento' 
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ 
        success: false, 
        message: `Método ${method} não permitido` 
      });
      break;
  }
}
