import React, { createContext, useContext, useState } from 'react';

/**
 * Props para o contexto do carregador/spinner
 * @interface LoaderContextProps
 */
interface LoaderContextProps {
  /** Estado atual do carregamento */
  isLoading: boolean;
  /** Função para definir o estado de carregamento */
  setLoading: (loading: boolean) => void;
}

/**
 * Contexto para gerenciar estado de carregamento global da aplicação
 * @default undefined
 */
const LoaderContext = createContext<LoaderContextProps | undefined>(undefined);

/**
 * Provider para o contexto de carregamento
 * Fornece funcionalidade de loading/spinner para toda a aplicação
 * 
 * @param children - Componentes filhos que terão acesso ao contexto
 * @returns JSX.Element
 * 
 * @example
 * ```tsx
 * <LoaderProvider>
 *   <App />
 * </LoaderProvider>
 * ```
 */
export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Função para alterar o estado de carregamento
   * @param loading - Novo estado de carregamento
   */
  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <LoaderContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de carregamento
 * Deve ser usado dentro de um LoaderProvider
 * 
 * @returns {LoaderContextProps} Objeto com isLoading e setLoading
 * @throws {Error} Quando usado fora do LoaderProvider
 * 
 * @example
 * ```tsx
 * const { isLoading, setLoading } = useLoader();
 * 
 * const handleSubmit = async () => {
 *   setLoading(true);
 *   try {
 *     await api.submit(data);
 *   } finally {
 *     setLoading(false);
 *   }
 * };
 * ```
 */
export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};