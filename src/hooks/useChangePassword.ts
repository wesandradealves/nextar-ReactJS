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
 * 
 * @example
 * ```tsx
 * const { changePassword, loading, error } = useChangePassword();
 * 
 * const handleSubmit = async (data) => {
 *   const success = await changePassword(data);
 *   if (success) {
 *     // Senha alterada com sucesso
 *   }
 * };
 * ```
 */
export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const toast = useToast();

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

      // Sucesso
      toast.success(
        'Senha alterada com sucesso!',
        'Sua senha foi atualizada'
      );

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
