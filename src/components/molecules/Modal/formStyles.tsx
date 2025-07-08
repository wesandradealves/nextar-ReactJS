import styled from 'styled-components';

export const FormSection = styled.div``;

export const FieldGroup = styled.div``;

export const SectionTitle = styled.h4``;

export const SelectionContainer = styled.div``;

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

export const RadioContainer = styled.div``;

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

export const OptionLabel = styled.div``;

export const OptionDescription = styled.div``;

export const ToggleContainer = styled.div``;

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
`;

export const ToggleInput = styled.input``;

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

export const ToggleInfo = styled.div``;

export const ToggleTitle = styled.div``;

export const ToggleText = styled.div``;

export const TextareaContainer = styled.div``;

export const TextareaLabel = styled.label``;

export const TextareaHelpText = styled.div``;

export const ItemListContainer = styled.div``;

export const ListItem = styled.div``;

export const ListItemContent = styled.div``;

export const ListItemTitle = styled.div``;

export const ListItemSubtitle = styled.div``;

export const ListItemActions = styled.div``;

export const InlineFormContainer = styled.div``;

export const InlineFieldGrid = styled.div``;

export const ResponsiveContainer = styled.div``;

export const TagContainer = styled.div``;

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

export const StatusContainer = styled.div``;

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

export const StatusText = styled.span``;

export const Divider = styled.div<{ $margin?: string }>`
  margin: ${({ $margin }) => $margin || '24px 0'};
`;

export const ModalFooter = styled.div``;

export const LoadingContainer = styled.div``;

export const EmptyContainer = styled.div``;

export const EmptyTitle = styled.h3``;

export const EmptyText = styled.p``;
