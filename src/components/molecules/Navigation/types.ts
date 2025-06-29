import { PerfilUsuario } from '@/utils/enums';

export interface NavItem {
  href: string;
  label: string;
  icon?: string;
  permissions?: PerfilUsuario[];
  active?: boolean;
}

export interface NavigationProps {
  items: NavItem[];
  currentPath?: string;
  userProfile?: PerfilUsuario;
  isMobile?: boolean;
  isOpen?: boolean;
  onItemClick?: (item: NavItem) => void;
  className?: string;
}
