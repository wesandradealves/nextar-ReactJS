import React, { useState, useEffect } from 'react';
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
import Textarea from '../../atoms/Textarea';
import type { CreateSetorData, UpdateSetorData } from '@/types';
import { CATEGORIAS_CIENTIFICAS } from '@/utils/enums';
import { useToast } from '../../../hooks/useToast';
import { SetorModalProps } from './types';

export default function SetorModal({
  isOpen,
  onClose,
  setor,
  onSubmit,
  isLoading = false
}: SetorModalProps) {
  const { error: showError } = useToast();
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: CATEGORIAS_CIENTIFICAS[0] as string,
    ativo: true
  });
  
  const isEditing = !!setor;

  // Carrega dados do setor para edição
  useEffect(() => {
    if (setor && isOpen) {
      setFormData({
        nome: setor.nome || '',
        descricao: setor.descricao || '',
        categoria: setor.categoria || CATEGORIAS_CIENTIFICAS[0] as string,
        ativo: setor.ativo !== undefined ? setor.ativo : true
      });
    } else if (!setor && isOpen) {
      // Reset para criação
      setFormData({
        nome: '',
        descricao: '',
        categoria: CATEGORIAS_CIENTIFICAS[0] as string,
        ativo: true
      });
    }
  }, [setor, isOpen]);

  const validateForm = (): boolean => {
    if (!formData.nome.trim()) {
      showError('Nome é obrigatório');
      return false;
    } else if (formData.nome.trim().length < 3) {
      showError('Nome deve ter pelo menos 3 caracteres');
      return false;
    } else if (formData.nome.trim().length > 100) {
      showError('Nome deve ter no máximo 100 caracteres');
      return false;
    }

    if (formData.descricao && formData.descricao.length > 500) {
      showError('Descrição deve ter no máximo 500 caracteres');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing && setor) {
        // Editar setor existente
        const updateData: UpdateSetorData = {
          nome: formData.nome,
          categoria: formData.categoria,
          descricao: formData.descricao,
          ativo: formData.ativo
        };
        await onSubmit?.(updateData, setor.id);
      } else {
        // Criar novo setor
        const createData: CreateSetorData = {
          nome: formData.nome,
          categoria: formData.categoria,
          descricao: formData.descricao,
          ativo: formData.ativo
        };
        await onSubmit?.(createData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar setor:', error);
    }
  };

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const categoryOptions = CATEGORIAS_CIENTIFICAS.map(categoria => {
    const colors: Record<string, string> = {
      'Biologia': '#10b981',
      'Meteorologia': '#3b82f6', 
      'Glaciologia': '#06b6d4',
      'Astronomia': '#8b5cf6',
      'Geologia': '#f59e0b',
      'Oceanografia': '#0ea5e9',
      'Física Atmosférica': '#84cc16',
      'Medicina': '#ef4444',
      'Comunicações': '#6366f1',
      'Logística': '#f97316'
    };

    const icons: Record<string, string> = {
      'Biologia': '🧬',
      'Meteorologia': '🌦️',
      'Glaciologia': '❄️', 
      'Astronomia': '🔭',
      'Geologia': '🪨',
      'Oceanografia': '🌊',
      'Física Atmosférica': '🌪️',
      'Medicina': '⚕️',
      'Comunicações': '📡',
      'Logística': '📦'
    };

    return {
      id: categoria,
      label: categoria,
      description: `Setor especializado em ${categoria.toLowerCase()}`,
      color: colors[categoria] || '#6b7280',
      icon: icons[categoria] || '🔬'
    };
  });

  const isFormValid = formData.nome.trim();

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Setor' : 'Novo Setor'}
      subtitle={isEditing ? 'Atualize as informações do setor' : 'Preencha os dados do novo setor'}
      confirmText={isEditing ? 'Salvar Alterações' : 'Criar Setor'}
      onConfirm={handleSave}
      isLoading={isLoading}
      isConfirmDisabled={!isFormValid}
      size="medium"
    >
      <div className="space-y-8">
        <FieldGroup className="space-y-6">
          <SectionTitle className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            📝 Informações Básicas
          </SectionTitle>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Setor *
              </label>
              <Input
                placeholder="Ex: Laboratório de Biologia Marinha"
                value={formData.nome}
                onChange={(e) => handleFieldChange('nome', e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nome identificador único do setor
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <Textarea
                placeholder="Descreva as atividades e responsabilidades do setor..."
                value={formData.descricao}
                onChange={(value: string) => handleFieldChange('descricao', value)}
                rows={4}
                maxLength={500}
                className="w-full resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.descricao.length}/500 caracteres
              </p>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup className="space-y-6">
          <SectionTitle className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            🔬 Categoria Científica
          </SectionTitle>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área de Especialização *
              </label>
              <FormSelection
                options={categoryOptions}
                value={formData.categoria}
                onChange={(value) => handleFieldChange('categoria', value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Selecione a categoria científica que melhor define este setor
              </p>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup className="space-y-6">
          <SectionTitle className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            ⚙️ Configurações
          </SectionTitle>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <ToggleContainer className="flex items-center justify-between">
              <ToggleInfo className="flex-1">
                <ToggleTitle className="font-semibold text-gray-900 text-base flex items-center gap-2">
                  {formData.ativo ? '✅' : '❌'} Status do Setor
                </ToggleTitle>
                <ToggleText className="text-sm text-gray-600 mt-1">
                  {formData.ativo 
                    ? '🟢 Ativo - Disponível para receber equipamentos e chamados' 
                    : '🔴 Inativo - Não aparecerá nas listagens'}
                </ToggleText>
              </ToggleInfo>
              
              <ToggleSwitch className="relative inline-block w-14 h-7 ml-4">
                <ToggleInput
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) => handleFieldChange('ativo', e.target.checked)}
                  className="opacity-0 w-0 h-0"
                />
                <ToggleSlider 
                  $checked={formData.ativo} 
                  className={`
                    absolute cursor-pointer top-0 left-0 right-0 bottom-0 
                    transition-all duration-300 rounded-full shadow-lg
                    ${formData.ativo 
                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                      : 'bg-gradient-to-r from-gray-300 to-gray-400'}
                  `}
                />
              </ToggleSwitch>
            </ToggleContainer>
          </div>
        </FieldGroup>

        <FieldGroup className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-blue-500 text-lg">💡</div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Dica sobre Setores</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Setores ativos podem receber equipamentos e ter chamados de manutenção criados. 
                  A categoria científica ajuda na organização e filtros do sistema.
                </p>
              </div>
            </div>
          </div>
        </FieldGroup>
      </div>
    </FormModal>
  );
}
