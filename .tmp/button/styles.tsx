import styled, { css } from 'styled-components';

export interface Typo {
  radius?: number;
}

export const Container = styled.button<Typo>`
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  ${({ radius }) => radius && css`
      border-radius: ${radius}px;
  `}  
  &.--primary {
    color: black;
    background: var(--Dourado-Exchange-Dourado-Boto, linear-gradient(93deg, ${props => props.theme._colors.primary.bdm1} 1.67%, ${props => props.theme._colors.primary.bdm2} 83.65%));
  }
  &.--secondary {
    color: white;
    border: 1px white solid;
    background: transparent;
  }
`;