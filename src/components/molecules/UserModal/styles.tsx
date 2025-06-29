import styled from 'styled-components';

/**
 * Container principal do formulário
 */
export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/**
 * Grupo de campos relacionados
 */
export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/**
 * Container para seleção de perfil
 */
export const ProfileSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`;

/**
 * Opção de perfil clicável
 */
export const ProfileOption = styled.div<{ $selected: boolean; $color: string }>`
  padding: 16px;
  border: 2px solid ${({ $selected, $color }) => $selected ? $color : '#e5e7eb'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ $selected, $color }) => $selected ? `${$color}08` : '#ffffff'};

  &:hover {
    border-color: ${({ $color }) => $color};
    background-color: ${({ $color }) => `${$color}08`};
  }

  &:focus {
    outline: 2px solid ${({ $color }) => $color};
    outline-offset: 2px;
  }
`;

/**
 * Label do perfil
 */
export const ProfileLabel = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #111827;
  margin-bottom: 4px;
`;

/**
 * Descrição do perfil
 */
export const ProfileDescription = styled.div`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
`;
