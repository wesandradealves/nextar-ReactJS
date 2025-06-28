import styled from 'styled-components';

export const Text = styled.p`

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

export const Rating = styled.ul`

`;

export const Item = styled.article`
`;

export const ItemInner = styled.div`
`;

export const Rate = styled.li`
  color: ${props => props.theme._colors.primary.bdm3};
`;

export const Title = styled.h3`
`;

