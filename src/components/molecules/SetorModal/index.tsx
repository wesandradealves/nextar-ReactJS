import React, { useState, useCallback, useEffect } from 'react';
import Modal from '../Modal';
import FormContainer from '../FormContainer';
import { Button, Textarea } from '../../atoms';
import type { CreateSetorData, UpdateSetorData } from '@/types';
import { CATEGORIAS_CIENTIFICAS } from '@/utils/enums';
import type { FormFieldConfig } from '../FormContainer/types';
import { SetorModalProps } from './types';
import {
  FormSection,
  FieldGroup,
  CategorySelectContainer,
  CategoryOption,
  CategoryLabel,
  StatusContainer,
  StatusToggle,
  StatusInput,
  StatusSlider,
  StatusLabel,
  StatusTitle,
  StatusText,
  TextareaContainer,
  TextareaLabel,
  TextareaHelpText
} from './styles';

/**
 * Modal de Criação/Edição de Setor
 * Utiliza FormContainer para validação e Modal para apresentação
 * 
 * @description
 * Modal responsável por:
 * - Criar novos setores
 * - Editar setores existentes
 * - Validação de campos em tempo real
 * - Seleção de categoria científica
 * - Toggle de status ativo/inativo
 * - Integração com API de setores
 */
export default function SetorModal({
  isOpen,
  onClose,
  onSubmit,
  setor,
  isLoading = false
}: SetorModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    setor?.categoria || CATEGORIAS_CIENTIFICAS[0]
  );
  const [isActive, setIsActive] = useState<boolean>(
    setor?.ativo !== undefined ? setor.ativo : true
  );
  const [description, setDescription] = useState<string>(
    setor?.descricao || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(setor);
  const modalTitle = isEditing ? 'Editar Setor' : 'Novo Setor';

  // Reset form quando modal abrir/fechar
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(setor?.categoria || CATEGORIAS_CIENTIFICAS[0]);
      setIsActive(setor?.ativo !== undefined ? setor.ativo : true);
      setDescription(setor?.descricao || '');
      setIsSubmitting(false);
    }
  }, [isOpen, setor]);

  // Configuração dos campos do formulário
  const formFields: FormFieldConfig[] = [
    {
      id: 'nome',
      label: 'Nome do Setor',
      type: 'text',
      placeholder: 'Ex: Laboratório de Biologia Marinha',
      required: true,
      defaultValue: setor?.nome || '',
      validation: {
        minLength: 3,
        maxLength: 100,
        pattern: /^[a-zA-ZÀ-ÿ0-9\s\-_.()]+$/,
      },
      helpText: 'Nome completo e descritivo do setor'
    }
  ];

  /**
   * Submit do formulário
   */
  const handleSubmit = useCallback(async (formData: Record<string, string>) => {
    setIsSubmitting(true);
    
    try {
      if (isEditing && setor) {
        // Dados para edição
        const updateData: UpdateSetorData = {
          nome: formData.nome,
          categoria: selectedCategory,
          descricao: description || '',
          ativo: isActive
        };
        
        await onSubmit(updateData, setor.id);
      } else {
        // Dados para criação
        const createData: CreateSetorData = {
          nome: formData.nome,
          categoria: selectedCategory,
          descricao: description || '',
          ativo: isActive
        };
        
        await onSubmit(createData);
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar setor:', error);
      // Erro será tratado pelo hook useSetores
    } finally {
      setIsSubmitting(false);
    }
  }, [isEditing, setor, selectedCategory, description, isActive, onSubmit, onClose]);

  /**
   * Categorias disponíveis com cores
   */
  const getCategoryColor = (categoria: string) => {
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
    return colors[categoria] || '#6b7280';
  };

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
          const form = document.getElementById('setor-form') as HTMLFormElement;
          if (form) {
            form.requestSubmit();
          }
        }}
        disabled={isSubmitting || isLoading}
        loading={isSubmitting}
      >
        {isEditing ? 'Salvar Alterações' : 'Criar Setor'}
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
            nome: setor?.nome || ''
          }}
          validateOnChange
          validateOnBlur
          submitText={isEditing ? 'Salvar Alterações' : 'Criar Setor'}
          showReset={false}
          showSubmit={false}
          formId="setor-form"
        >
          {/* Campo de Descrição Customizado */}
          <FieldGroup>
            <TextareaContainer>
              <TextareaLabel>
                Descrição
              </TextareaLabel>
              <Textarea
                value={description}
                onChange={(value) => setDescription(value)}
                placeholder="Ex: Laboratório especializado em pesquisas de organismos marinhos antárticos..."
                maxLength={500}
                rows={4}
              />
              <TextareaHelpText>
                Descrição detalhada das atividades e objetivos do setor (opcional)
              </TextareaHelpText>
            </TextareaContainer>
          </FieldGroup>
          {/* Seleção de Categoria Científica */}
          <FieldGroup>
            <div>
              <label style={{ 
                display: 'block', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px',
                fontSize: '0.875rem'
              }}>
                Categoria Científica *
              </label>
              <CategorySelectContainer>
                {CATEGORIAS_CIENTIFICAS.map((categoria) => (
                  <CategoryOption
                    key={categoria}
                    $selected={selectedCategory === categoria}
                    $color={getCategoryColor(categoria)}
                    onClick={() => setSelectedCategory(categoria)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedCategory(categoria);
                      }
                    }}
                  >
                    <CategoryLabel>{categoria}</CategoryLabel>
                    {selectedCategory === categoria && (
                      <span style={{ color: getCategoryColor(categoria), fontSize: '1.2rem' }}>
                        ✓
                      </span>
                    )}
                  </CategoryOption>
                ))}
              </CategorySelectContainer>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280', 
                marginTop: '6px' 
              }}>
                Selecione a categoria científica que melhor descreve as atividades do setor
              </div>
            </div>
          </FieldGroup>

          {/* Toggle de Status Ativo/Inativo */}
          <FieldGroup>
            <StatusContainer>
              <StatusToggle>
                <StatusInput
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <StatusSlider />
              </StatusToggle>
              <StatusLabel>
                <StatusTitle>
                  Status: {isActive ? 'Ativo' : 'Inativo'}
                </StatusTitle>
                <StatusText>
                  {isActive 
                    ? 'O setor está ativo e pode receber equipamentos e chamados'
                    : 'O setor está inativo e não aparecerá nas listagens principais'
                  }
                </StatusText>
              </StatusLabel>
            </StatusContainer>
          </FieldGroup>
        </FormContainer>
      </FormSection>
    </Modal>
  );
}
