import styled from 'styled-components';

/**
 * Estilos para o componente FormSelection
 * 
 * @version 1.0.0
 * @description
 * Migrado para o padrão híbrido Tailwind + styled-components.
 * Mantido apenas o essencial como styled-components para
 * comportamentos dinâmicos, o resto migrado para Tailwind.
 */

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
