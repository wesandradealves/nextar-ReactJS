'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/useToast';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Hook para alteração de senha do usuário autenticado
 * Integra com o endpoint existente /api/users/change-password
 * Após alteração bem-sucedida, executa logout automático com contador
 * 
 * @example
 * ```tsx
 * const { changePassword, loading, error } = useChangePassword();
 * 
 * const handleSubmit = async (data) => {
 *   const success = await changePassword(data);
 *   if (success) {
 *     // Senha alterada com sucesso - logout automático iniciado
 *   }
 * };
 * ```
 */
export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const toast = useToast();

  /**
   * Executa logout automático com toast de aviso e contador
   */
  const executeAutoLogout = () => {
    let countdown = 5;
    
    // Usar toast.promise ou toast.update seria ideal, mas vamos usar uma abordagem simples
    const showCountdown = () => {
      if (countdown > 0) {
        toast.warning(
          `⚠️ Senha alterada! Desconectando em ${countdown}s`,
          'Por segurança, você será deslogado automaticamente'
        );
        countdown--;
        setTimeout(showCountdown, 1000);
      } else {
        toast.info(
          '🔒 Desconectando...',
          'Redirecionando para página de login'
        );
        // Logout após um breve delay
        setTimeout(() => {
          logout();
        }, 1000);
      }
    };

    // Iniciar countdown
    showCountdown();
  };

  /**
   * Altera a senha do usuário autenticado
   * @param data - Dados da alteração de senha
   * @returns Promise<boolean> - true se sucesso, false se erro
   */
  const changePassword = async (data: ChangePasswordData): Promise<boolean> => {
    if (!user) {
      setError('Usuário não autenticado');
      toast.error('Erro de autenticação', 'Usuário não está logado');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Validar senhas
      if (data.newPassword !== data.confirmPassword) {
        const errorMsg = 'Nova senha e confirmação não conferem';
        setError(errorMsg);
        toast.error('Erro de validação', errorMsg);
        return false;
      }

      if (data.newPassword.length < 6) {
        const errorMsg = 'Nova senha deve ter pelo menos 6 caracteres';
        setError(errorMsg);
        toast.error('Erro de validação', errorMsg);
        return false;
      }

      if (data.currentPassword === data.newPassword) {
        const errorMsg = 'Nova senha deve ser diferente da senha atual';
        setError(errorMsg);
        toast.error('Erro de validação', errorMsg);
        return false;
      }

      const response = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao alterar senha');
      }

      // Sucesso - Iniciar logout automático por segurança
      executeAutoLogout();

      return true;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao alterar senha';
      setError(errorMessage);
      
      toast.error(
        'Erro ao alterar senha',
        errorMessage
      );
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    changePassword,
    loading,
    error,
    clearError: () => setError(null)
  };
};
