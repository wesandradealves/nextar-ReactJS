/**
 * Breakpoints centralizados para styled-components
 * Mesmos valores utilizados no _breakpoints.scss
 */
export const breakpoints = {
    xs: '0px',
    sm: '640px',     // 40rem
    md: '768px',     // 48rem
    lg: '1024px',    // 64rem
    xl: '1280px',    // 80rem  
    xxl: '1536px'    // 96rem
}

/**
 * Media queries helpers para styled-components
 * @example
 * const Component = styled.div`
 *   ${media.md`
 *     font-size: 1.2rem;
 *   `}
 * `;
 */
export const media = {
    xs: (styles) => `@media (min-width: ${breakpoints.xs}) { ${styles} }`,
    sm: (styles) => `@media (min-width: ${breakpoints.sm}) { ${styles} }`,
    md: (styles) => `@media (min-width: ${breakpoints.md}) { ${styles} }`,
    lg: (styles) => `@media (min-width: ${breakpoints.lg}) { ${styles} }`,
    xl: (styles) => `@media (min-width: ${breakpoints.xl}) { ${styles} }`,
    xxl: (styles) => `@media (min-width: ${breakpoints.xxl}) { ${styles} }`,
}

/**
 * Media queries down (max-width) para styled-components
 * @example
 * const Component = styled.div`
 *   ${mediaDown.md`
 *     display: none;
 *   `}
 * `;
 */
export const mediaDown = {
    xs: (styles) => `@media (max-width: calc(${breakpoints.sm} - 1px)) { ${styles} }`,
    sm: (styles) => `@media (max-width: calc(${breakpoints.md} - 1px)) { ${styles} }`,
    md: (styles) => `@media (max-width: calc(${breakpoints.lg} - 1px)) { ${styles} }`,
    lg: (styles) => `@media (max-width: calc(${breakpoints.xl} - 1px)) { ${styles} }`,
    xl: (styles) => `@media (max-width: calc(${breakpoints.xxl} - 1px)) { ${styles} }`,
}

/**
 * Media queries between para styled-components
 * @example
 * const Component = styled.div`
 *   ${mediaBetween('sm', 'lg')`
 *     padding: 2rem;
 *   `}
 * `;
 */
export const mediaBetween = (min, max) => (styles) => 
    `@media (min-width: ${breakpoints[min]}) and (max-width: calc(${breakpoints[max]} - 1px)) { ${styles} }`