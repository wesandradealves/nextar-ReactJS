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

/**
 * Modal para criação e edição de setores
 * 
 * @version 2.0.3
 * @description
 * Modal padronizado usando os novos componentes:
 * - FormModal para estrutura base
 * - FormSelection para seleção de categoria
 * - Validações integradas via toast
 * - Layout responsivo
 */
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

    return {
      id: categoria,
      label: categoria,
      description: `Setor especializado em ${categoria.toLowerCase()}`,
      color: colors[categoria] || '#6b7280',
      icon: '🔬'
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
      <FieldGroup className="flex flex-col gap-4">
        <div>
          <Input
            placeholder="Nome do setor"
            value={formData.nome}
            onChange={(e) => handleFieldChange('nome', e.target.value)}
          />
        </div>

        <div>
          <Textarea
            placeholder="Descrição do setor (opcional)"
            value={formData.descricao}
            onChange={(value: string) => handleFieldChange('descricao', value)}
            rows={3}
            maxLength={500}
          />
        </div>
      </FieldGroup>

      <FieldGroup className="flex flex-col gap-4 mt-6">
        <SectionTitle className="text-sm font-semibold text-gray-700 mb-1">Categoria Científica</SectionTitle>
        <FormSelection
          options={categoryOptions}
          value={formData.categoria}
          onChange={(value) => handleFieldChange('categoria', value)}
        />
      </FieldGroup>

      <FieldGroup className="flex flex-col gap-4 mt-6">
        <ToggleContainer className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 w-full">
          <ToggleSwitch className="relative inline-block w-11 h-6 cursor-pointer">
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
                transition-all duration-200 rounded-full
                ${formData.ativo ? 'bg-green-500' : 'bg-gray-300'}
              `}
            />
          </ToggleSwitch>
          <ToggleInfo className="flex-1 ml-3">
            <ToggleTitle className="font-medium text-gray-900">Setor ativo</ToggleTitle>
            <ToggleText className="text-sm text-gray-500">
              {formData.ativo ? 'Disponível para receber equipamentos e chamados' : 'Inativo, não aparecerá nas listagens'}
            </ToggleText>
          </ToggleInfo>
        </ToggleContainer>
      </FieldGroup>
    </FormModal>
  );
}
