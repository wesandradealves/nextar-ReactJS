import styled from 'styled-components';

interface BadgeElementProps {
  $variant: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  $size: 'small' | 'medium' | 'large';
  $dot: boolean;
  $clickable: boolean;
}

export const BadgeElement = styled.span<BadgeElementProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: ${props => props.$dot ? '50%' : '6px'};
  transition: all 0.2s ease;
  white-space: nowrap;
  
  /* Tamanhos */
  ${props => {
    if (props.$dot) {
      switch (props.$size) {
        case 'small':
          return `
            width: 8px;
            height: 8px;
          `;
        case 'medium':
          return `
            width: 12px;
            height: 12px;
          `;
        case 'large':
          return `
            width: 16px;
            height: 16px;
          `;
        default:
          return `
            width: 12px;
            height: 12px;
          `;
      }
    } else {
      switch (props.$size) {
        case 'small':
          return `
            padding: 2px 8px;
            font-size: 0.75rem;
            min-height: 20px;
          `;
        case 'medium':
          return `
            padding: 4px 12px;
            font-size: 0.875rem;
            min-height: 24px;
          `;
        case 'large':
          return `
            padding: 6px 16px;
            font-size: 1rem;
            min-height: 32px;
          `;
        default:
          return `
            padding: 4px 12px;
            font-size: 0.875rem;
            min-height: 24px;
          `;
      }
    }
  }}
  
  /* Variantes de cor */
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background-color: #667eea;
          color: white;
        `;
      case 'secondary':
        return `
          background-color: #6b7280;
          color: white;
        `;
      case 'success':
        return `
          background-color: #10b981;
          color: white;
        `;
      case 'warning':
        return `
          background-color: #f59e0b;
          color: white;
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          color: white;
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #374151;
        `;
    }
  }}
  
  /* Estado clicável */
  ${props => props.$clickable && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`;
