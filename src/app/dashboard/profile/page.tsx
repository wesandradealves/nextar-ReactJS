'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useProfile } from '@/hooks/useProfile';
import { FormContainer } from '@/components/molecules';
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
  ProfileInfoValue
} from './styles';
import { useMetadata } from '@/hooks/useMetadata';

interface ProfileFormData {
  nome: string;
  email: string;
}

/**
 * Página de edição de perfil do usuário autenticado
 * Subpágina do dashboard - herda o header do template
 * Utiliza o FormContainer para validação e interface consistente
 * 
 * @returns JSX.Element
 */
export default function ProfilePage() {
  const { user } = useAuth();
  const { updateProfile } = useProfile();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);

  useMetadata({
    title: `Nextar - Perfil`,
    ogTitle: `Nextar - Perfil`
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

  if (!user) {
    return null; // Redirecionamento será feito pelo middleware
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>Editar Perfil</ProfileTitle>
        <ProfileDescription>
          Atualize suas informações pessoais
        </ProfileDescription>
      </ProfileHeader>

      {showSuccess && (
        <SuccessMessage>
          ✅ Perfil atualizado com sucesso!
        </SuccessMessage>
      )}

      <ProfileContent>
        {/* Informações do usuário (apenas leitura) */}
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

        {/* Formulário de edição */}
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
          submitText="Atualizar Perfil"
          resetText="Cancelar"
          showReset={true}
        />
        )}
      </ProfileContent>
    </ProfileContainer>
  );
}
