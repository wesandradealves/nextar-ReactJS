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
import type { CreateSetorData, UpdateSetorData, Setor } from '@/types';
import { CATEGORIAS_CIENTIFICAS } from '@/utils/enums';

/**
 * Props do SetorModal
 */
export interface SetorModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Função para fechar o modal */
  onClose: () => void;
  /** Setor para edição (undefined para criação) */
  setor?: Setor;
  /** Callback para salvar setor */
  onSubmit: (data: CreateSetorData | UpdateSetorData, id?: string) => Promise<void>;
  /** Se está salvando */
  isLoading?: boolean;
}

/**
 * Modal para criação e edição de setores
 * 
 * @version 2.0.1
 * @description
 * Modal padronizado usando os novos componentes:
 * - FormModal para estrutura base
 * - FormSelection para seleção de categoria
 * - Validações integradas
 * - Layout responsivo
 */
export default function SetorModal({
  isOpen,
  onClose,
  setor,
  onSubmit,
  isLoading = false
}: SetorModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: CATEGORIAS_CIENTIFICAS[0] as string,
    ativo: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
    setErrors({});
  }, [setor, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    } else if (formData.nome.trim().length > 100) {
      newErrors.nome = 'Nome deve ter no máximo 100 caracteres';
    }

    if (formData.descricao && formData.descricao.length > 500) {
      newErrors.descricao = 'Descrição deve ter no máximo 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        await onSubmit(updateData, setor.id);
      } else {
        // Criar novo setor
        const createData: CreateSetorData = {
          nome: formData.nome,
          categoria: formData.categoria,
          descricao: formData.descricao,
          ativo: formData.ativo
        };
        await onSubmit(createData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar setor:', error);
    }
  };

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Remove erro quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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

  const isFormValid = formData.nome.trim() && !Object.keys(errors).length;

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
      <FieldGroup>
        <div>
          <Input
            placeholder="Nome do setor"
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
          <Textarea
            placeholder="Descrição do setor (opcional)"
            value={formData.descricao}
            onChange={(value: string) => handleFieldChange('descricao', value)}
            rows={3}
            maxLength={500}
          />
          {errors.descricao && (
            <div style={{ 
              fontSize: '12px', 
              color: '#ef4444', 
              marginTop: '4px' 
            }}>
              {errors.descricao}
            </div>
          )}
        </div>
      </FieldGroup>

      <FieldGroup>
        <SectionTitle>Categoria Científica</SectionTitle>
        <FormSelection
          options={categoryOptions}
          value={formData.categoria}
          onChange={(value) => handleFieldChange('categoria', value)}
        />
      </FieldGroup>

      <FieldGroup>
        <ToggleContainer style={{ width: '100%' }}>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={formData.ativo}
              onChange={(e) => handleFieldChange('ativo', e.target.checked)}
            />
            <ToggleSlider $checked={formData.ativo} />
          </ToggleSwitch>
          <ToggleInfo>
            <ToggleTitle>Setor ativo</ToggleTitle>
            <ToggleText>
              {formData.ativo ? 'Disponível para receber equipamentos e chamados' : 'Inativo, não aparecerá nas listagens'}
            </ToggleText>
          </ToggleInfo>
        </ToggleContainer>
      </FieldGroup>
    </FormModal>
  );
}
