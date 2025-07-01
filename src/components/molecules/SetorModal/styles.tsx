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
 * Container para seleção de categoria
 */
export const CategorySelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`;

/**
 * Opção de categoria clicável
 */
export const CategoryOption = styled.div<{ $selected: boolean; $color?: string }>`
  padding: 12px 16px;
  border: 2px solid ${({ $selected, $color }) => $selected ? ($color || '#3b82f6') : '#e5e7eb'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ $selected, $color }) => $selected ? `${$color || '#3b82f6'}08` : '#ffffff'};
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    border-color: ${({ $color }) => $color || '#3b82f6'};
    background-color: ${({ $color }) => `${$color || '#3b82f6'}08`};
  }

  &:focus {
    outline: 2px solid ${({ $color }) => $color || '#3b82f6'};
    outline-offset: 2px;
  }
`;

/**
 * Label da categoria
 */
export const CategoryLabel = styled.div`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

/**
 * Descrição da categoria
 */
export const CategoryDescription = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 2px;
`;

/**
 * Container para status ativo/inativo
 */
export const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

/**
 * Toggle switch para status
 */
export const StatusToggle = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  cursor: pointer;
`;

/**
 * Input do toggle (oculto)
 */
export const StatusInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #10b981;
  }

  &:checked + span:before {
    transform: translateX(20px);
  }
`;

/**
 * Slider visual do toggle
 */
export const StatusSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: 0.2s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.2s;
    border-radius: 50%;
  }
`;

/**
 * Label do status
 */
export const StatusLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

/**
 * Título do status
 */
export const StatusTitle = styled.div`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

/**
 * Descrição do status
 */
export const StatusText = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

/**
 * Container para textarea customizado
 */
export const TextareaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/**
 * Label para textarea
 */
export const TextareaLabel = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

/**
 * Texto de ajuda para textarea
 */
export const TextareaHelpText = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
`;
