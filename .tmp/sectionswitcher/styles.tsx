import styled from 'styled-components';
export const Select = styled.div`
    box-shadow: 0px 4px 4px 0px #00000040;
    background-color: ${props => props.theme._colors.primary.bdm7};
    select {
        background: transparent;
        border: 0;
        outline: initial;
        color: #FBFBFBE5;
        option {
            color: initial;
        }
    }
    .arrow {
        color: ${props => props.theme._colors.primary.bdm1};
    }
`;