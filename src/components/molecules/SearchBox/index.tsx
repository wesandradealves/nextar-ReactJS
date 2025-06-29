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
    if (!disabled && !loading && value.trim()) {
      onSearch?.(value.trim());
    }
  }, [disabled, loading, value, onSearch]);
  
  const handleClear = useCallback(() => {
    if (controlledValue === undefined) {
      setInternalValue('');
    }
    
    onChange?.('');
    onClear?.();
  }, [controlledValue, onChange, onClear]);
  
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);
  
  return (
    <SearchContainer className={className}>
      <SearchInput>
        <Input
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          disabled={disabled || loading}
          onChange={handleInputChange}
          onKeyPress={handleKeyDown}
        />
        
        <SearchActions>
          {value && !loading && (
            <IconButton
              type="button"
              $variant="clear"
              onClick={handleClear}
              disabled={disabled}
              title="Limpar busca"
            >
              <ClearIcon />
            </IconButton>
          )}
          
          <IconButton
            type="button"
            $variant="search"
            onClick={handleSearch}
            disabled={disabled || loading || !value.trim()}
            title="Buscar"
          >
            {loading ? (
              <div style={{ 
                width: '16px', 
                height: '16px', 
                border: '2px solid currentColor',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : (
              <SearchIcon />
            )}
          </IconButton>
        </SearchActions>
      </SearchInput>
    </SearchContainer>
  );
};
