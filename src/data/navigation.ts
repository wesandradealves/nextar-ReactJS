import { PerfilUsuario } from '@/utils/enums';
import type { NavItem } from '@/components/molecules/Navigation/types';

/**
 * Configuração dos itens de navegação com permissões
 */
export const navigationItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: '',
    // Todos os perfis podem acessar
    permissions: [PerfilUsuario.PESQUISADOR, PerfilUsuario.AGENTE, PerfilUsuario.GESTAO]
  },
  {
    href: '/chamados',
    label: 'Chamados',
    icon: '',
    // Todos os perfis podem acessar
    permissions: [PerfilUsuario.PESQUISADOR, PerfilUsuario.AGENTE, PerfilUsuario.GESTAO]
  },
  {
    href: '/equipamentos',
    label: 'Equipamentos',
    icon: '',
    // Todos os perfis podem acessar
    permissions: [PerfilUsuario.PESQUISADOR, PerfilUsuario.AGENTE, PerfilUsuario.GESTAO]
  },
  {
    href: '/setores',
    label: 'Setores',
    icon: '',
    // Todos os perfis podem acessar
    permissions: [PerfilUsuario.PESQUISADOR, PerfilUsuario.AGENTE, PerfilUsuario.GESTAO]
  },
  {
    href: '/usuarios',
    label: 'Usuários',
    icon: '',
    // Apenas gestão pode gerenciar usuários
    permissions: [PerfilUsuario.GESTAO]
  },
  {
    href: '/relatorios',
    label: 'Relatórios',
    icon: '',
    // Apenas gestão pode ver relatórios completos
    permissions: [PerfilUsuario.GESTAO]
  }
];
