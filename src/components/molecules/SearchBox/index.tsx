"use client";

import React, { useState, useCallback } from 'react';
import { Input } from '@/components/atoms';
import { 
  SearchContainer, 
  SearchInput, 
  SearchActions, 
  IconButton,
  SearchIcon,
  ClearIcon
} from './styles';
import type { SearchBoxProps } from './types';

/**
 * Componente molecular SearchBox
 * Combina Input + Button + Icons para busca
 * Segue padrão Atomic Design - Molecule
 * 
 * @example
 * ```tsx
 * // SearchBox básico
 * <SearchBox
 *   placeholder="Buscar equipamentos..."
 *   onSearch={(value) => console.log('Buscando:', value)}
 * />
 * 
 * // SearchBox controlado
 * <SearchBox
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   onSearch={handleSearch}
 *   onClear={handleClear}
 * />
 * ```
 */
export const SearchBox = ({
  value: controlledValue,
  placeholder = 'Buscar...',
  disabled = false,
  loading = false,
  onChange,
  onSearch,
  onClear,
  className,
  id
}: SearchBoxProps) => {
  const [internalValue, setInternalValue] = useState('');
  
  // Usa valor controlado ou interno
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue);
  }, [controlledValue, onChange]);
  
  const handleSearch = useCallback(() => {
    if (!disabled && !loading) {
      // Permitir busca vazia para retornar todos os resultados
      onSearch?.(value.trim());
    }
  }, [disabled, loading, value, onSearch]);
  
  const handleClear = useCallback(() => {
    if (controlledValue === undefined) {
      setInternalValue('');
    }
    
    onChange?.('');
    onClear?.();
    
    // Executar busca vazia para retornar todos os resultados
    onSearch?.('');
  }, [controlledValue, onChange, onClear, onSearch]);
  
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);
  
  return (
    <SearchContainer className={`${className || ''} relative flex w-full`}>
      <SearchInput className="flex-1 relative">
        <Input
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          disabled={disabled || loading}
          onChange={handleInputChange}
          onKeyPress={handleKeyDown}
          className="pr-20" // Espaço para os botões
        />
        
        <SearchActions className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && !loading && (
            <IconButton
              type="button"
              onClick={handleClear}
              disabled={disabled}
              title="Limpar busca"
              className="flex items-center justify-center w-8 h-8 border-none rounded-md bg-transparent text-gray-500 
                hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ClearIcon />
            </IconButton>
          )}
          
          <IconButton
            type="button"
            onClick={handleSearch}
            disabled={disabled || loading}
            title="Buscar"
            className="flex items-center justify-center w-8 h-8 border-none rounded-md bg-transparent text-gray-500 
              hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <SearchIcon />
            )}
          </IconButton>
        </SearchActions>
      </SearchInput>
    </SearchContainer>
  );
};
