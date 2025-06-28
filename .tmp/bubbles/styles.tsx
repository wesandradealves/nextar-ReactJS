import { pxToRem } from '@/utils';
import styled from 'styled-components';



export const Title = styled.h3`

`;

export const Text = styled.p`

`;

export const Blob = styled.div`

`;

export const ImgWrapper = styled.div`
    > span {
        background: linear-gradient(265deg, rgba(70, 54, 0, 0.34) 4.22%, rgba(255, 199, 0, 0.34) 22.85%, rgba(179, 107, 0, 0.34) 34.42%, rgba(255, 199, 0, 0.34) 47.27%, rgba(255, 166, 0, 0.34) 68.47%, rgba(223, 169, 24, 0.34) 87.75%, rgba(253, 221, 2, 0.34) 96.75%, rgba(255, 199, 0, 0.34) 105.1%, rgba(235, 106, 20, 0.34) 116.67%, rgba(255, 199, 0, 0.34) 127.59%);
        box-shadow: 92.409px -92.409px 92.409px 0px rgba(71, 74, 75, 0.10) inset, -92.409px 92.409px 92.409px 0px rgba(255, 255, 255, 0.10) inset;
        backdrop-filter: blur(92.40914916992188px);
    }
    &::before {
        position: absolute;
        content: counter(list-counter);
        background-color: rgba(255, 255, 255, 0.20);
        box-shadow: 16.372px -16.372px 16.372px 0px rgba(149, 149, 149, 0.10) inset, -16.372px 16.372px 16.372px 0px rgba(255, 255, 255, 0.10) inset;
        backdrop-filter: blur(16.372203826904297px);
        width: 60px;
        height: 60px;
        margin: -5px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 999px;
        overflow: hidden;
        font-weight: bold;
        z-index: 11;
        font-size: ${pxToRem(32)};
    }
    transition: 500ms ease-in-out all;
`;

export const Item = styled.li`
    counter-increment: list-counter;
    color: white;
    &:first-of-type {
        ${ImgWrapper} {
            &::before {
                left: 0;
                bottom: 0;
            }
        }
        & ~ :nth-child(even) {
            ${ImgWrapper} {
                &::before {
                    right: 0;
                    bottom: 0;
                }
            }
        }
        & ~ :nth-child(odd) {
            ${ImgWrapper} {
                &::before {
                    top: 0;
                    left: 0;
                    @media (min-width: ${props => props.theme._breakpoints.lg}) {
                        right: 0;
                        left: initial;
                    }
                }
            }
        }
    }
`;

export const Container = styled.ul`
    counter-reset: list-counter;

    // ${Item} {
    //     ${Title} {
    //         font-size: ${pxToRem(18)};
    //     }
    //     ${Text} {
    //         font-size: ${pxToRem(14)};
    //     }
    // }
`;
