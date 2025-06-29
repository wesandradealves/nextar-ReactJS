/**
 * Tipos para o componente UserCard
 */

import { PerfilUsuario } from '@/utils/enums';

export interface UserCardProps {
  /** Nome do usuário */
  name: string;
  /** Email do usuário */
  email?: string;
  /** Perfil/função do usuário */
  profile: PerfilUsuario;
  /** URL do avatar (opcional, gera iniciais se não fornecido) */
  avatar?: string;
  /** Se o usuário está online */
  isOnline?: boolean;
  /** Tamanho do card */
  size?: 'small' | 'medium' | 'large';
  /** Se o card é clicável */
  clickable?: boolean;
  /** Função executada ao clicar */
  onClick?: () => void;
  /** Classes CSS adicionais */
  className?: string;
}
