import React from 'react';
import { TextareaContainer, StyledTextarea, HelperText, CharacterCount } from './styles';
import type { TextareaProps } from './types';

export default function Textarea({
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  rows = 3,
  className,
  id,
  name,
  helperText,
  error = false,
  maxLength
}: TextareaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const showCharacterCount = maxLength && maxLength > 0;
  const currentLength = value.length;

  return (
    <TextareaContainer className="flex flex-col w-full">
      <StyledTextarea
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        $error={error}
        $disabled={disabled}
        className={`
          w-full min-h-[80px] p-3
          text-sm font-normal leading-relaxed
          border-2 rounded-lg
          ${error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}
          ${disabled 
            ? 'bg-slate-50 text-slate-500 cursor-not-allowed focus:border-slate-200 focus:shadow-none' 
            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200'}
          focus:outline-none focus:ring-2 focus:ring-opacity-50 
          ${error ? 'focus:ring-red-300 focus:border-red-500' : 'focus:ring-blue-300 focus:border-blue-500'}
          placeholder:text-slate-400
          transition-all duration-200 shadow-sm
          resize-vertical
          ${className || ''}
        `}
      />
      
      {(helperText || showCharacterCount) && (
        <div className="flex justify-between items-center mt-2 text-xs">
          {helperText && (
            <HelperText className={`${error ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
              {helperText}
            </HelperText>
          )}
          
          {showCharacterCount && (
            <CharacterCount className="text-slate-500 dark:text-slate-400 text-right">
              {currentLength}/{maxLength}
            </CharacterCount>
          )}
        </div>
      )}
    </TextareaContainer>
  );
}
