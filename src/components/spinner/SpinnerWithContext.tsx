"use client";

import { useLoader } from '@/context/spinner';
import { Spinner } from './index';

/**
 * Componente Spinner com contexto
 * Versão que usa o contexto de loading da aplicação
 * Mantém compatibilidade com o código existente
 */
export const SpinnerWithContext = () => {
  const { isLoading } = useLoader();

  return (
    <Spinner 
      overlay
      visible={isLoading}
      size="large"
      color="#ffffff"
    />
  );
}

// Exportação padrão para compatibilidade com código existente
export default SpinnerWithContext;
