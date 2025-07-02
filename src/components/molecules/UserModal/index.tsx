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
import { User } from '../../../types';
import { PerfilUsuario } from '../../../utils/enums';
import { useAuth } from '../../../context/auth';

/**
 * Props do UserModal
 */
export interface UserModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Função para fechar o modal */
  onClose: () => void;
  /** Usuário para edição (undefined para criação) */
  user?: User;
  /** Callback para salvar usuário */
  onSave: (userData: Partial<User>) => Promise<void>;
  /** Callback para alterar senha (apenas para gestores) */
  onChangePassword?: (userId: string, newPassword: string) => Promise<void>;
  /** Se está salvando */
  isSaving?: boolean;
}

/**
 * Modal para criação e edição de usuários
 * 
 * @version 2.0.1
 * @description
 * Modal padronizado usando os novos componentes:
 * - FormModal para estrutura base
 * - FormSelection para seleção de perfil
 * - Validações integradas
 * - Layout responsivo
 * - Alteração de senha para gestores (apenas em edição)
 */
export default function UserModal({
  isOpen,
  onClose,
  user,
  onSave,
  onChangePassword,
  isSaving = false
}: UserModalProps) {
  const { user: currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    perfil: PerfilUsuario.PESQUISADOR
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const isEditing = !!user;
  const isManager = currentUser?.perfil === PerfilUsuario.GESTAO;
  const canChangePassword = isEditing && isManager && onChangePassword;

  // Carrega dados do usuário para edição
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        perfil: user.perfil || PerfilUsuario.PESQUISADOR
      });
    } else if (!user && isOpen) {
      // Reset para criação
      setFormData({
        nome: '',
        email: '',
        perfil: PerfilUsuario.PESQUISADOR
      });
    }
    
    // Reset password fields
    setPasswordData({
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordFields(false);
    setErrors({});
  }, [user, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
    }

    // Validação de senha (apenas se campos estão visíveis)
    if (showPasswordFields) {
      if (!passwordData.newPassword.trim()) {
        newErrors.newPassword = 'Nova senha é obrigatória';
      } else if (passwordData.newPassword.length < 6) {
        newErrors.newPassword = 'Senha deve ter pelo menos 6 caracteres';
      }

      if (!passwordData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não conferem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      // Salvar dados do usuário
      await onSave(formData);
      
      // Se tem alteração de senha, executar separadamente
      if (showPasswordFields && passwordData.newPassword && onChangePassword && user) {
        await onChangePassword(user.id, passwordData.newPassword);
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Remove erro quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePasswordChange = (field: 'newPassword' | 'confirmPassword', value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    
    // Remove erro quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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

  const isFormValid = formData.nome.trim() && formData.email.trim() && !Object.keys(errors).length;

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
      <FieldGroup>
        <div>
          <Input
            placeholder="Nome completo"
            value={formData.nome}
            onChange={(e) => handleFieldChange('nome', e.target.value)}
          />
          {errors.nome && (
            <div style={{ 
              fontSize: '12px', 
              color: '#ef4444', 
              marginTop: '4px' 
            }}>
              {errors.nome}
            </div>
          )}
        </div>

        <div>
          <Input
            type="email"
            placeholder="Email do usuário"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
          />
          {errors.email && (
            <div style={{ 
              fontSize: '12px', 
              color: '#ef4444', 
              marginTop: '4px' 
            }}>
              {errors.email}
            </div>
          )}
        </div>
      </FieldGroup>

      <FieldGroup>
        <SectionTitle>Perfil do Usuário</SectionTitle>
        <FormSelection
          options={profileOptions}
          value={formData.perfil}
          onChange={(value) => handleFieldChange('perfil', value)}
        />
      </FieldGroup>

      {canChangePassword && (
        <FieldGroup>
          <ToggleContainer style={{ width: '100%' }}>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={showPasswordFields}
                onChange={(e) => setShowPasswordFields(e.target.checked)}
              />
              <ToggleSlider $checked={showPasswordFields} />
            </ToggleSwitch>
            <ToggleInfo>
              <ToggleTitle>Redefinir senha</ToggleTitle>
              <ToggleText>
                {showPasswordFields ? 'Campos habilitados' : 'Clique para habilitar'}
              </ToggleText>
            </ToggleInfo>
          </ToggleContainer>

          {showPasswordFields && (
            <>
              <div>
                <Input
                  type="password"
                  placeholder="Nova senha (mínimo 6 caracteres)"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                />
                {errors.newPassword && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#ef4444', 
                    marginTop: '4px' 
                  }}>
                    {errors.newPassword}
                  </div>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Confirme a nova senha"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                />
                {errors.confirmPassword && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#ef4444', 
                    marginTop: '4px' 
                  }}>
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </>
          )}
        </FieldGroup>
      )}
    </FormModal>
  );
}
