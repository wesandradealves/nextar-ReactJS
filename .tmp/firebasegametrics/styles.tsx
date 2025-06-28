import styled, { css } from 'styled-components';

export interface Typo {
  background?: string;
  backgroundcolor?: string;
  backgroundsize?: string;
  backgroundposition?: string;
  backgroundattachment?: string;
  backgroundimage?: string;
}

export const Metrics = styled.div<Typo>`
    ${({ backgroundimage }) => backgroundimage && css`
        background-image: url(${backgroundimage});
    `} 
    ${({ backgroundsize }) => backgroundsize && css`
        background-size: ${backgroundsize};
    `}  
    ${({ backgroundposition }) => backgroundposition && css`
        background-position: ${backgroundposition};
    `}  
    ${({ backgroundattachment }) => backgroundattachment && css`
        background-attachment: ${backgroundattachment};
    `}  
`;

export const MetricsText = styled.div`

`;

export const Text = styled.div`

`;