import React, { useEffect, useState } from 'react';
import { FormModal } from '../FormModal';
import { FormSelection } from '../FormSelection';
import { Input } from '../../atoms/Input';
import { PerfilUsuario } from '../../../utils/enums';
import { useAuth } from '../../../context/auth';
import { useToast } from '../../../hooks/useToast';
import { UserModalProps, UserFormState, PasswordState } from './types';
import { ToggleSwitch, ToggleInput, ToggleSlider } from './styles';

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

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        perfil: user.perfil || PerfilUsuario.PESQUISADOR,
        setor: user.setor || ''
      });
    } else if (!user && isOpen) {
      setFormData({
        nome: '',
        email: '',
        perfil: PerfilUsuario.PESQUISADOR,
        setor: ''
      });
    }
    
    setPasswordData({
      newPassword: '',
      confirmPassword: ''
    });
    
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
        await onSave(formData);
        
        if (showPasswordFields && passwordData.newPassword && onChangePassword && user) {
          await onChangePassword(user.id, passwordData.newPassword);
        }
      } else {
        const createData = {
          ...formData,
          senha: passwordData.newPassword,
          usuario: formData.email,
          setor: formData.setor
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
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
            👤 Informações Pessoais
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <Input
                  placeholder="Ex: João Silva Santos"
                  value={formData.nome}
                  onChange={(e) => handleFieldChange('nome', e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nome como aparecerá no sistema
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  placeholder="joao.silva@instituicao.gov.br"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email institucional para login
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
            🛡️ Permissões e Acesso
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Perfil do Usuário *
              </label>
              <FormSelection
                options={profileOptions}
                value={formData.perfil}
                onChange={(value) => handleFieldChange('perfil', value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Define as permissões e funcionalidades disponíveis
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Setor/Departamento *
              </label>
              <Input
                placeholder="Ex: Tecnologia da Informação, Laboratório de Biologia"
                value={formData.setor}
                onChange={(e) => handleFieldChange('setor', e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Setor de trabalho ou departamento do usuário
              </p>
            </div>
          </div>
        </div>

        {(requirePassword || canChangePassword) && (
          <div className="space-y-6">
            <div className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
              🔐 Configuração de Senha
            </div>
            
            {requirePassword ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-500 text-lg">ℹ️</div>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Senha Obrigatória</h4>
                      <p className="text-sm text-blue-700">
                        Defina uma senha segura para o novo usuário. Recomenda-se pelo menos 8 caracteres.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nova Senha *
                    </label>
                    <Input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Senha *
                    </label>
                    <Input
                      type="password"
                      placeholder="Digite novamente"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-base flex items-center gap-2">
                        {showPasswordFields ? '🔓' : '🔒'} Alterar Senha do Usuário
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {showPasswordFields 
                          ? '🟡 Campos habilitados - Configure nova senha abaixo' 
                          : '🔒 Ative para permitir alteração da senha'}
                      </p>
                    </div>
                    
                    <ToggleSwitch className="relative inline-block w-14 h-7 ml-4">
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
                          transition-all duration-300 rounded-full shadow-lg
                          ${showPasswordFields 
                            ? 'bg-gradient-to-r from-orange-400 to-orange-500' 
                            : 'bg-gradient-to-r from-gray-300 to-gray-400'}
                          before:content-[''] before:absolute before:h-5 before:w-5 before:left-1 before:bottom-1
                          before:bg-white before:rounded-full before:transition-transform before:duration-300 before:shadow-md
                          ${showPasswordFields ? 'before:translate-x-7' : 'before:translate-x-0'}
                        `}
                      />
                    </ToggleSwitch>
                  </div>
                </div>

                {showPasswordFields && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-400 rounded-r-lg p-4 space-y-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="text-orange-500 text-lg">⚠️</div>
                      <div>
                        <h4 className="font-medium text-orange-900 mb-1">Alteração de Senha</h4>
                        <p className="text-sm text-orange-700">
                          Esta ação irá alterar a senha do usuário. Ele precisará usar a nova senha no próximo login.
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nova Senha *
                        </label>
                        <Input
                          type="password"
                          placeholder="Nova senha (mínimo 6 caracteres)"
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmar Nova Senha *
                        </label>
                        <Input
                          type="password"
                          placeholder="Digite a nova senha novamente"
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-green-500 text-lg">✅</div>
              <div>
                <h4 className="font-medium text-green-900 mb-1">Dica sobre Usuários</h4>
                <p className="text-sm text-green-700 leading-relaxed">
                  <strong>Pesquisadores</strong> podem criar chamados e visualizar equipamentos. 
                  <strong>Agentes</strong> executam manutenções e atualizam status. 
                  <strong>Gestão</strong> tem acesso administrativo completo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormModal>
  );
};

export default UserModal;
