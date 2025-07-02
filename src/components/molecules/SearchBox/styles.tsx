import styled from 'styled-components';

/**
 * Container principal do SearchBox
 * Convertido para Tailwind
 */
export const SearchContainer = styled.div``;

/**
 * Container do input de busca
 * Convertido para Tailwind
 */
export const SearchInput = styled.div``;

/**
 * Container dos botões de ação
 * Convertido para Tailwind
 */
export const SearchActions = styled.div``;

/**
 * Botão de ícone (busca/limpar)
 * Completamente convertido para Tailwind
 */
export const IconButton = styled.button``;

export const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const ClearIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
