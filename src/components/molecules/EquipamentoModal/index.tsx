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
import type { CreateEquipamentoData, UpdateEquipamentoData, Equipamento } from '@/types';
import { useToast } from '../../../hooks/useToast';
import { useSetores } from '../../../hooks/useSetores';

/**
 * Props do EquipamentoModal
 */
export interface EquipamentoModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Função para fechar o modal */
  onClose: () => void;
  /** Equipamento para edição (undefined para criação) */
  equipamento?: Equipamento;
  /** Callback para salvar equipamento */
  onSubmit: (data: CreateEquipamentoData | UpdateEquipamentoData, id?: string) => Promise<void>;
  /** Se está salvando */
  isLoading?: boolean;
}

/**
 * Modal para criação e edição de equipamentos
 * 
 * @version 2.0.4
 * @description
 * Modal padronizado usando os novos componentes:
 * - FormModal para estrutura base
 * - FormSelection para seleção de setor
 * - Validações integradas via toast
 * - Layout responsivo
 * - Validação de código hexadecimal
 * - Integração com setores
 */
export default function EquipamentoModal({
  isOpen,
  onClose,
  equipamento,
  onSubmit,
  isLoading = false
}: EquipamentoModalProps) {
  const { error: showError } = useToast();
  const { allSetores } = useSetores();
  
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    modelo: '',
    setorId: '',
    proximaManutencao: '',
    observacoes: '',
    ativo: true
  });
  
  const isEditing = !!equipamento;

  // Carrega dados do equipamento para edição
  useEffect(() => {
    if (equipamento && isOpen) {
      // Formatar data para input type="date"
      const proximaManutencao = equipamento.proximaManutencao ? 
        new Date(equipamento.proximaManutencao).toISOString().split('T')[0] : '';

      setFormData({
        nome: equipamento.nome || '',
        codigo: equipamento.codigo || '',
        modelo: equipamento.modelo || '',
        setorId: equipamento.setorId || '',
        proximaManutencao,
        observacoes: equipamento.observacoes || '',
        ativo: equipamento.ativo !== undefined ? equipamento.ativo : true
      });
    } else if (!equipamento && isOpen) {
      // Reset para criação
      setFormData({
        nome: '',
        codigo: '',
        modelo: '',
        setorId: allSetores.length > 0 ? allSetores[0].id : '',
        proximaManutencao: '',
        observacoes: '',
        ativo: true
      });
    }
  }, [equipamento, isOpen, allSetores]);

  const validateForm = (): boolean => {
    // Validar nome
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

    // Validar código hexadecimal
    if (!formData.codigo.trim()) {
      showError('Código é obrigatório');
      return false;
    }
    
    const hexPattern = /^[A-Z]{3}\d{3}[A-Z]$/;
    if (!hexPattern.test(formData.codigo.toUpperCase())) {
      showError('Código deve seguir o formato hexadecimal (ex: BIO001A)');
      return false;
    }

    // Validar modelo
    if (!formData.modelo.trim()) {
      showError('Modelo é obrigatório');
      return false;
    } else if (formData.modelo.trim().length < 2) {
      showError('Modelo deve ter pelo menos 2 caracteres');
      return false;
    } else if (formData.modelo.trim().length > 100) {
      showError('Modelo deve ter no máximo 100 caracteres');
      return false;
    }

    // Validar setor
    if (!formData.setorId) {
      showError('Setor é obrigatório');
      return false;
    }

    // Validar data da próxima manutenção
    if (!formData.proximaManutencao) {
      showError('Data da próxima manutenção é obrigatória');
      return false;
    }

    const proximaManutencao = new Date(formData.proximaManutencao);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (proximaManutencao < hoje) {
      showError('A data da próxima manutenção deve ser futura');
      return false;
    }

    // Validar observações (opcional, mas se preenchida, não deve exceder limite)
    if (formData.observacoes && formData.observacoes.length > 500) {
      showError('Observações devem ter no máximo 500 caracteres');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const dataToSave = {
        nome: formData.nome.trim(),
        codigo: formData.codigo.toUpperCase().trim(),
        modelo: formData.modelo.trim(),
        setorId: formData.setorId,
        proximaManutencao: new Date(formData.proximaManutencao).toISOString(),
        observacoes: formData.observacoes.trim(),
        ativo: formData.ativo
      };

      if (isEditing && equipamento) {
        // Editar equipamento existente
        const updateData: UpdateEquipamentoData = dataToSave;
        await onSubmit(updateData, equipamento.id);
      } else {
        // Criar novo equipamento
        const createData: CreateEquipamentoData = dataToSave;
        await onSubmit(createData);
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar equipamento:', error);
      showError('Erro ao salvar equipamento. Verifique os dados e tente novamente.');
    }
  };

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Gerar sugestão de código baseado no setor selecionado
  const generateCodeSuggestion = (setorId: string): string => {
    const setor = allSetores.find(s => s.id === setorId);
    if (!setor) return '';

    const prefixMap: Record<string, string> = {
      'Biologia': 'BIO',
      'Meteorologia': 'MET',
      'Glaciologia': 'GLA',
      'Astronomia': 'AST',
      'Geologia': 'GEO',
      'Oceanografia': 'OCE',
      'Física Atmosférica': 'FIS',
      'Medicina': 'MED',
      'Comunicações': 'COM',
      'Logística': 'LOG'
    };

    const prefix = prefixMap[setor.categoria] || setor.categoria.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z

    return `${prefix}${randomNum}${randomLetter}`;
  };

  const handleSetorChange = (setorId: string) => {
    handleFieldChange('setorId', setorId);
    
    // Se está criando e código está vazio, gerar sugestão
    if (!isEditing && !formData.codigo) {
      const suggestion = generateCodeSuggestion(setorId);
      handleFieldChange('codigo', suggestion);
    }
  };

  // Opções de setores para FormSelection
  const setorOptions = allSetores.map(setor => {
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
      id: setor.id,
      label: setor.nome,
      description: `${setor.categoria} • ${setor.ativo ? 'Ativo' : 'Inativo'}`,
      color: colors[setor.categoria] || '#6b7280',
      icon: '🏢'
    };
  }).filter(setor => {
    // Só mostrar setores ativos para novos equipamentos
    if (!isEditing) {
      const setorData = allSetores.find(s => s.id === setor.id);
      return setorData?.ativo;
    }
    return true; // Para edição, mostrar todos
  });

  const isFormValid = formData.nome.trim() && 
                     formData.codigo.trim() && 
                     formData.modelo.trim() && 
                     formData.setorId && 
                     formData.proximaManutencao;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Equipamento' : 'Novo Equipamento'}
      subtitle={isEditing ? 'Atualize as informações do equipamento' : 'Preencha os dados do novo equipamento'}
      confirmText={isEditing ? 'Salvar Alterações' : 'Criar Equipamento'}
      onConfirm={handleSave}
      isLoading={isLoading}
      isConfirmDisabled={!isFormValid}
      size="large"
    >
      <FieldGroup>
        <SectionTitle>Informações Básicas</SectionTitle>
        <div>
          <Input
            placeholder="Nome do equipamento"
            value={formData.nome}
            onChange={(e) => handleFieldChange('nome', e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            placeholder="Código (ex: BIO001A)"
            value={formData.codigo}
            onChange={(e) => handleFieldChange('codigo', e.target.value.toUpperCase())}
          />
          <Input
            placeholder="Modelo do equipamento"
            value={formData.modelo}
            onChange={(e) => handleFieldChange('modelo', e.target.value)}
          />
        </div>
      </FieldGroup>

      <FieldGroup>
        <SectionTitle>Localização e Manutenção</SectionTitle>
        <FormSelection
          options={setorOptions}
          value={formData.setorId}
          onChange={handleSetorChange}
        />

        <div>
          <Input
            type="date"
            placeholder="Data da próxima manutenção"
            value={formData.proximaManutencao}
            onChange={(e) => handleFieldChange('proximaManutencao', e.target.value)}
          />
        </div>
      </FieldGroup>

      <FieldGroup>
        <SectionTitle>Informações Adicionais</SectionTitle>
        <div>
          <Textarea
            placeholder="Observações sobre o equipamento (opcional)"
            value={formData.observacoes}
            onChange={(value: string) => handleFieldChange('observacoes', value)}
            rows={3}
            maxLength={500}
          />
        </div>
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
            <ToggleTitle>Equipamento ativo</ToggleTitle>
            <ToggleText>
              {formData.ativo ? 'Disponível para manutenções e chamados' : 'Inativo, não aparecerá nas listagens'}
            </ToggleText>
          </ToggleInfo>
        </ToggleContainer>
      </FieldGroup>
    </FormModal>
  );
}
