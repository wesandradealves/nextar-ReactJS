import styled from 'styled-components';

export const Item = styled.article`
`; 

export const ItemInner = styled.div`
    background-color: ${props => props.theme._colors.primary.bdm8};
`; 

export const Title = styled.h3`
    color: ${props => props.theme._colors.primary.bdm3};
`; 

export const Text = styled.p`
    color: white;
`; 

export const Container = styled.div`
    .slick {
        &-list {
        margin: 0 -16px;
        .slick-track {
            display: flex;
            align-items: stretch;
            .slick-slide {
            height: auto;
            padding: 0 16px;
            > div {
                height: 100%
            }
            }
        }
        }
    }
`; 

export const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  color: ${props => props.theme._colors.primary.bdm4};};
`;

export const CategoryTag = styled.span`
  background: ${props => props.theme._colors.primary.bdm8};
  color: ${props => props.theme._colors.primary.bdm3};
  font-weight: 600;
`;