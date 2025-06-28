import styled from 'styled-components';

export interface Typo {
  expanded?: boolean;
}

export const Container = styled.div`
  color: ${props => props.theme._colors.primary.bdm3}};
`;

export const FaqItem = styled.article`
  background: ${props => props.theme._colors.primary.bdm4};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  &.active {
    background: ${props => props.theme._colors.primary.bdm4};
  }
`;

export const Question = styled.h3`
`;

export const Answer = styled.div<Typo>`
  color: ${props => props.theme._colors.primary.bdm5}
`;