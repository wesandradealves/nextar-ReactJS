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
    permissions: [PerfilUsuario.PESQUISADOR, PerfilUsuario.AGENTE, PerfilUsuario.GESTAO]
  },
  {
    href: '/dashboard/chamados',
    label: 'Chamados',
    permissions: [PerfilUsuario.PESQUISADOR, PerfilUsuario.AGENTE, PerfilUsuario.GESTAO]
  },
  {
    href: '/dashboard/usuarios',
    label: 'Usuários',
    icon: '',
    permissions: [PerfilUsuario.GESTAO]
  },
  {
    href: '/dashboard/setores',
    label: 'Setores',
    icon: '',
    permissions: [PerfilUsuario.GESTAO]
  },
  {
    href: '/dashboard/equipamentos',
    label: 'Equipamentos',
    icon: '',
    permissions: [PerfilUsuario.GESTAO]
  },
  {
    href: '/dashboard/historico',
    label: 'Histórico',
    icon: '',
    permissions: [PerfilUsuario.GESTAO]
  }
];
