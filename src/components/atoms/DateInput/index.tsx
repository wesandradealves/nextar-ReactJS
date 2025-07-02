import React, { useState, useEffect } from 'react';
import { Input } from '../Input';

export interface DateInputProps {
  /** Valor da data em formato ISO (yyyy-mm-dd) ou Date */
  value?: string | Date;
  /** Função chamada quando a data muda */
  onChange?: (value: string) => void;
  /** Placeholder do input */
  placeholder?: string;
  /** Se o input está desabilitado */
  disabled?: boolean;
  /** Se o input é obrigatório */
  required?: boolean;
  /** Data mínima permitida */
  min?: string;
  /** Data máxima permitida */
  max?: string;
}

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
export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder = 'Selecione a data',
  disabled = false,
  required = false,
  min,
  max
}) => {
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
      style={{
        fontFamily: 'inherit',
        colorScheme: 'light', // Força tema claro do datepicker
      }}
    />
  );
};

export default DateInput;