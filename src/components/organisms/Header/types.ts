/**
 * Tipos para o componente Header
 */

import { PerfilUsuario } from '@/utils/enums';

export interface HeaderProps {
  /** Nome do usuário logado */
  userName: string;
  /** Email do usuário logado */
  userEmail?: string;
  /** Perfil do usuário logado */
  userProfile: PerfilUsuario;
  /** Se o usuário está online */
  isOnline?: boolean;
  /** Se está fazendo logout (para estados de loading) */
  isLoggingOut?: boolean;
  /** Função executada ao fazer logout */
  onLogout?: () => void;
  /** Função executada ao clicar no perfil */
  onProfileClick?: () => void;
  /** Classes CSS adicionais */
  className?: string;
}
