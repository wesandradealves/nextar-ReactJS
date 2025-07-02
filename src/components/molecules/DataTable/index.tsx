"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { SearchBox } from '@/components/molecules';
import {
  DataTableContainer,
  TableHeader,
  TableTitle,
  TableActions,
  SearchAndFilters,
  TableWrapper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  SortIndicator,
  RowActions,
  ActionButton,
  CheckboxCell,
  Checkbox,
  EmptyState,
  EmptyIcon,
  EmptyMessage,
  EmptyDescription,
  PaginationContainer,
  PaginationInfo,
  PaginationControls,
  PaginationButton,
  PaginationEllipsis,
  MobileCard,
  MobileCardHeader,
  MobileCardTitle,
  MobileCardActions,
  MobileCardBody,
  MobileCardField,
  MobileCardLabel,
  MobileCardValue,
  LoadingSkeleton
} from './styles';
import type { DataTableProps, TableColumn } from '@/types';

/**
 * Componente molecular DataTable
 * Tabela reutilizável com paginação, ordenação, filtros e ações
 * Totalmente responsiva com layout mobile adaptativo
 * Segue padrão Atomic Design - Molecule
 * 
 * @example
 * ```tsx
 * <DataTable
 *   data={users}
 *   columns={userColumns}
 *   actions={userActions}
 *   pagination={pagination}
 *   onPageChange={handlePageChange}
 *   onSortChange={handleSortChange}
 *   selectable
 *   onSelectionChange={handleSelectionChange}
 * />
 * ```
 */
export const DataTable = <T extends { id?: string; email?: string; nome?: string; name?: string; title?: string; [key: string]: unknown }>({
  data,
  columns,
  actions = [],
  loading = false,
  pagination,
  sorting,
  selectable = false,
  selectedRows = [],
  onPageChange,
  onSortChange,
  onSelectionChange,
  onSearch,
  emptyMessage = "Nenhum item encontrado",
  className
}: DataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localSelectedRows, setLocalSelectedRows] = useState<string[]>(selectedRows);

  // Usar seleção controlada ou local
  const currentSelectedRows = onSelectionChange ? selectedRows : localSelectedRows;

  /**
   * Manipula mudança de ordenação
   */
  const handleSortChange = useCallback((column: string) => {
    if (!onSortChange) return;
    
    const newOrder = sorting?.sortBy === column && sorting?.sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(column, newOrder);
  }, [sorting, onSortChange]);

  /**
   * Manipula busca
   */
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    onSearch?.(term);
  }, [onSearch]);

  /**
   * Manipula seleção de linha individual
   */
  const handleRowSelection = useCallback((itemId: string, checked: boolean) => {
    const newSelection = checked
      ? [...currentSelectedRows, itemId]
      : currentSelectedRows.filter(id => id !== itemId);
    
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      setLocalSelectedRows(newSelection);
    }
  }, [currentSelectedRows, onSelectionChange]);

  /**
   * Manipula seleção de todas as linhas
   */
  const handleSelectAll = useCallback((checked: boolean) => {
    const newSelection = checked ? data.map(item => item.id || item.email || String(item.index)) : [];
    
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      setLocalSelectedRows(newSelection);
    }
  }, [data, onSelectionChange]);

  /**
   * Verifica se todas as linhas estão selecionadas
   */
  const isAllSelected = useMemo(() => {
    if (data.length === 0) return false;
    return data.every(item => currentSelectedRows.includes(item.id || item.email || String(item.index)));
  }, [data, currentSelectedRows]);

  /**
   * Verifica se há seleção parcial
   */
  const isPartiallySelected = useMemo(() => {
    return currentSelectedRows.length > 0 && !isAllSelected;
  }, [currentSelectedRows.length, isAllSelected]);

  /**
   * Gera páginas para paginação
   */
  const paginationPages = useMemo(() => {
    if (!pagination) return [];
    
    const { page, totalPages } = pagination;
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (page > 3) {
        pages.push('ellipsis');
      }
      
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (page < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [pagination]);

  /**
   * Renderiza valor da célula
   */
  const renderCellValue = useCallback((column: TableColumn<T>, item: T, index: number) => {
    if (column.render) {
      return column.render(item[column.key], item, index);
    }
    
    const value = item[column.key];
    if (value === null || value === undefined) {
      return '-';
    }
    
    return String(value);
  }, []);

  /**
   * Renderiza ações da linha
   */
  const renderRowActions = useCallback((item: T, index: number) => {
    if (actions.length === 0) return null;
    
    return (
      <RowActions className="flex items-center gap-2 justify-center">
        {actions.map(action => {
          const isDisabled = typeof action.disabled === 'function' 
            ? action.disabled(item)
            : action.disabled;
          
          return (
            <ActionButton
              key={action.key}
              $variant={action.variant}
              onClick={() => action.onClick(item, index)}
              disabled={isDisabled}
              title={action.title}
              className={`
                w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors duration-150
                ${action.variant === 'primary' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : action.variant === 'danger'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {action.icon || action.title.charAt(0)}
            </ActionButton>
          );
        })}
      </RowActions>
    );
  }, [actions]);

  /**
   * Renderiza card mobile
   */
  const renderMobileCard = useCallback((item: T, index: number) => {
    const itemId = item.id || item.email || String(index);
    const isSelected = currentSelectedRows.includes(itemId);
    
    return (
      <MobileCard 
        key={itemId} 
        $selected={isSelected}
        className={`
          p-4 border-b border-gray-100 dark:border-gray-700 last:border-0
          ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'}
        `}
      >
        <MobileCardHeader className="flex items-center justify-between mb-3">
          <MobileCardTitle className="text-base font-semibold text-gray-800 dark:text-gray-200 m-0">
            {item.nome || item.name || item.title || `Item ${index + 1}`}
          </MobileCardTitle>
          <MobileCardActions className="flex items-center gap-2">
            {selectable && (
              <Checkbox
                checked={isSelected}
                onChange={(e) => handleRowSelection(itemId, e.target.checked)}
                className="w-4 h-4 accent-blue-600"
              />
            )}
            {renderRowActions(item, index)}
          </MobileCardActions>
        </MobileCardHeader>
        
        <MobileCardBody className="grid grid-cols-2 gap-2">
          {columns.filter(col => !col.hideOnMobile && col.key !== 'nome' && col.key !== 'name').map(column => (
            <MobileCardField key={column.key} className="flex flex-col">
              <MobileCardLabel className="text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">
                {column.title}
              </MobileCardLabel>
              <MobileCardValue className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                {renderCellValue(column, item, index)}
              </MobileCardValue>
            </MobileCardField>
          ))}
        </MobileCardBody>
      </MobileCard>
    );
  }, [columns, currentSelectedRows, selectable, handleRowSelection, renderRowActions, renderCellValue]);

  return (
    <DataTableContainer className={`${className || ''} flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm animate-fadeIn`}>
      {/* Header da tabela */}
      <TableHeader className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <TableTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {pagination ? `${pagination.total} ${pagination.total === 1 ? 'item' : 'itens'}` : `${data.length} ${data.length === 1 ? 'item' : 'itens'}`}
        </TableTitle>
        
        <TableActions className="flex items-center gap-3">
          <SearchAndFilters className="flex items-center gap-2">
            {onSearch && (
              <SearchBox
                placeholder="Buscar..."
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                onClear={() => handleSearch('')}
              />
            )}
          </SearchAndFilters>
        </TableActions>
      </TableHeader>

      {/* Tabela principal */}
      <TableWrapper className="w-full overflow-x-auto">
        {/* Versão Desktop */}
        <Table className="w-full border-collapse min-w-full table-auto hidden md:table">
          <TableHead className="bg-gray-50 dark:bg-gray-900">
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              {selectable && (
                <CheckboxCell as="th" className="p-3 w-10">
                  <Checkbox
                    checked={isAllSelected}
                    $indeterminate={isPartiallySelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                </CheckboxCell>
              )}
              
              {columns.map(column => (
                <TableHeaderCell
                  key={column.key}
                  $sortable={column.sortable}
                  $align={column.align}
                  $width={column.width}
                  $hideOnMobile={column.hideOnMobile}
                  onClick={column.sortable ? () => handleSortChange(column.key) : undefined}
                  className={`p-3 text-sm font-semibold text-gray-700 dark:text-gray-300 
                    ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : ''}
                    ${column.hideOnMobile ? 'hidden md:table-cell' : ''}
                  `}
                  style={{width: column.width || 'auto'}}
                >
                  {column.title}
                  {column.sortable && (
                    <SortIndicator
                      $direction={
                        sorting?.sortBy === column.key ? sorting.sortOrder : null
                      }
                      className="inline-block ml-1 transition-transform duration-200"
                    />
                  )}
                </TableHeaderCell>
              ))}
              
              {actions.length > 0 && (
                <TableHeaderCell 
                  $align="center" 
                  className="p-3 text-sm font-semibold text-gray-700 dark:text-gray-300 text-center"
                  style={{ width: '120px' }}
                >
                  Ações
                </TableHeaderCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              // Skeleton loading durante carregamento
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                  {selectable && (
                    <CheckboxCell className="p-3">
                      <LoadingSkeleton className="w-4 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                    </CheckboxCell>
                  )}
                  
                  {columns.map(column => (
                    <TableCell
                      key={column.key}
                      $align={column.align}
                      $hideOnMobile={column.hideOnMobile}
                      className={`p-3 text-sm ${column.hideOnMobile ? 'hidden md:table-cell' : ''}
                        ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
                    >
                      <LoadingSkeleton className="w-full h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                    </TableCell>
                  ))}
                  
                  {actions.length > 0 && (
                    <TableCell $align="center" className="p-3 text-center">
                      <LoadingSkeleton className="w-20 h-8 mx-auto bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data.length > 0 ? (
              data.map((item, index) => {
                const itemId = item.id || item.email || String(index);
                const isSelected = currentSelectedRows.includes(itemId);
                
                return (
                  <TableRow
                    key={itemId}
                    $selectable={selectable}
                    $selected={isSelected}
                    className={`
                      bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150
                      ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    `}
                  >
                    {selectable && (
                      <CheckboxCell className="p-3">
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => handleRowSelection(itemId, e.target.checked)}
                          className="w-4 h-4 accent-blue-600"
                        />
                      </CheckboxCell>
                    )}
                    
                    {columns.map(column => (
                      <TableCell
                        key={column.key}
                        $align={column.align}
                        $hideOnMobile={column.hideOnMobile}
                        className={`p-3 text-sm text-gray-700 dark:text-gray-300
                          ${column.hideOnMobile ? 'hidden md:table-cell' : ''}
                          ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
                      >
                        {renderCellValue(column, item, index)}
                      </TableCell>
                    ))}
                    
                    {actions.length > 0 && (
                      <TableCell $align="center" className="p-3 text-center">
                        {renderRowActions(item, index)}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="bg-white dark:bg-gray-800">
                <TableCell 
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="p-8 text-center"
                >
                  <EmptyState className="flex flex-col items-center justify-center py-12">
                    <EmptyIcon className="text-4xl mb-4 text-gray-400 dark:text-gray-500">📋</EmptyIcon>
                    <EmptyMessage className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{emptyMessage}</EmptyMessage>
                    <EmptyDescription className="text-sm text-gray-500 dark:text-gray-400">
                      {onSearch ? 'Tente ajustar os filtros de busca' : 'Nenhum dado disponível no momento'}
                    </EmptyDescription>
                  </EmptyState>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Versão Mobile */}
        <div className="block md:hidden">{data.map((item, index) => renderMobileCard(item, index))}</div>
      </TableWrapper>

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <PaginationContainer className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <PaginationInfo className="text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-0">
            Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} itens
          </PaginationInfo>
          
          <PaginationControls className="flex items-center gap-1">
            <PaginationButton
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
              title="Página anterior"
              className={`w-8 h-8 flex items-center justify-center rounded-md text-sm
                ${pagination.page === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}
              `}
            >
              ‹
            </PaginationButton>
            
            {paginationPages.map((page, index) => 
              page === 'ellipsis' ? (
                <PaginationEllipsis key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  …
                </PaginationEllipsis>
              ) : (
                <PaginationButton
                  key={page}
                  $active={page === pagination.page}
                  onClick={() => onPageChange?.(page as number)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm
                    ${page === pagination.page 
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}
                  `}
                >
                  {page}
                </PaginationButton>
              )
            )}
            
            <PaginationButton
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              title="Próxima página"
              className={`w-8 h-8 flex items-center justify-center rounded-md text-sm
                ${pagination.page === pagination.totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}
              `}
            >
              ›
            </PaginationButton>
          </PaginationControls>
        </PaginationContainer>
      )}
    </DataTableContainer>
  );
};

export default DataTable;