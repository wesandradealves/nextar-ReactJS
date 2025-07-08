"use client";

import { BadgeElement } from './styles';
import type { BadgeProps } from './types';

export const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  dot = false,
  className,
  onClick
}: BadgeProps) => {
  const variantClasses = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-red-500 text-white',
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  };

  const sizeClasses = dot 
    ? {
        small: 'w-2 h-2',
        medium: 'w-3 h-3',
        large: 'w-4 h-4'
      }
    : {
        small: 'px-2 py-0.5 text-xs min-h-5',
        medium: 'px-3 py-1 text-sm min-h-6',
        large: 'px-4 py-1.5 text-base min-h-8'
      };

  return (
    <BadgeElement
      className={`
        inline-flex items-center justify-center font-medium whitespace-nowrap transition-all duration-200
        ${dot ? 'rounded-full' : 'rounded-md'}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${onClick ? 'cursor-pointer hover:shadow-md active:shadow-sm' : ''}
        ${className || ''}
      `}
      onClick={onClick}
      $variant={variant}
      $size={size}
      $dot={dot}
      $clickable={!!onClick}
    >
      {!dot && children}
    </BadgeElement>
  );
};
