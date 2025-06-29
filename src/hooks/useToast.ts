'use client';

import { toast } from 'react-toastify';

/**
 * Hook personalizado para notificações usando react-toastify
 * Fornece helpers pré-configurados para diferentes tipos de toast
 * 
 * @example
 * ```tsx
 * const { success, error, warning, info } = useToast();
 * 
 * success('Operação realizada com sucesso!');
 * error('Erro ao processar solicitação');
 * warning('Atenção: Dados podem estar desatualizados');
 * info('Nova versão disponível');
 * ```
 */
export const useToast = () => {
  const success = (message: string, description?: string) => {
    const content = description ? `${message}\n${description}` : message;
    toast.success(content, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const error = (message: string, description?: string) => {
    const content = description ? `${message}\n${description}` : message;
    toast.error(content, {
      position: 'top-right',
      autoClose: 7000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const warning = (message: string, description?: string) => {
    const content = description ? `${message}\n${description}` : message;
    toast.warning(content, {
      position: 'top-right',
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const info = (message: string, description?: string) => {
    const content = description ? `${message}\n${description}` : message;
    toast.info(content, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return {
    success,
    error,
    warning,
    info,
    // Re-export do toast original para casos especiais
    toast
  };
};
