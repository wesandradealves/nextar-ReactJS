import styled from 'styled-components';

/**
 * Estilos para o UserModal
 * 
 * @version 1.0.0
 * @description
 * Migrado para o padrão híbrido Tailwind + styled-components.
 * Mantido apenas o essencial como styled-components para
 * comportamentos dinâmicos, o resto migrado para Tailwind.
 */

/**
 * Container para campos de formulário
 * Convertido para Tailwind
 * @deprecated - Use Tailwind classes instead
 */
// export const FormFieldsContainer = styled.div``;

/**
 * Container para informações do usuário
 * Convertido para Tailwind
 * @deprecated - Use Tailwind classes instead
 */
// export const UserInfoContainer = styled.div``;

/**
 * Container para seleção de perfil
 * Convertido para Tailwind
 * @deprecated - Use Tailwind classes instead
 */
// export const ProfileSelectionContainer = styled.div``;

/**
 * Container para campos de senha
 * Convertido para Tailwind
 * @deprecated - Use Tailwind classes instead
 */
// export const PasswordFieldsContainer = styled.div``;

/**
 * Container para campo de setor
 * Convertido para Tailwind
 * @deprecated - Use Tailwind classes instead
 */
// export const SectorFieldContainer = styled.div``;

/**
 * Container para alteração de senha
 * Mantido para transição e animação
 */
export const PasswordToggleContainer = styled.div<{ $visible: boolean }>`
  max-height: ${({ $visible }) => $visible ? '200px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, margin 0.3s ease-in-out;
  opacity: ${({ $visible }) => $visible ? '1' : '0'};
  margin-top: ${({ $visible }) => $visible ? '16px' : '0'};
`;

/**
 * Mensagem de validação
 * Mantido para cor dinâmica baseada em status
 */
export const ValidationMessage = styled.div<{ $type: 'error' | 'success' | 'warning' | 'info' }>`
  color: ${({ $type }) => {
    switch ($type) {
      case 'error': return '#ef4444';
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
`;
