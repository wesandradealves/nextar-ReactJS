import styled from 'styled-components';

/**
 * Estilos padronizados para modais de formulário
 * Usado por todas as modais de CRUD para consistência visual
 * 
 * @version 2.0.1
 * @description
 * Estes estilos garantem que todas as modais tenham:
 * - Layout consistente e responsivo
 * - Espaçamentos uniformes
 * - Componentes de seleção padronizados
 * - Estados visuais consistentes
 */

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
 * Título de seção dentro do formulário
 */
export const SectionTitle = styled.h4`
//   margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

/**
 * Container genérico para seleções (perfil, categoria, etc)
 */
export const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
//   margin-top: 16px;
`;

/**
 * Opção selecionável genérica
 */
export const SelectionOption = styled.div<{ 
  $selected: boolean; 
  $color?: string;
  $size?: 'small' | 'medium' | 'large';
}>`
  padding: ${({ $size }) => {
    switch ($size) {
      case 'small': return '12px 16px';
      case 'large': return '20px 24px';
      default: return '16px';
    }
  }};
  border: 2px solid ${({ $selected, $color }) => 
    $selected ? ($color || '#3b82f6') : '#e5e7eb'
  };
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ $selected, $color }) => 
    $selected ? `${$color || '#3b82f6'}08` : '#ffffff'
  };

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
 * Container para radio button customizado
 */
export const RadioContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

/**
 * Radio button customizado
 */
export const CustomRadio = styled.div<{ $selected: boolean; $color?: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid ${({ $selected, $color }) => 
    $selected ? ($color || '#3b82f6') : '#d1d5db'
  };
  background-color: ${({ $selected, $color }) => 
    $selected ? ($color || '#3b82f6') : 'transparent'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  ${({ $selected }) => $selected && `
    &::after {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: white;
    }
  `}
`;

/**
 * Label principal de uma opção
 */
export const OptionLabel = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #111827;
  margin-bottom: 4px;
`;

/**
 * Descrição/subtexto de uma opção
 */
export const OptionDescription = styled.div`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
`;

/**
 * Container para toggle switches
 */
export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

/**
 * Toggle switch estilizado
 */
export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  cursor: pointer;
`;

/**
 * Input do toggle (oculto)
 */
export const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

/**
 * Slider do toggle
 */
export const ToggleSlider = styled.span<{ $checked: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ $checked }) => $checked ? '#10b981' : '#d1d5db'};
  transition: 0.3s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: ${({ $checked }) => $checked ? '23px' : '3px'};
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

/**
 * Container para informações de toggle
 */
export const ToggleInfo = styled.div`
  flex: 1;
`;

/**
 * Título do toggle
 */
export const ToggleTitle = styled.div`
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  margin-bottom: 2px;
`;

/**
 * Texto do toggle
 */
export const ToggleText = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

/**
 * Container para textarea customizada
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
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

/**
 * Texto de ajuda para textarea
 */
export const TextareaHelpText = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

/**
 * Container para lista de itens (ex: peças utilizadas)
 */
export const ItemListContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafbfc;
`;

/**
 * Item individual na lista
 */
export const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: white;
  border-radius: 6px;
  margin-bottom: 8px;
  border: 1px solid #e5e7eb;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

/**
 * Conteúdo do item da lista
 */
export const ListItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

/**
 * Título do item da lista
 */
export const ListItemTitle = styled.div`
  font-weight: 500;
  color: #374151;
  font-size: 14px;
`;

/**
 * Subtítulo do item da lista
 */
export const ListItemSubtitle = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

/**
 * Ações do item da lista
 */
export const ListItemActions = styled.div`
  display: flex;
  gap: 8px;
`;

/**
 * Container para formulário inline (ex: adicionar peça)
 */
export const InlineFormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: stretch;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 2px dashed #d1d5db;
  margin-top: 16px;
`;

/**
 * Grid de campos para formulários inline
 */
export const InlineFieldGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
`;

/**
 * Container responsivo para mobile
 */
export const ResponsiveContainer = styled.div`
  @media (max-width: 768px) {
    ${InlineFormContainer} {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    ${InlineFieldGrid} {
      grid-template-columns: 1fr;
    }
    
    ${ListItem} {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    
    ${ListItemActions} {
      width: 100%;
      justify-content: flex-end;
    }
  }
`;

/**
 * Container para tags/badges
 */
export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

/**
 * Tag/Badge individual
 */
export const Tag = styled.span<{ $color?: string; $variant?: 'solid' | 'outline' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  ${({ $color = '#3b82f6', $variant = 'solid' }) => 
    $variant === 'solid' 
      ? `
        background-color: ${$color}15;
        color: ${$color};
        border: 1px solid ${$color}30;
      `
      : `
        background-color: transparent;
        color: ${$color};
        border: 1px solid ${$color};
      `
  }
`;

/**
 * Container para status indicators
 */
export const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

/**
 * Indicador de status
 */
export const StatusIndicator = styled.div<{ $status: 'success' | 'warning' | 'error' | 'info' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  
  ${({ $status }) => {
    switch ($status) {
      case 'success': return 'background-color: #10b981;';
      case 'warning': return 'background-color: #f59e0b;';
      case 'error': return 'background-color: #ef4444;';
      case 'info': return 'background-color: #3b82f6;';
      default: return 'background-color: #6b7280;';
    }
  }}
`;

/**
 * Texto do status
 */
export const StatusText = styled.span`
  font-size: 14px;
  color: #374151;
  font-weight: 500;
`;

/**
 * Container para divider/separador
 */
export const Divider = styled.div<{ $margin?: string }>`
  height: 1px;
  background-color: #e5e7eb;
  margin: ${({ $margin }) => $margin || '24px 0'};
`;

/**
 * Container para footer de modal padronizado
 */
export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 0 0 0;
  border-top: 1px solid #e5e7eb;
  margin-top: 32px;
  
  @media (max-width: 640px) {
    flex-direction: column-reverse;
    gap: 8px;
    
    button {
      width: 100%;
    }
  }
`;

/**
 * Container para loading state
 */
export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #6b7280;
  font-size: 14px;
  gap: 12px;
`;

/**
 * Container para empty state
 */
export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
  gap: 16px;
`;

/**
 * Título do empty state
 */
export const EmptyTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
`;

/**
 * Texto do empty state
 */
export const EmptyText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  max-width: 280px;
  line-height: 1.5;
`;
