import React from 'react';
import { Button } from '@/components/atoms/Button';
import { 
  PageHeaderContainer, 
  PageTitle, 
  PageSubtitle,
  HeaderActions 
} from './styles';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onExport?: () => void;
  onAdd?: () => void;
  addLabel?: string;
  exportLabel?: string;
  exportDisabled?: boolean;
  showExportButton?: boolean;
  showAddButton?: boolean;
  children?: React.ReactNode;
}

/**
 * Componente de cabeçalho padronizado para páginas da aplicação
 * Pode incluir botões de exportação e adição, além de conteúdo personalizado
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onExport,
  onAdd,
  addLabel = '+ Novo',
  exportLabel = 'Exportar CSV',
  exportDisabled = false,
  showExportButton = true,
  showAddButton = true,
  children
}) => {
  return (
    <PageHeaderContainer>
      <div>
        <PageTitle>{title}</PageTitle>
        {subtitle && <PageSubtitle>{subtitle}</PageSubtitle>}
      </div>
      
      <HeaderActions>
        {children}
        
        {showExportButton && onExport && (
          <Button
            variant="secondary"
            onClick={onExport}
            disabled={exportDisabled}
          >
            {exportLabel}
          </Button>
        )}
        
        {showAddButton && onAdd && (
          <Button
            variant="primary"
            onClick={onAdd}
          >
            {addLabel}
          </Button>
        )}
      </HeaderActions>
    </PageHeaderContainer>
  );
};
