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
  return (
    <ButtonElement
      type={type}
      form={form}
      className={className}
      onClick={handleClick}
      disabled={disabled || loading}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
    >
      <ButtonContent $loading={loading}>
        {loading && <LoadingSpinner />}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </ButtonContent>
    </ButtonElement>
  );
};
