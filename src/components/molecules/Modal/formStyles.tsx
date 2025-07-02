import styled from 'styled-components';

/**
 * Estilos padronizados para modais de formulário
 * Usado por todas as modais de CRUD para consistência visual
 * 
 * @version 3.0.0
 * @description
 * Migrado para o padrão híbrido Tailwind + styled-components.
 * Mantido apenas o essencial como styled-components para
 * comportamentos dinâmicos, o resto migrado para Tailwind.
 */

/**
 * Container principal do formulário
 * Convertido para Tailwind
 */
export const FormSection = styled.div``;

/**
 * Grupo de campos relacionados
 * Convertido para Tailwind
 */
export const FieldGroup = styled.div``;

/**
 * Título de seção dentro do formulário
 * Convertido para Tailwind
 */
export const SectionTitle = styled.h4``;

/**
 * Container genérico para seleções (perfil, categoria, etc)
 * Convertido para Tailwind
 */
export const SelectionContainer = styled.div``;

/**
 * Opção selecionável genérica
 * Mantido como styled-component para suporte a props dinâmicas de cor
 */
export const SelectionOption = styled.div<{ 
  $selected: boolean; 
  $color?: string;
  $size?: 'small' | 'medium' | 'large';
}>`
  border-color: ${({ $selected, $color }) => 
    $selected ? ($color || '#3b82f6') : '#e5e7eb'
  };
  background-color: ${({ $selected, $color }) => 
    $selected ? `${$color || '#3b82f6'}08` : '#ffffff'
  };

  &:hover {
    border-color: ${({ $color }) => $color || '#3b82f6'};
    background-color: ${({ $color }) => `${$color || '#3b82f6'}08`};
  }
`;

/**
 * Container para radio button customizado
 * Convertido para Tailwind
 */
export const RadioContainer = styled.div``;

/**
 * Radio button customizado
 * Mantido como styled-component para suporte a props dinâmicas de cor
 */
export const CustomRadio = styled.div<{ $selected: boolean; $color?: string }>`
  border-color: ${({ $selected, $color }) => 
    $selected ? ($color || '#3b82f6') : '#d1d5db'
  };
  background-color: ${({ $selected, $color }) => 
    $selected ? ($color || '#3b82f6') : 'transparent'
  };

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
 * Convertido para Tailwind
 */
export const OptionLabel = styled.div``;

/**
 * Descrição/subtexto de uma opção
 * Convertido para Tailwind
 */
export const OptionDescription = styled.div``;

/**
 * Container para toggle switches
 * Convertido para Tailwind
 */
export const ToggleContainer = styled.div``;

/**
 * Toggle switch estilizado
 * Mantido como styled-component para posicionamento
 */
export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
`;

/**
 * Input do toggle (oculto)
 * Convertido para Tailwind, mantendo apenas styled-component vazio para compatibilidade
 */
export const ToggleInput = styled.input``;

/**
 * Slider do toggle
 * Mantido apenas para a transição do indicador baseada no estado
 */
export const ToggleSlider = styled.span<{ $checked: boolean }>`
  position: absolute;
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
 * Convertido para Tailwind
 */
export const ToggleInfo = styled.div``;

/**
 * Título do toggle
 * Convertido para Tailwind
 */
export const ToggleTitle = styled.div``;

/**
 * Texto do toggle
 * Convertido para Tailwind
 */
export const ToggleText = styled.div``;

/**
 * Container para textarea customizada
 * Convertido para Tailwind
 */
export const TextareaContainer = styled.div``;

/**
 * Label para textarea
 * Convertido para Tailwind
 */
export const TextareaLabel = styled.label``;

/**
 * Texto de ajuda para textarea
 * Convertido para Tailwind
 */
export const TextareaHelpText = styled.div``;

/**
 * Container para lista de itens
 * Convertido para Tailwind
 */
export const ItemListContainer = styled.div``;

/**
 * Item individual na lista
 * Convertido para Tailwind
 */
export const ListItem = styled.div``;

/**
 * Conteúdo do item da lista
 * Convertido para Tailwind
 */
export const ListItemContent = styled.div``;

/**
 * Título do item da lista
 * Convertido para Tailwind
 */
export const ListItemTitle = styled.div``;

/**
 * Subtítulo do item da lista
 * Convertido para Tailwind
 */
export const ListItemSubtitle = styled.div``;

/**
 * Ações do item da lista
 * Convertido para Tailwind
 */
export const ListItemActions = styled.div``;

/**
 * Container para formulário inline
 * Convertido para Tailwind
 */
export const InlineFormContainer = styled.div``;

/**
 * Grid de campos para formulários inline
 * Convertido para Tailwind
 */
export const InlineFieldGrid = styled.div``;

/**
 * Container responsivo para mobile
 * Convertido para Tailwind, mantendo apenas styled-component vazio para compatibilidade
 */
export const ResponsiveContainer = styled.div``;

/**
 * Container para tags/badges
 * Convertido para Tailwind
 */
export const TagContainer = styled.div``;

/**
 * Tag/Badge individual
 * Mantido apenas para variação dinâmica de cores e variantes
 */
export const Tag = styled.span<{ $color?: string; $variant?: 'solid' | 'outline' }>`
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
 * Convertido para Tailwind
 */
export const StatusContainer = styled.div``;

/**
 * Indicador de status
 * Mantido apenas para cores dinâmicas baseadas no status
 */
export const StatusIndicator = styled.div<{ $status: 'success' | 'warning' | 'error' | 'info' }>`
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
 * Convertido para Tailwind
 */
export const StatusText = styled.span``;

/**
 * Container para divider/separador
 * Mantido apenas para margens dinâmicas
 */
export const Divider = styled.div<{ $margin?: string }>`
  margin: ${({ $margin }) => $margin || '24px 0'};
`;

/**
 * Container para footer de modal padronizado
 * Convertido para Tailwind
 */
export const ModalFooter = styled.div``;

/**
 * Container para loading state
 * Convertido para Tailwind
 */
export const LoadingContainer = styled.div``;

/**
 * Container para empty state
 * Convertido para Tailwind
 */
export const EmptyContainer = styled.div``;

/**
 * Título do empty state
 * Convertido para Tailwind
 */
export const EmptyTitle = styled.h3``;

/**
 * Texto do empty state
 * Convertido para Tailwind
 */
export const EmptyText = styled.p``;
