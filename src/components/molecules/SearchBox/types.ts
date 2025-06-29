/**
 * Tipos para o componente SearchBox
 */

export interface SearchBoxProps {
  /** Valor da busca */
  value?: string;
  /** Placeholder do campo de busca */
  placeholder?: string;
  /** Se o campo está desabilitado */
  disabled?: boolean;
  /** Se está carregando (loading) */
  loading?: boolean;
  /** Função executada ao alterar o valor */
  onChange?: (value: string) => void;
  /** Função executada ao submeter a busca */
  onSearch?: (value: string) => void;
  /** Função executada ao limpar a busca */
  onClear?: () => void;
  /** Classes CSS adicionais */
  className?: string;
  /** ID do componente */
  id?: string;
}
