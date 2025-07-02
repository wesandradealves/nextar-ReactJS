import { NextApiRequest, NextApiResponse } from 'next';
import { Equipamento, UpdateEquipamentoData } from '@/types';
import { getEquipamentosData, saveEquipamentosData } from '@/utils/storage';

/**
 * API endpoint para operações individuais de equipamentos
 * 
 * @description
 * Endpoints disponíveis:
 * - GET: Busca um equipamento específico por ID
 * - PUT: Atualiza um equipamento existente
 * - DELETE: Remove um equipamento do sistema
 * 
 * @param req - Request object do Next.js
 * @param res - Response object do Next.js
 * 
 * @example
 * ```typescript
 * // GET /api/equipamentos/[id] - Buscar equipamento
 * // PUT /api/equipamentos/[id] - Atualizar equipamento
 * // DELETE /api/equipamentos/[id] - Excluir equipamento
 * ```
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const { id } = query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ 
      success: false, 
      message: 'ID do equipamento é obrigatório' 
    });
  }

  const allEquipamentos = getEquipamentosData();
  const equipamentoIndex = allEquipamentos.findIndex(eq => eq.id === id);

  if (equipamentoIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Equipamento não encontrado' 
    });
  }

  switch (method) {
    case 'GET':
      try {
        const equipamento = allEquipamentos[equipamentoIndex];
        
        res.status(200).json({ 
          success: true, 
          data: equipamento 
        });
      } catch (error) {
        console.error('Erro ao buscar equipamento:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Erro interno do servidor ao buscar equipamento' 
        });
      }
      break;

    case 'PUT':
      try {
        const updateData: UpdateEquipamentoData = req.body;
        const equipamentoAtual = allEquipamentos[equipamentoIndex];

        // Validação de campos obrigatórios (se fornecidos)
        if (updateData.codigo && updateData.codigo.trim() === '') {
          return res.status(400).json({ 
            success: false, 
            message: 'Código não pode estar vazio' 
          });
        }

        if (updateData.nome && updateData.nome.trim() === '') {
          return res.status(400).json({ 
            success: false, 
            message: 'Nome não pode estar vazio' 
          });
        }

        if (updateData.modelo && updateData.modelo.trim() === '') {
          return res.status(400).json({ 
            success: false, 
            message: 'Modelo não pode estar vazio' 
          });
        }

        // Verificar se o código já existe em outro equipamento
        if (updateData.codigo) {
          const codigoExists = allEquipamentos.some(eq => 
            eq.id !== id && eq.codigo.toLowerCase() === updateData.codigo!.toLowerCase()
          );

          if (codigoExists) {
            return res.status(400).json({ 
              success: false, 
              message: 'Já existe outro equipamento com este código' 
            });
          }

          // Validar formato hexadecimal do código
          const hexPattern = /^[A-Z]{3}\d{3}[A-Z]$/;
          if (!hexPattern.test(updateData.codigo)) {
            return res.status(400).json({ 
              success: false, 
              message: 'Código deve seguir o formato hexadecimal (ex: BIO001A)' 
            });
          }
        }

        // Validar data da próxima manutenção
        if (updateData.proximaManutencao) {
          const proximaManutencao = new Date(updateData.proximaManutencao);
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0); // Reset horas para comparação apenas de data

          if (proximaManutencao < hoje) {
            return res.status(400).json({ 
              success: false, 
              message: 'A data da próxima manutenção deve ser futura' 
            });
          }
        }

        // Atualizar equipamento
        const equipamentoAtualizado: Equipamento = {
          ...equipamentoAtual,
          ...updateData,
          id, // Manter o ID original
          nome: updateData.nome?.trim() || equipamentoAtual.nome,
          codigo: updateData.codigo?.toUpperCase().trim() || equipamentoAtual.codigo,
          modelo: updateData.modelo?.trim() || equipamentoAtual.modelo,
          observacoes: updateData.observacoes?.trim() ?? equipamentoAtual.observacoes,
          dataAtualizacao: new Date().toISOString()
        };

        // Salvar no array
        allEquipamentos[equipamentoIndex] = equipamentoAtualizado;
        saveEquipamentosData(allEquipamentos);

        res.status(200).json({ 
          success: true, 
          data: equipamentoAtualizado,
          message: 'Equipamento atualizado com sucesso' 
        });
      } catch (error) {
        console.error('Erro ao atualizar equipamento:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Erro interno do servidor ao atualizar equipamento' 
        });
      }
      break;

    case 'DELETE':
      try {
        const equipamento = allEquipamentos[equipamentoIndex];

        // Remover equipamento do array
        allEquipamentos.splice(equipamentoIndex, 1);
        saveEquipamentosData(allEquipamentos);

        res.status(200).json({ 
          success: true, 
          data: equipamento,
          message: `Equipamento "${equipamento.nome}" excluído com sucesso` 
        });
      } catch (error) {
        console.error('Erro ao excluir equipamento:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Erro interno do servidor ao excluir equipamento' 
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ 
        success: false, 
        message: `Método ${method} não permitido` 
      });
      break;
  }
}
