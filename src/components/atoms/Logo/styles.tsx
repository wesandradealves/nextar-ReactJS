import styled from 'styled-components';

interface LogoContainerProps {
  $variant: 'default' | 'header' | 'login';
  $size: 'small' | 'medium' | 'large';
}

export const LogoContainer = styled.div<LogoContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Variações de tamanho */
  ${props => {
    switch (props.$size) {
      case 'small':
        return `
          width: 40px;
          height: 40px;
        `;
      case 'medium':
        return `
          width: 80px;
          height: 80px;
        `;
      case 'large':
        return `
          width: 120px;
          height: 120px;
        `;
      default:
        return `
          width: 80px;
          height: 80px;
        `;
    }
  }}
  
  /* Variações de contexto */
  ${props => {
    switch (props.$variant) {
      case 'header':
        return `
          margin-right: 16px;
        `;
      case 'login':
        return `
          margin: 0 auto 24px;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        `;
      default:
        return '';
    }
  }}
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
`;
