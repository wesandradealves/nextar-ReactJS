import styled from 'styled-components';
import { pxToRem } from "@/utils";

export interface Typo {
    defaultexpanded?: string;
}

export const Submenu = styled.div`
`;

export const ListItem = styled.li<Typo>`
    position: relative;
    &.expanded,
    &:hover {
        color: ${props => props.defaultexpanded && props.defaultexpanded == "on" ? "initial" : props.theme._colors.primary.bdm1}
    }
    &.expanded {
        .arrow {
            transform: rotate(180deg);
        }
    }
    .arrow {
        color: ${props => props.theme._colors.primary.bdm1};
    }
`;

export const List = styled.ul`
`;

export const Container = styled.nav<Typo>`
    ${Submenu} {
        ${List} {
            background-color: ${props => props.defaultexpanded && props.defaultexpanded == "on" ? "initial" : props.theme._colors.primary.bdm1}; 
            // border-radius: ${pxToRem(10)};
            ${ListItem} {
                // color: black;
                &:hover {
                    color: ${props => props.defaultexpanded && props.defaultexpanded == "on" ? "initial" : "white"}
                }
                a {
                    color: inherit
                }
            }
        }
    }
    &.--mobile {
        left: -100%;
        background: rgba(0,0,0,.9);
        transition: left 0.3s ease-in-out;
        &.block {
            left: 0;
        }
        &.hidden {
            left: -100%;
        }
        .container {
            padding-top: 140px;
        }
        ${Submenu} {
            position: relative;
            ${List} {
                background-color: initial;
                padding: 0;
                border-radius: initial;
                ${ListItem} {
                    color: white;
                }
            }
        }
    }
`;




      