import React, { useState, useEffect } from 'react';
import { Input } from '../Input';
import { DateInputProps } from './types';

/**
 * Componente de input de data brasileiro
 * Usa o input HTML5 type="date" com localização brasileira
 * 
 * @example
 * ```tsx
 * <DateInput
 *   value="2025-07-02"
 *   onChange={(value) => console.log(value)}
 *   placeholder="Selecione a data"
 * />
 * ```
 */
export const DateInput = ({
  value,
  onChange,
  placeholder = 'Selecione a data',
  disabled = false,
  required = false,
  min,
  max,
  hasError = false,
  className
}: DateInputProps) => {
  const [inputValue, setInputValue] = useState('');

  // Converter valor para formato ISO quando necessário
  useEffect(() => {
    if (value) {
      let isoValue = '';
      
      if (value instanceof Date) {
        // Converter Date para ISO string (yyyy-mm-dd)
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        isoValue = `${year}-${month}-${day}`;
      } else if (typeof value === 'string') {
        // Se já está em formato ISO, usar diretamente
        if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          isoValue = value;
        } else if (value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
          // Converter formato brasileiro (dd/mm/yyyy) para ISO
          const [day, month, year] = value.split('/');
          isoValue = `${year}-${month}-${day}`;
        }
      }
      
      setInputValue(isoValue);
    } else {
      setInputValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value; // Valor já vem em formato ISO do input type="date"
    setInputValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Input
      type="date"
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      min={min}
      max={max}
      hasError={hasError}
      className={`
        font-sans
        [&::-webkit-calendar-picker-indicator]:dark:filter 
        [&::-webkit-calendar-picker-indicator]:dark:invert
        ${className || ''}
      `}
    />
  );
};

export default DateInput;