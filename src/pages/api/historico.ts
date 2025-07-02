import { NextApiRequest, NextApiResponse } from 'next';
import { getChamadosData, getUsersData, getEquipamentosData, getSetoresData } from '@/utils/storage';
import { ChamadoStatus, TipoManutencao } from '@/utils/enums';

/**
 * API endpoint para histórico de manutenções
 * 
 * @description
 * Endpoints disponíveis:
 * - GET: Lista histórico completo de manutenções com filtros avançados
 * 
 * Filtros suportados:
 * - tipo: TipoManutencao (corretiva, preventiva)
 * - status: ChamadoStatus (opcional - por padrão só concluídos)
 * - agenteId: ID do agente responsável
 * - equipamentoId: ID do equipamento
 * - setorId: ID do setor
 * - dataInicio: Data de início do período (ISO string)
 * - dataFim: Data de fim do período (ISO string)
 * - page: Página atual (padrão: 1)
 * - limit: Items por página (padrão: 50)
 * 
 * @param req - Request object do Next.js
 * @param res - Response object do Next.js
 * 
 * @example
 * ```
 * GET /api/historico?tipo=corretiva&agenteId=123&dataInicio=2025-01-01&dataFim=2025-12-31
 * ```
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const {
      tipo,
      status,
      agenteId,
      equipamentoId, 
      setorId,
      dataInicio,
      dataFim,
      page = '1',
      limit = '50'
    } = req.query;

    // Carregar dados necessários
    const chamados = getChamadosData();
    const usuarios = getUsersData();
    const equipamentos = getEquipamentosData();
    const setores = getSetoresData();

    if (!Array.isArray(chamados)) {
      return res.status(500).json({ message: 'Erro ao carregar dados de chamados' });
    }

    // Filtrar apenas chamados concluídos por padrão (histórico)
    let filteredChamados = status ? 
      chamados.filter(c => c.status === status) :
      chamados.filter(c => c.status === ChamadoStatus.CONCLUIDO);

    // ** ESTATÍSTICAS GLOBAIS (INDEPENDENTES DOS FILTROS) **
    // Calcular estatísticas com base em TODOS os chamados, não apenas os filtrados
    const todosChamados = chamados.filter(c => c.status === ChamadoStatus.CONCLUIDO);
    
    const estatisticasGlobais = {
      total: todosChamados.length,
      porTipo: {
        [TipoManutencao.CORRETIVA]: todosChamados.filter(c => c.tipo === TipoManutencao.CORRETIVA).length,
        [TipoManutencao.PREVENTIVA]: todosChamados.filter(c => c.tipo === TipoManutencao.PREVENTIVA).length
      },
      porStatus: {
        [ChamadoStatus.ABERTO]: chamados.filter(c => c.status === ChamadoStatus.ABERTO).length,
        [ChamadoStatus.EM_PROGRESSO]: chamados.filter(c => c.status === ChamadoStatus.EM_PROGRESSO).length,
        [ChamadoStatus.CONCLUIDO]: chamados.filter(c => c.status === ChamadoStatus.CONCLUIDO).length
      },
      tempoMedioExecucao: todosChamados
        .filter(c => c.dataExecucao && c.dataAbertura)
        .reduce((acc, c) => {
          const tempo = Math.ceil((new Date(c.dataExecucao!).getTime() - new Date(c.dataAbertura!).getTime()) / (1000 * 60 * 60 * 24));
          return acc + tempo;
        }, 0) / Math.max(1, todosChamados.filter(c => c.dataExecucao && c.dataAbertura).length)
    };

    // Aplicar filtros
    if (tipo) {
      filteredChamados = filteredChamados.filter(c => c.tipo === tipo);
    }

    if (agenteId) {
      if (agenteId === 'sem_agente') {
        filteredChamados = filteredChamados.filter(c => !c.agenteId);
      } else {
        filteredChamados = filteredChamados.filter(c => c.agenteId === agenteId);
      }
    }

    if (equipamentoId) {
      filteredChamados = filteredChamados.filter(c => c.equipamentoId === equipamentoId);
    }

    if (setorId) {
      filteredChamados = filteredChamados.filter(c => c.setorId === setorId);
    }

    // Filtro por período
    if (dataInicio || dataFim) {
      filteredChamados = filteredChamados.filter(c => {
        // Usar dataExecucao para histórico, fallback para dataAbertura
        const dataReferencia = c.dataExecucao || c.dataAbertura;
        if (!dataReferencia) return false;

        const dataChamado = new Date(dataReferencia);
        
        if (dataInicio) {
          const inicio = new Date(dataInicio as string);
          if (dataChamado < inicio) return false;
        }
        
        if (dataFim) {
          const fim = new Date(dataFim as string);
          fim.setHours(23, 59, 59, 999); // Incluir o dia inteiro
          if (dataChamado > fim) return false;
        }
        
        return true;
      });
    }

    // Ordenar por data de execução/abertura (mais recente primeiro)
    filteredChamados.sort((a, b) => {
      const dataA = new Date(a.dataExecucao || a.dataAbertura || 0);
      const dataB = new Date(b.dataExecucao || b.dataAbertura || 0);
      return dataB.getTime() - dataA.getTime();
    });

    // Paginação
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 50;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedChamados = filteredChamados.slice(startIndex, endIndex);

    // Enriquecer dados com informações relacionadas
    const enrichedChamados = paginatedChamados.map(chamado => {
      // Buscar agente
      const agente = Array.isArray(usuarios) ? 
        usuarios.find(u => u.id === chamado.agenteId) : null;
      
      // Buscar solicitante
      const solicitante = Array.isArray(usuarios) ? 
        usuarios.find(u => u.id === chamado.solicitanteId) : null;
      
      // Buscar equipamento
      const equipamento = Array.isArray(equipamentos) ? 
        equipamentos.find(e => e.id === chamado.equipamentoId) : null;
      
      // Buscar setor
      const setor = Array.isArray(setores) ? 
        setores.find(s => s.id === chamado.setorId) : null;

      return {
        ...chamado,
        // Dados enriquecidos
        agenteNome: agente?.nome || 'Não atribuído',
        solicitanteNome: solicitante?.nome || 'N/A',
        equipamentoNome: equipamento?.nome || 'Local/Instalação',
        equipamentoCodigo: equipamento?.codigo || '',
        setorNome: setor?.nome || 'N/A',
        setorCategoria: setor?.categoria || 'N/A',
        // Informações de tempo
        tempoExecucao: chamado.dataExecucao && chamado.dataAbertura ? 
          Math.ceil((new Date(chamado.dataExecucao).getTime() - new Date(chamado.dataAbertura).getTime()) / (1000 * 60 * 60 * 24)) : null
      };
    });

    const response = {
      data: enrichedChamados,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredChamados.length,
        totalPages: Math.ceil(filteredChamados.length / limitNum)
      },
      estatisticas: estatisticasGlobais, // Usar estatísticas globais em vez das filtradas
      filtros: {
        tipo,
        status,
        agenteId,
        equipamentoId,
        setorId,
        dataInicio,
        dataFim
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    res.status(500).json({ message: 'Erro ao carregar histórico de manutenções' });
  }
}
