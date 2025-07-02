import { NextApiRequest, NextApiResponse } from 'next';
import { getChamadosData, getUsersData, getEquipamentosData } from '@/utils/storage';
import { ChamadoStatus, TipoManutencao } from '@/utils/enums';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const chamados = getChamadosData();
    const usuarios = getUsersData();
    const equipamentos = getEquipamentosData();
    
    // Calcular estatísticas do dashboard
    const stats = {
      // Dados de chamados
      totalChamados: Array.isArray(chamados) ? chamados.length : 0,
      chamadosAbertos: Array.isArray(chamados) ? chamados.filter(c => c.status === ChamadoStatus.ABERTO).length : 0,
      chamadosEmProgresso: Array.isArray(chamados) ? chamados.filter(c => c.status === ChamadoStatus.EM_PROGRESSO).length : 0,
      chamadosConcluidos: Array.isArray(chamados) ? chamados.filter(c => c.status === ChamadoStatus.CONCLUIDO).length : 0,
      chamadosResolvidos: Array.isArray(chamados) ? chamados.filter(c => c.status === ChamadoStatus.CONCLUIDO).length : 0, 
      chamadosCorretivos: Array.isArray(chamados) ? chamados.filter(c => c.tipo === TipoManutencao.CORRETIVA).length : 0,
      chamadosPreventivos: Array.isArray(chamados) ? chamados.filter(c => c.tipo === TipoManutencao.PREVENTIVA).length : 0,
      
      // Dados de usuários
      totalUsuarios: Array.isArray(usuarios) ? usuarios.length : 0,
      usuariosAtivos: Array.isArray(usuarios) ? usuarios.filter(u => u.ativo === true).length : 0,
      
      // Dados de equipamentos
      totalEquipamentos: Array.isArray(equipamentos) ? equipamentos.length : 0,
      
      // Distribuição por status (para gráficos)
      distribucaoStatus: {
        [ChamadoStatus.ABERTO]: Array.isArray(chamados) ? chamados.filter(c => c.status === ChamadoStatus.ABERTO).length : 0,
        [ChamadoStatus.EM_PROGRESSO]: Array.isArray(chamados) ? chamados.filter(c => c.status === ChamadoStatus.EM_PROGRESSO).length : 0,
        [ChamadoStatus.CONCLUIDO]: Array.isArray(chamados) ? chamados.filter(c => c.status === ChamadoStatus.CONCLUIDO).length : 0
      },
      
      // Distribuição por tipo (para gráficos)
      distribucaoTipo: {
        [TipoManutencao.CORRETIVA]: Array.isArray(chamados) ? chamados.filter(c => c.tipo === TipoManutencao.CORRETIVA).length : 0,
        [TipoManutencao.PREVENTIVA]: Array.isArray(chamados) ? chamados.filter(c => c.tipo === TipoManutencao.PREVENTIVA).length : 0
      },
      
      // Distribuição por agente (para gráficos)
      distribucaoAgente: Array.isArray(chamados) && Array.isArray(usuarios) ? 
        usuarios
          .filter(u => u.perfil === 'agente' && u.ativo)
          .map(agente => ({
            agenteId: agente.id,
            nomeAgente: agente.nome,
            quantidade: chamados.filter(c => c.agenteId === agente.id).length,
            quantidadeConcluidos: chamados.filter(c => c.agenteId === agente.id && c.status === ChamadoStatus.CONCLUIDO).length
          }))
          .sort((a, b) => b.quantidade - a.quantidade) // Ordenar por quantidade decrescente
        : []
    };

    res.status(200).json({ 
      stats,
      distribucaoTipo: stats.distribucaoTipo,
      distribucaoAgente: stats.distribucaoAgente
    });
  } catch {
    res.status(500).json({ message: 'Erro ao carregar estatísticas do dashboard' });
  }
}
