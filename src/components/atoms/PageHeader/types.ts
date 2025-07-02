/**
 * Props para o componente PageHeader
 */
export interface PageHeaderProps {
  /** Título da página */
  title: string;
  /** Subtítulo opcional */
  subtitle?: string;
  /** Função para exportar dados */
  onExport?: () => void;
  /** Função para adicionar novo item */
  onAdd?: () => void;
  /** Texto do botão de adicionar */
  addLabel?: string;
  /** Texto do botão de exportar */
  exportLabel?: string;
  /** Se o botão de exportar está desabilitado */
  exportDisabled?: boolean;
  /** Se deve mostrar o botão de exportar */
  showExportButton?: boolean;
  /** Se deve mostrar o botão de adicionar */
  showAddButton?: boolean;
  /** Conteúdo filho adicional */
  children?: React.ReactNode;
}
