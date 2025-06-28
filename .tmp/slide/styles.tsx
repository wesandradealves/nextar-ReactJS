import styled from 'styled-components';

export const Container = styled.section`

`; 

export const Title = styled.h3`
    &::after {
        opacity: .48;
        content: attr(data-backtext);
        display: block;
        font-size: 50%;
        @media screen and (min-width: ${props => props.theme._breakpoints.lg}) {
            position: absolute;
            left: 10px;
            font-size: inherit;
            min-width: 200%;
            text-align: left;
            z-index: -1;
            margin: -20px;
            top: 0;
        }
    }
`;

export const Subtitle = styled.p`
`;

export const SlideWrapper = styled.div`
    .slick {
        &-dots {
            position: absolute;
            top: 145px;
            @media screen and (min-width: ${props => props.theme._breakpoints.lg}) {
                top: 135px;
                @media screen and (min-width: ${props => props.theme._breakpoints.xxl}) {
                    top: 165px;
                }
            }
            left: 0;
            width: 100%;
            height: auto;
            gap: 10px;
            text-align: center;
            bottom: initial;
            li {
                padding: 0;
                width: 12px;
                height: 12px;
                border: 2px ${props => props.theme._colors.primary.bdm3} solid;
                border-radius: 999px;
                margin: 0 5px;
                &[class*='active'] {
                    background: ${props => props.theme._colors.primary.bdm3}
                }
                button {
                    padding: 0;
                    margin: 0;
                    height: 100%;
                    width: 100%;
                    &::before {
                        content: ''
                    }
                }
            }
        }
    }
`;


export const Item = styled.article`
    ${Title} {
        color: ${props => props.theme._colors.primary.bdm3};
    }
    ${Subtitle} {
        background-color: ${props => props.theme._colors.primary.bdm3};
        color: black;
    }
`;

export const ItemInner = styled.div`
`;
