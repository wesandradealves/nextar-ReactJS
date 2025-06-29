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
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>Meu Perfil</ProfileTitle>
        <ProfileDescription>
          Gerencie suas informações pessoais e configurações de segurança
        </ProfileDescription>
      </ProfileHeader>

      {showSuccess && (
        <SuccessMessage>
          ✅ Perfil atualizado com sucesso!
        </SuccessMessage>
      )}

      {showPasswordSuccess && (
        <SuccessMessage>
          ✅ Senha alterada com sucesso!
        </SuccessMessage>
      )}

      <ProfileContent>
        {/* Informações básicas do usuário (apenas leitura) */}
        <ProfileSection>
          <SectionTitle>Informações da Conta</SectionTitle>
          <SectionDescription>
            Informações básicas da sua conta no sistema
          </SectionDescription>
          
          <ProfileInfo>
            <ProfileInfoItem>
              <ProfileInfoLabel>ID:</ProfileInfoLabel>
              <ProfileInfoValue>{user.id}</ProfileInfoValue>
            </ProfileInfoItem>
            <ProfileInfoItem>
              <ProfileInfoLabel>Perfil:</ProfileInfoLabel>
              <ProfileInfoValue>{user.perfil}</ProfileInfoValue>
            </ProfileInfoItem>
          </ProfileInfo>
        </ProfileSection>

        {/* Formulário de edição de dados pessoais */}
        <ProfileSection>
          <SectionTitle>Dados Pessoais</SectionTitle>
          <SectionDescription>
            Atualize suas informações pessoais como nome e email
          </SectionDescription>
          
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
        </ProfileSection>

        {/* Formulário de alteração de senha */}
        <ProfileSection>
          <SectionTitle>Segurança</SectionTitle>
          <SectionDescription>
            Altere sua senha para manter sua conta segura
          </SectionDescription>
          
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
        </ProfileSection>
      </ProfileContent>
    </ProfileContainer>
  );
}
