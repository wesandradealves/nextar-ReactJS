import styled, { css } from 'styled-components';

export interface Typo {
    barstitle?: string | number;
}


export const Container = styled.div`
`;

export const Title = styled.div<Typo>`
    ${({ barstitle }) => barstitle && barstitle == 1 && css`
        &::before,
        &::after {
            position: absolute;
            display: block;
            content: '';
            right: 0;
            width: 100%;
            height: 4px;
            background: rgb(2,0,36);
            background: -moz-linear-gradient(90deg, rgba(2,0,36,0) 0%, ${props => props.theme._colors.primary.bdm3} 50%, rgba(0,212,255,0) 100%);
            background: -webkit-linear-gradient(90deg, rgba(2,0,36,0) 0%, ${props => props.theme._colors.primary.bdm3} 50%, rgba(0,212,255,0) 100%);
            background: linear-gradient(90deg, rgba(2,0,36,0) 0%, ${props => props.theme._colors.primary.bdm3} 50%, rgba(0,212,255,0) 100%);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#020024",endColorstr="#00d4ff",GradientType=1);
        }
        &::before {
            top: 0
        }
        &::after {
            bottom: 0
        }
    `} 
`;