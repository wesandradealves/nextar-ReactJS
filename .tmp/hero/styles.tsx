import styled, { css } from 'styled-components';

export interface Typo {
    backgroundimage?: string;
}

export const Container = styled.section<Typo>`
    ${({ backgroundimage }) => backgroundimage && css`
        background: url(${backgroundimage}) center center / cover no-repeat transparent;
    `}  
`;

export const Placeholder = styled.img`
`;


export const Title = styled.h2`
    b, strong {
        font-weight: 900;
    }
`;

export const Text = styled.p`
`;
