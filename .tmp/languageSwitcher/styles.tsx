import styled, { css } from 'styled-components';

export default interface Props {
    float?: string;
}

export const Container = styled.ul`

`;

export const Item = styled.li`

`;

export const Flag = styled.span<Props>`
    height: 24px;
    width: 24px;
    ${({ float }) => float && css`
        height: 58px;
        width: 58px;
    `}  
    border-radius: 999px;
    background-size: cover;
`;