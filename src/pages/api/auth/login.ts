import { NextApiRequest, NextApiResponse } from 'next';
import { getUsersData } from '@/utils/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const users = getUsersData();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Simulação simples de validação de senha
    if (password.length < 3) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Simular token (em produção seria JWT real)
    const token = `mock-token-${user.id}-${Date.now()}`;

    res.status(200).json({
      user,
      token,
      message: 'Login realizado com sucesso'
    });

  } catch {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
