import React, { useState, useCallback, useEffect } from 'react';
import Modal from '../Modal';
import FormContainer from '../FormContainer';
import { Button } from '../../atoms';
import { useAuth } from '@/context/auth';
import type { CreateUserData, UpdateUserData } from '@/types';
import { PerfilUsuario } from '@/utils/enums';
import type { FormFieldConfig } from '../FormContainer/types';
import { UserModalProps } from './types';
import {
  FormSection,
  FieldGroup,
  ProfileSelectContainer,
  ProfileOption,
  ProfileLabel,
  ProfileDescription
} from './styles';

/**
 * Modal de Criação/Edição de Usuário
 * Utiliza FormContainer para validação e Modal para apresentação
 * 
 * @description
 * Modal responsável por:
 * - Criar novos usuários
 * - Editar usuários existentes
 * - Validação de campos em tempo real
 * - Seleção de perfil visual
 * - Integração com API de usuários
 */
export default function UserModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading = false
}: UserModalProps) {
  const { user: currentUser } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState<PerfilUsuario>(
    user?.perfil || PerfilUsuario.PESQUISADOR
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(user);
  const modalTitle = isEditing ? 'Editar Usuário' : 'Novo Usuário';

  // Reset form quando modal abrir/fechar
  useEffect(() => {
    if (isOpen) {
      setSelectedProfile(user?.perfil || PerfilUsuario.PESQUISADOR);
      setIsSubmitting(false);
    }
  }, [isOpen, user]);

  // Configuração dos campos do formulário
  const formFields: FormFieldConfig[] = [
    {
      id: 'nome',
      label: 'Nome Completo',
      type: 'text',
      placeholder: 'Ex: João Silva',
      required: true,
      defaultValue: user?.nome || '',
      validation: {
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
      },
      helpText: 'Nome completo do usuário'
    },
    {
      id: 'email',
      label: 'E-mail',
      type: 'email',
      placeholder: 'Ex: joao@empresa.com',
      required: true,
      defaultValue: user?.email || '',
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        maxLength: 255,
      },
      helpText: 'Endereço de e-mail para login e comunicações'
    },
    {
      id: 'usuario',
      label: 'Nome de Usuário',
      type: 'text',
      placeholder: 'Ex: joao.silva',
      required: true,
      defaultValue: user?.usuario || '',
      validation: {
        minLength: 3,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9._-]+$/,
      },
      helpText: 'Usado para fazer login no sistema'
    },
    // Campo senha: obrigatório na criação, opcional na edição para gestores
    ...(!isEditing || (isEditing && currentUser?.perfil === PerfilUsuario.GESTAO) ? [{
      id: 'senha',
      label: isEditing ? 'Nova Senha (opcional)' : 'Senha',
      type: 'password' as const,
      placeholder: isEditing ? 'Deixe vazio para manter senha atual' : 'Mínimo 6 caracteres',
      required: !isEditing, // Obrigatório apenas na criação
      validation: {
        minLength: 6,
        maxLength: 100,
      },
      helpText: isEditing 
        ? 'Como gestor, você pode alterar a senha deste usuário. Deixe vazio para manter a senha atual.' 
        : 'Senha deve ter pelo menos 6 caracteres'
    }] : []),
    {
      id: 'setor',
      label: 'Setor',
      type: 'text',
      placeholder: 'Ex: TI, RH, Financeiro',
      required: true,
      defaultValue: user?.setor || '',
      validation: {
        minLength: 2,
        maxLength: 100,
      },
      helpText: 'Setor ou departamento do usuário'
    }
  ];

  /**
   * Submit do formulário
   */
  const handleSubmit = useCallback(async (formData: Record<string, string>) => {
    setIsSubmitting(true);
    
    try {
      if (isEditing && user) {
        // Dados para edição (sem senha se não informada)
        const updateData: UpdateUserData = {
          nome: formData.nome,
          email: formData.email,
          usuario: formData.usuario,
          setor: formData.setor,
          perfil: selectedProfile,
          ...(formData.senha && { senha: formData.senha })
        };
        
        await onSubmit(updateData, user.id);
      } else {
        // Dados para criação
        const createData: CreateUserData = {
          nome: formData.nome,
          email: formData.email,
          usuario: formData.usuario,
          senha: formData.senha,
          setor: formData.setor,
          perfil: selectedProfile
        };
        
        await onSubmit(createData);
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      // Erro será tratado pelo hook useUsers
    } finally {
      setIsSubmitting(false);
    }
  }, [isEditing, user, selectedProfile, onSubmit, onClose]);

  /**
   * Profiles disponíveis
   */
  const profiles = [
    {
      value: PerfilUsuario.PESQUISADOR,
      label: 'Pesquisador',
      description: 'Acesso básico para consultas e relatórios',
      color: '#10b981'
    },
    {
      value: PerfilUsuario.AGENTE,
      label: 'Agente',
      description: 'Pode gerenciar chamados e equipamentos',
      color: '#3b82f6'
    },
    {
      value: PerfilUsuario.GESTAO,
      label: 'Gestão',
      description: 'Acesso completo ao sistema',
      color: '#8b5cf6'
    }
  ];

  /**
   * Footer do modal
   */
  const modalFooter = (
    <>
      <Button
        variant="secondary"
        onClick={onClose}
        disabled={isSubmitting || isLoading}
      >
        Cancelar
      </Button>
      <Button
        variant="primary"
        onClick={() => {
          // Trigger form submission
          const form = document.getElementById('user-form') as HTMLFormElement;
          if (form) {
            form.requestSubmit();
          }
        }}
        disabled={isSubmitting || isLoading}
        loading={isSubmitting}
      >
        {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="medium"
      footer={modalFooter}
      closeOnOverlayClick={!isSubmitting && !isLoading}
      closeOnEsc={!isSubmitting && !isLoading}
    >
      <FormSection>
        <FormContainer
          fields={formFields}
          onSubmit={handleSubmit}
          initialValues={{
            nome: user?.nome || '',
            email: user?.email || '',
            usuario: user?.usuario || '',
            setor: user?.setor || '',
            ...(isEditing && { senha: '' })
          }}
          validateOnChange
          validateOnBlur
          submitText={isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
          showReset={false}
          showSubmit={false}
          formId="user-form"
        >
          {/* Seleção de Perfil */}
          <FieldGroup>
            <ProfileSelectContainer>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Perfil de Acesso *
              </h4>
              
              {profiles.map((profile) => (
                <ProfileOption
                  key={profile.value}
                  $selected={selectedProfile === profile.value}
                  $color={profile.color}
                  onClick={() => setSelectedProfile(profile.value)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: `2px solid ${selectedProfile === profile.value ? profile.color : '#d1d5db'}`,
                        backgroundColor: selectedProfile === profile.value ? profile.color : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {selectedProfile === profile.value && (
                        <div
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'white'
                          }}
                        />
                      )}
                    </div>
                    
                    <div>
                      <ProfileLabel>{profile.label}</ProfileLabel>
                      <ProfileDescription>{profile.description}</ProfileDescription>
                    </div>
                  </div>
                </ProfileOption>
              ))}
            </ProfileSelectContainer>
          </FieldGroup>
        </FormContainer>
      </FormSection>
    </Modal>
  );
}
