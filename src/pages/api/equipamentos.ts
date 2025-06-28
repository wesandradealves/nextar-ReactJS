import { NextApiRequest, NextApiResponse } from 'next';
import { Equipamento } from '@/types';
import { getEquipamentosData, saveEquipamentosData, generateNewId } from '@/utils/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const equipamentos = getEquipamentosData();
        const { setorId } = req.query;

        // Filtrar por setor se especificado
        let filteredEquipamentos = equipamentos;
        if (setorId && typeof setorId === 'string') {
          filteredEquipamentos = equipamentos.filter(eq => eq.setorId === setorId);
        }

        res.status(200).json(filteredEquipamentos);
      } catch {
        res.status(500).json({ message: 'Erro ao carregar equipamentos' });
      }
      break;

    case 'POST':
      try {
        const newEquipamento: Omit<Equipamento, 'id'> = req.body;
        const equipamentos = getEquipamentosData();
        
        // Gerar novo ID
        const newId = generateNewId(equipamentos.map(e => e.id));
        const equipamentoWithId: Equipamento = { ...newEquipamento, id: newId };
        
        equipamentos.push(equipamentoWithId);
        
        // Salvar de volta no arquivo
        saveEquipamentosData(equipamentos);
        
        res.status(201).json(equipamentoWithId);
      } catch {
        res.status(500).json({ message: 'Erro ao criar equipamento' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
