import styled, { css } from 'styled-components';

export interface Typo {
    background?: string;
    backgroundcolor?: string;
    backgroundsize?: string;
    backgroundposition?: string;
    backgroundattachment?: string;
    backgroundimage?: string;
    barstitle?: string | number;
}

export const Container = styled.section<Typo>`
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    ${({ background }) => background && css`
        background: ${background};
    `} 
    ${({ backgroundimage }) => backgroundimage && css`
        background-image: url(${backgroundimage});
    `} 
    ${({ backgroundcolor }) => backgroundcolor && css`
        background-color: ${backgroundcolor};
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

export const Title = styled.h2<Typo>`
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

export const Subtitle = styled.p`
`;

export const Text = styled.article`
`;

export const Helper = styled.p`
`;

export const SectionHeader = styled.div`
`;