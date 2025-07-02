import React from 'react';
import { Button } from '@/components/atoms/Button';
import { 
  PageHeaderContainer, 
  PageTitle, 
  PageSubtitle,
  HeaderActions 
} from './styles';
import { PageHeaderProps } from './types';

export const PageHeader = ({
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
}: PageHeaderProps) => {
  return (
    <PageHeaderContainer className="flex flex-col md:flex-row justify-between items-start gap-5 p-5 md:p-6">
      <div className="space-y-2">
        <PageTitle className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 m-0 leading-tight">
          {title}
        </PageTitle>
        {subtitle && (
          <PageSubtitle className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            {subtitle}
          </PageSubtitle>
        )}
      </div>
      
      <HeaderActions className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto justify-end">
        {children}
        
        {showExportButton && onExport && (
          <Button
            variant="secondary"
            onClick={onExport}
            disabled={exportDisabled}
            className="text-sm whitespace-nowrap"
          >
            {exportLabel}
          </Button>
        )}
        
        {showAddButton && onAdd && (
          <Button
            variant="primary"
            onClick={onAdd}
            className="text-sm whitespace-nowrap"
          >
            {addLabel}
          </Button>
        )}
      </HeaderActions>
    </PageHeaderContainer>
  );
};
