"use client";

import styled, {createGlobalStyle} from "styled-components";
import { pxToRem } from "@/utils";

export const GlobalStyle = createGlobalStyle `
    *,
    *:before,
    *:after {
        box-sizing: border-box;
    }

    html,
    body,
    div,
    span,
    object,
    iframe,
    figure,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    blockquote,
    pre,
    a,
    code,
    em,
    img,
    small,
    strike,
    strong,
    sub,
    sup,
    tt,
    b,
    u,
    i,
    ol,
    ul,
    li,
    fieldset,
    form,
    label,
    table,
    caption,
    tbody,
    tfoot,
    thead,
    tr,
    th,
    td,
    main,
    canvas,
    embed,
    footer,
    header,
    nav,
    section,
    video {
        margin: 0;
        padding: 0;
        border: 0;
        vertical-align: baseline;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        text-size-adjust: none;
        text-decoration: none;
    }

    html,
    body {
        line-height: 1.4;
        font-family: 'Montserrat', sans-serif;
        font-optical-sizing: auto;
        font-style: normal;
        overflow-x: hidden;
        font-size: ${pxToRem(16)};
        * { 
            transition: 30ms ease-in-out all;
        }
    }

    blockquote,
    q {
        quotes: none;
    }

    blockquote:before,
    blockquote:after,
    q:before,
    q:after {
        content: "";
        content: none;
    }

    table {
        border-collapse: collapse;
        border-spacing: 0;
        * {
            background-color: transparent;
            vertical-align: middle;
        }
    }

    input {
        -webkit-appearance: none;
        appearance: none; 
        border-radius: 0;
        font-family: inherit;
    }    

    .pace {
        &-progress {
        }
    } 

    ol,
    ul {
        list-style: disc;
        line-height: 1.6;
        margin: 0;
    }

    .container {
        padding-left: 24px;
        padding-right: 24px;
    }

`;

export const App = styled.div `
`;