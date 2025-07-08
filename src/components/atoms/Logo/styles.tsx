import styled from 'styled-components';

interface LogoContainerProps {
  $variant: 'default' | 'header' | 'login';
  $size: 'small' | 'medium' | 'large';
}

export const LogoContainer = styled.div<LogoContainerProps>`
  img {
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
`;
