"use client";
import { ButtonElement, ButtonContent, LoadingSpinner } from './styles';
import type { ButtonProps } from './types';

/**
 * Componente atômico Button
 * Botão reutilizável com múltiplas variantes e estados
 * Segue padrão Atomic Design
 * 
 * @example
 * ```tsx
 * // Botão primário
 * <Button variant="primary">Salvar</Button>
 * 
 * // Botão com loading
 * <Button loading={true}>Carregando...</Button>
 *
 * // Botão com ícone
 * <Button icon={<Icon />} iconPosition="left">Com Ícone</Button>
 * ```
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  type = 'button',
  form,
  className,
  onClick,
  fullWidth = false,
  icon,
  iconPosition = 'left'
}: ButtonProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  // Size-based classes
  const sizeClasses = {
    small: 'py-2 px-4 text-sm min-h-[36px]',
    medium: 'py-3 px-5 text-base min-h-[44px]',
    large: 'py-4 px-6 text-lg min-h-[52px]'
  };

  // Variant-based classes (except primary and danger which use gradient)
  const variantClasses = {
    primary: 'text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300',
    danger: 'text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
    outline: 'bg-transparent text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white'
  };

  return (
    <ButtonElement
      type={type}
      form={form}
      className={`
        inline-flex items-center justify-center rounded-lg font-semibold transition-all
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${fullWidth ? 'w-full' : ''}
        focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-300
        ${className || ''}
      `}
      onClick={handleClick}
      disabled={disabled || loading}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
    >
      <ButtonContent 
        $loading={loading} 
        className="flex items-center gap-2"
      >
        {loading && <LoadingSpinner className="inline-block" />}
        {!loading && icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
        <span className="truncate">{children}</span>
        {!loading && icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
      </ButtonContent>
    </ButtonElement>
  );
};
