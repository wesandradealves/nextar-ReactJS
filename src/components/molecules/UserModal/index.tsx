import React, { useEffect, useState } from 'react';
import { 
  FormModal, 
  FieldGroup, 
  SectionTitle, 
  ToggleContainer, 
  ToggleSwitch, 
  ToggleInput, 
  ToggleSlider, 
  ToggleInfo, 
  ToggleTitle, 
  ToggleText 
} from '../FormModal';
import { FormSelection } from '../FormSelection';
import { Input } from '../../atoms/Input';
// import { User } from '../../../types';
import { PerfilUsuario } from '../../../utils/enums';
import { useAuth } from '../../../context/auth';
import { useToast } from '../../../hooks/useToast';
import { UserModalProps, UserFormState, PasswordState } from './types';
import {
  PasswordToggleContainer
} from './styles';

/**
 * Modal para criação e edição de usuários
 * 
 * @version 2.0.3
 * @description
 * Modal padronizado usando os novos componentes:
 * - FormModal para estrutura base
 * - FormSelection para seleção de perfil
 * - Campo de setor como texto livre (diferente dos setores de chamados)
 * - Validações integradas
 * - Layout responsivo
 * - Campos de senha obrigatórios na criação
 * - Alteração de senha opcional para gestores (apenas em edição)
 */
export const UserModal = ({
  isOpen,
  onClose,
  user,
  onSave,
  onChangePassword,
  isSaving = false
}: UserModalProps) => {
  const { user: currentUser } = useAuth();
  const { error: showError } = useToast();
  
  const [formData, setFormData] = useState<UserFormState>({
    nome: '',
    email: '',
    perfil: PerfilUsuario.PESQUISADOR,
    setor: ''
  });

  const [passwordData, setPasswordData] = useState<PasswordState>({
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  
  const isEditing = !!user;
  const isManager = currentUser?.perfil === PerfilUsuario.GESTAO;
  const canChangePassword = isEditing && isManager && onChangePassword;
  const requirePassword = !isEditing; // Senha obrigatória na criação

  // Carrega dados do usuário para edição
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        perfil: user.perfil || PerfilUsuario.PESQUISADOR,
        setor: user.setor || ''
      });
    } else if (!user && isOpen) {
      // Reset para criação
      setFormData({
        nome: '',
        email: '',
        perfil: PerfilUsuario.PESQUISADOR,
        setor: ''
      });
    }
    
    // Reset password fields
    setPasswordData({
      newPassword: '',
      confirmPassword: ''
    });
    
    // Para criação, não mostrar campos de senha inicialmente
    // Para edição, manter como estava (false)
    setShowPasswordFields(false);
  }, [user, isOpen]);

  const validateForm = (): boolean => {
    if (!formData.nome.trim()) {
      showError('Nome é obrigatório');
      return false;
    } else if (formData.nome.trim().length < 3) {
      showError('Nome deve ter pelo menos 3 caracteres');
      return false;
    }

    if (!formData.email.trim()) {
      showError('Email é obrigatório');
      return false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showError('Email inválido');
        return false;
      }
    }

    if (!formData.setor.trim()) {
      showError('Setor é obrigatório');
      return false;
    }

    // Validação de senha
    // Para criação: sempre obrigatória
    // Para edição: apenas se campos estão visíveis
    const shouldValidatePassword = requirePassword || showPasswordFields;
    
    if (shouldValidatePassword) {
      if (!passwordData.newPassword.trim()) {
        showError('Senha é obrigatória');
        return false;
      } else if (passwordData.newPassword.length < 6) {
        showError('Senha deve ter pelo menos 6 caracteres');
        return false;
      }

      if (!passwordData.confirmPassword.trim()) {
        showError('Confirmação de senha é obrigatória');
        return false;
      } else if (passwordData.newPassword !== passwordData.confirmPassword) {
        showError('Senhas não conferem');
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing) {
        // Editar usuário existente
        await onSave(formData);
        
        // Se tem alteração de senha, executar separadamente
        if (showPasswordFields && passwordData.newPassword && onChangePassword && user) {
          await onChangePassword(user.id, passwordData.newPassword);
        }
      } else {
        // Criar novo usuário - incluir dados de senha
        const createData = {
          ...formData,
          senha: passwordData.newPassword,
          // Campos obrigatórios para CreateUserData
          usuario: formData.email, // Usar email como usuário
          setor: formData.setor // Usar setor selecionado
        };
        await onSave(createData);
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: 'newPassword' | 'confirmPassword', value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const profileOptions = [
    {
      id: PerfilUsuario.PESQUISADOR,
      label: 'Pesquisador',
      description: 'Pode visualizar e criar chamados de manutenção',
      color: '#3b82f6',
      icon: '🔬'
    },
    {
      id: PerfilUsuario.AGENTE,
      label: 'Agente de Manutenção',
      description: 'Executa manutenções e atualiza status dos chamados',
      color: '#10b981',
      icon: '🔧'
    },
    {
      id: PerfilUsuario.GESTAO,
      label: 'Gestão',
      description: 'Administra usuários, setores e tem acesso completo ao sistema',
      color: '#f59e0b',
      icon: '👑'
    }
  ];

  const isFormValid = formData.nome.trim() && 
                     formData.email.trim() && 
                     formData.setor.trim() &&
                     // Para criação, validar se senha está preenchida
                     (isEditing || passwordData.newPassword.trim());

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Usuário' : 'Novo Usuário'}
      subtitle={isEditing ? 'Atualize as informações do usuário' : 'Preencha os dados do novo usuário'}
      confirmText={isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
      onConfirm={handleSave}
      isLoading={isSaving}
      isConfirmDisabled={!isFormValid}
      size="medium"
    >
      <FieldGroup className="flex flex-col gap-4">
        <div>
          <Input
            placeholder="Nome completo"
            value={formData.nome}
            onChange={(e) => handleFieldChange('nome', e.target.value)}
          />
        </div>

        <div>
          <Input
            type="email"
            placeholder="Email do usuário"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
          />
        </div>
      </FieldGroup>

      <FieldGroup className="flex flex-col gap-4 mt-6">
        <SectionTitle className="text-sm font-semibold text-gray-700 mb-1">Perfil do Usuário</SectionTitle>
        <FormSelection
          options={profileOptions}
          value={formData.perfil}
          onChange={(value) => handleFieldChange('perfil', value)}
        />
      </FieldGroup>

      <FieldGroup className="flex flex-col gap-4 mt-6">
        <SectionTitle className="text-sm font-semibold text-gray-700 mb-1">Setor do Usuário</SectionTitle>
        <div>
          <Input
            placeholder="Digite o setor do usuário (ex: TI, Administração, etc.)"
            value={formData.setor}
            onChange={(e) => handleFieldChange('setor', e.target.value)}
          />
        </div>
      </FieldGroup>

      {/* Seção de Senha */}
      {(requirePassword || canChangePassword) && (
        <FieldGroup className="flex flex-col gap-4 mt-6">
          {requirePassword ? (
            <>
              {/* Campos obrigatórios para criação */}
              <SectionTitle className="text-sm font-semibold text-gray-700 mb-1">Definir Senha</SectionTitle>
              <div>
                <Input
                  type="password"
                  placeholder="Senha (mínimo 6 caracteres)"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Confirme a senha"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              {/* Toggle para edição de senha (apenas para gestores) */}
              <ToggleContainer className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 w-full">
                <ToggleSwitch className="relative inline-block w-11 h-6 cursor-pointer">
                  <ToggleInput
                    type="checkbox"
                    checked={showPasswordFields}
                    onChange={(e) => setShowPasswordFields(e.target.checked)}
                    className="opacity-0 w-0 h-0"
                  />
                  <ToggleSlider 
                    $checked={showPasswordFields} 
                    className={`
                      absolute cursor-pointer top-0 left-0 right-0 bottom-0 
                      transition-all duration-200 rounded-full
                      ${showPasswordFields ? 'bg-green-500' : 'bg-gray-300'}
                    `}
                  />
                </ToggleSwitch>
                <ToggleInfo className="flex-1 ml-3">
                  <ToggleTitle className="font-medium text-gray-900">Redefinir senha</ToggleTitle>
                  <ToggleText className="text-sm text-gray-500">
                    {showPasswordFields ? 'Campos habilitados' : 'Clique para habilitar'}
                  </ToggleText>
                </ToggleInfo>
              </ToggleContainer>

              <PasswordToggleContainer $visible={showPasswordFields} className="flex flex-col gap-4 pl-4 border-l-2 border-gray-200">
                <div>
                  <Input
                    type="password"
                    placeholder="Nova senha (mínimo 6 caracteres)"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  />
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Confirme a nova senha"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  />
                </div>
              </PasswordToggleContainer>
            </>
          )}
        </FieldGroup>
      )}
    </FormModal>
  );
}

// Exportação padrão para compatibilidade com código existente
export default UserModal;
