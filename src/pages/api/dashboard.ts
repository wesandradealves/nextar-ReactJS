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
      totalChamados: chamados.length,
      chamadosAbertos: chamados.filter(c => c.status === ChamadoStatus.ABERTO).length,
      chamadosEmProgresso: chamados.filter(c => c.status === ChamadoStatus.EM_PROGRESSO).length,
      chamadosConcluidos: chamados.filter(c => c.status === ChamadoStatus.CONCLUIDO).length,
      chamadosResolvidos: chamados.filter(c => c.status === ChamadoStatus.CONCLUIDO).length, 
      chamadosCorretivos: chamados.filter(c => c.tipo === TipoManutencao.CORRETIVA).length,
      chamadosPreventivos: chamados.filter(c => c.tipo === TipoManutencao.PREVENTIVA).length,
      
      // Dados de usuários
      totalUsuarios: usuarios.length,
      usuariosAtivos: usuarios.filter(u => u.ativo === true).length,
      
      // Dados de equipamentos
      totalEquipamentos: equipamentos.length,
      
      // Distribuição por status (para gráficos)
      distribucaoStatus: {
        [ChamadoStatus.ABERTO]: chamados.filter(c => c.status === ChamadoStatus.ABERTO).length,
        [ChamadoStatus.EM_PROGRESSO]: chamados.filter(c => c.status === ChamadoStatus.EM_PROGRESSO).length,
        [ChamadoStatus.CONCLUIDO]: chamados.filter(c => c.status === ChamadoStatus.CONCLUIDO).length
      },
      
      // Distribuição por tipo (para gráficos)
      distribucaoTipo: {
        [TipoManutencao.CORRETIVA]: chamados.filter(c => c.tipo === TipoManutencao.CORRETIVA).length,
        [TipoManutencao.PREVENTIVA]: chamados.filter(c => c.tipo === TipoManutencao.PREVENTIVA).length
      }
    };

    res.status(200).json({ stats });
  } catch {
    res.status(500).json({ message: 'Erro ao carregar estatísticas do dashboard' });
  }
}
