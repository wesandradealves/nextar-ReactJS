import styled from 'styled-components';

interface BadgeElementProps {
  $variant: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  $size: 'small' | 'medium' | 'large';
  $dot: boolean;
  $clickable: boolean;
}

export const BadgeElement = styled.span<BadgeElementProps>`
  ${props => props.$clickable && `
    &:hover {
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`;
