'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useProfile } from '@/hooks/useProfile';
import { useChangePassword } from '@/hooks/useChangePassword';
import FormContainer from '@/components/molecules/FormContainer';
import { 
  ProfileContainer, 
  ProfileHeader, 
  ProfileTitle, 
  ProfileDescription,
  ProfileContent,
  SuccessMessage,
  ProfileInfo,
  ProfileInfoItem,
  ProfileInfoLabel,
  ProfileInfoValue,
  ProfileSection,
  SectionTitle,
  SectionDescription
} from './styles';
import { useMetadata } from '@/hooks/useMetadata';

interface ProfileFormData {
  nome: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Página de edição de perfil do usuário autenticado
 * Subpágina do dashboard - herda o header do template
 * Utiliza o FormContainer para validação e interface consistente
 * Inclui seção para alteração de senha
 * 
 * @returns JSX.Element
 */
export default function ProfilePage() {
  const { user } = useAuth();
  const { updateProfile } = useProfile();
  const { changePassword } = useChangePassword();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);

  useMetadata({
    title: `Nextar - Meu Perfil`,
    ogTitle: `Nextar - Meu Perfil`
  });

  // Aguardar os dados do usuário estarem disponíveis
  useEffect(() => {
    if (user) {
      setIsFormReady(true);
    }
  }, [user]);

  /**
   * Manipula submissão do formulário de perfil
   * @param data - Dados do formulário validados
   */
  const handleSubmit = async (data: Record<string, string>) => {
    try {
      const profileData: ProfileFormData = {
        nome: data.nome,
        email: data.email
      };
      
      await updateProfile(profileData);
      
      // Mostrar mensagem de sucesso
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      // Erro será mostrado pelo FormContainer através do hook
    }
  };

  /**
   * Manipula submissão do formulário de alteração de senha
   * @param data - Dados do formulário de senha
   */
  const handlePasswordSubmit = async (data: Record<string, string>) => {
    try {
      const passwordData: PasswordFormData = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      };
      
      const success = await changePassword(passwordData);
      
      if (success) {
        // Mostrar mensagem de sucesso
        setShowPasswordSuccess(true);
        setTimeout(() => setShowPasswordSuccess(false), 3000);
      }
      
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      // Erro será mostrado via toast pelo hook useChangePassword
    }
  };

  if (!user) {
    return null; // Redirecionamento será feito pelo middleware
  }

  return (
    <ProfileContainer className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
      <ProfileHeader className="mb-6">
        <ProfileTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Meu Perfil</ProfileTitle>
        <ProfileDescription className="text-gray-600 dark:text-gray-400">
          Gerencie suas informações pessoais e configurações de segurança
        </ProfileDescription>
      </ProfileHeader>

      {showSuccess && (
        <SuccessMessage className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
            </div>
            <div className="text-green-700 dark:text-green-400 font-medium">
              Perfil atualizado com sucesso!
            </div>
          </div>
        </SuccessMessage>
      )}

      {showPasswordSuccess && (
        <SuccessMessage className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
            </div>
            <div className="text-green-700 dark:text-green-400 font-medium">
              Senha alterada com sucesso!
            </div>
          </div>
        </SuccessMessage>
      )}

      <ProfileContent className="space-y-8">
        {/* Informações básicas do usuário (apenas leitura) */}
        <ProfileSection className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <SectionTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Informações da Conta</SectionTitle>
          <SectionDescription className="text-gray-600 dark:text-gray-400 mb-4">
            Informações básicas da sua conta no sistema
          </SectionDescription>
          
          <ProfileInfo className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileInfoItem className="flex flex-col space-y-1">
              <ProfileInfoLabel className="text-sm font-medium text-gray-500 dark:text-gray-400">ID:</ProfileInfoLabel>
              <ProfileInfoValue className="text-sm text-gray-900 dark:text-white font-mono bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">{user.id}</ProfileInfoValue>
            </ProfileInfoItem>
            <ProfileInfoItem className="flex flex-col space-y-1">
              <ProfileInfoLabel className="text-sm font-medium text-gray-500 dark:text-gray-400">Perfil:</ProfileInfoLabel>
              <ProfileInfoValue className="text-sm text-gray-900 dark:text-white">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {user.perfil}
                </span>
              </ProfileInfoValue>
            </ProfileInfoItem>
          </ProfileInfo>
        </ProfileSection>

        {/* Formulário de edição de dados pessoais */}
        <ProfileSection className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-lg">✏️</span>
              <SectionTitle className="text-lg font-semibold text-gray-900 dark:text-white">Dados Pessoais</SectionTitle>
            </div>
            <SectionDescription className="text-gray-600 dark:text-gray-400 mt-1">
              Atualize suas informações pessoais como nome e email
            </SectionDescription>
          </div>
          
          <div className="p-6">
          {isFormReady && (
            <FormContainer
              initialValues={{
                nome: user.nome || '',
                email: user.email || ''
              }}
              onSubmit={handleSubmit}
              fields={[
                {
                  id: 'nome',
                  label: 'Nome completo',
                  type: 'text',
                  placeholder: 'Digite seu nome completo',
                  required: true,
                  validation: {
                    minLength: 2,
                    custom: (value: string) => {
                      if (!value.trim()) return 'Nome é obrigatório';
                      if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
                      return null;
                    }
                  }
                },
                {
                  id: 'email',
                  label: 'Email',
                  type: 'email',
                  placeholder: 'Digite seu email',
                  required: true,
                  validation: {
                    custom: (value: string) => {
                      if (!value.trim()) return 'Email é obrigatório';
                      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
                      return null;
                    }
                  }
                }
              ]}
              submitText="Atualizar Dados"
              resetText="Cancelar"
              showReset={true}
            />
          )}
          </div>
        </ProfileSection>

        {/* Formulário de alteração de senha */}
        <ProfileSection className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔒</span>
              <SectionTitle className="text-lg font-semibold text-gray-900 dark:text-white">Segurança</SectionTitle>
            </div>
            <SectionDescription className="text-gray-600 dark:text-gray-400 mt-1">
              Altere sua senha para manter sua conta segura
            </SectionDescription>
          </div>
          
          <div className="p-6">
            <FormContainer
            onSubmit={handlePasswordSubmit}
            fields={[
              {
                id: 'currentPassword',
                label: 'Senha atual',
                type: 'password',
                placeholder: 'Digite sua senha atual',
                required: true,
                validation: {
                  custom: (value: string) => {
                    if (!value.trim()) return 'Senha atual é obrigatória';
                    return null;
                  }
                }
              },
              {
                id: 'newPassword',
                label: 'Nova senha',
                type: 'password',
                placeholder: 'Digite a nova senha (mínimo 6 caracteres)',
                required: true,
                validation: {
                  minLength: 6,
                  custom: (value: string) => {
                    if (!value.trim()) return 'Nova senha é obrigatória';
                    if (value.length < 6) return 'Nova senha deve ter pelo menos 6 caracteres';
                    return null;
                  }
                }
              },
              {
                id: 'confirmPassword',
                label: 'Confirmar nova senha',
                type: 'password',
                placeholder: 'Digite novamente a nova senha',
                required: true,
                validation: {
                  custom: (value: string, formData?: Record<string, string>) => {
                    if (!value.trim()) return 'Confirmação de senha é obrigatória';
                    if (formData && value !== formData.newPassword) {
                      return 'Senhas não conferem';
                    }
                    return null;
                  }
                }
              }
            ]}
            submitText="Alterar Senha"
            resetText="Limpar"
            showReset={true}
          />
          </div>
        </ProfileSection>
      </ProfileContent>
      
      {/* Footer informativo */}
      <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>🛡️</span>
          <span>Suas informações estão protegidas com criptografia de ponta a ponta</span>
        </div>
      </div>
      </div>
    </ProfileContainer>
  );
}
