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
  LoadingOverlay,
  LoadingSkeleton,
  LoadingSpinner,
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
  MobileCardValue
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
      <RowActions>
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
      <MobileCard key={itemId} $selected={isSelected}>
        <MobileCardHeader>
          <MobileCardTitle>
            {item.nome || item.name || item.title || `Item ${index + 1}`}
          </MobileCardTitle>
          <MobileCardActions>
            {selectable && (
              <Checkbox
                checked={isSelected}
                onChange={(e) => handleRowSelection(itemId, e.target.checked)}
              />
            )}
            {renderRowActions(item, index)}
          </MobileCardActions>
        </MobileCardHeader>
        
        <MobileCardBody>
          {columns.filter(col => !col.hideOnMobile && col.key !== 'nome' && col.key !== 'name').map(column => (
            <MobileCardField key={column.key}>
              <MobileCardLabel>{column.title}</MobileCardLabel>
              <MobileCardValue>
                {renderCellValue(column, item, index)}
              </MobileCardValue>
            </MobileCardField>
          ))}
        </MobileCardBody>
      </MobileCard>
    );
  }, [columns, currentSelectedRows, selectable, handleRowSelection, renderRowActions, renderCellValue]);

  return (
    <DataTableContainer className={className}>
      {/* Header da tabela */}
      <TableHeader>
        <TableTitle>
          {pagination ? `${pagination.total} ${pagination.total === 1 ? 'item' : 'itens'}` : `${data.length} ${data.length === 1 ? 'item' : 'itens'}`}
        </TableTitle>
        
        <TableActions>
          <SearchAndFilters>
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
      <TableWrapper>
        {loading && (
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        )}
        
        {/* Versão Desktop */}
        <Table style={{ display: 'table' }}>
          <TableHead>
            <TableRow>
              {selectable && (
                <CheckboxCell as="th">
                  <Checkbox
                    checked={isAllSelected}
                    $indeterminate={isPartiallySelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
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
                >
                  {column.title}
                  {column.sortable && (
                    <SortIndicator
                      $direction={
                        sorting?.sortBy === column.key ? sorting.sortOrder : null
                      }
                    />
                  )}
                </TableHeaderCell>
              ))}
              
              {actions.length > 0 && (
                <TableHeaderCell $align="center" style={{ width: '120px' }}>
                  Ações
                </TableHeaderCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`} $loading>
                  {selectable && (
                    <CheckboxCell>
                      <LoadingSkeleton style={{ width: '16px', height: '16px' }} />
                    </CheckboxCell>
                  )}
                  {columns.map(column => (
                    <TableCell key={column.key} $hideOnMobile={column.hideOnMobile}>
                      <LoadingSkeleton />
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell $align="center">
                      <LoadingSkeleton style={{ width: '80px' }} />
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
                  >
                    {selectable && (
                      <CheckboxCell>
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => handleRowSelection(itemId, e.target.checked)}
                        />
                      </CheckboxCell>
                    )}
                    
                    {columns.map(column => (
                      <TableCell
                        key={column.key}
                        $align={column.align}
                        $hideOnMobile={column.hideOnMobile}
                      >
                        {renderCellValue(column, item, index)}
                      </TableCell>
                    ))}
                    
                    {actions.length > 0 && (
                      <TableCell $align="center">
                        {renderRowActions(item, index)}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}>
                  <EmptyState>
                    <EmptyIcon>📋</EmptyIcon>
                    <EmptyMessage>{emptyMessage}</EmptyMessage>
                    <EmptyDescription>
                      {onSearch ? 'Tente ajustar os filtros de busca' : 'Nenhum dado disponível no momento'}
                    </EmptyDescription>
                  </EmptyState>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Versão Mobile */}
        <div style={{ display: 'none' }}>
          {data.map((item, index) => renderMobileCard(item, index))}
        </div>
      </TableWrapper>

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <PaginationContainer>
          <PaginationInfo>
            Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} itens
          </PaginationInfo>
          
          <PaginationControls>
            <PaginationButton
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
              title="Página anterior"
            >
              ‹
            </PaginationButton>
            
            {paginationPages.map((page, index) => 
              page === 'ellipsis' ? (
                <PaginationEllipsis key={`ellipsis-${index}`}>
                  ...
                </PaginationEllipsis>
              ) : (
                <PaginationButton
                  key={page}
                  $active={page === pagination.page}
                  onClick={() => onPageChange?.(page as number)}
                >
                  {page}
                </PaginationButton>
              )
            )}
            
            <PaginationButton
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              title="Próxima página"
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
