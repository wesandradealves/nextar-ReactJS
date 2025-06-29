import { useState } from 'react';
import { User } from '@/types';
import { useAuth } from '@/context/auth';
import { useCache } from '@/context/cache';

interface ProfileUpdateData {
  nome: string;
  email: string;
}

interface UseProfileReturn {
  isLoading: boolean;
  updateProfile: (data: ProfileUpdateData) => Promise<User>;
  error: string | null;
}

/**
 * Hook personalizado para gerenciar atualização de perfil do usuário
 * 
 * @returns {UseProfileReturn} Objeto com isLoading, updateProfile e error
 * 
 * @example
 * ```tsx
 * const { isLoading, updateProfile, error } = useProfile();
 * 
 * const handleSubmit = async (data) => {
 *   try {
 *     const updatedUser = await updateProfile(data);
 *     console.log('Perfil atualizado:', updatedUser);
 *   } catch (error) {
 *     console.error('Erro ao atualizar:', error);
 *   }
 * };
 * ```
 */
export const useProfile = (): UseProfileReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUser } = useAuth();
  const cache = useCache();

  /**
   * Atualiza os dados do perfil do usuário autenticado
   * @param data - Dados para atualização (nome e email)
   * @returns Promise<User> - Dados atualizados do usuário
   * @throws {Error} Quando a atualização falha
   */
  const updateProfile = async (data: ProfileUpdateData): Promise<User> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/profile?userId=${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro ao atualizar perfil');
      }

      // Atualizar cache com os novos dados
      cache.set('current_user', result.data, 60 * 60 * 1000, ['auth', 'user', 'profile']);
      cache.invalidateByTag('user');

      // Atualizar contexto de autenticação
      updateUser(result.data);

      return result.data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updateProfile,
    error,
  };
};
