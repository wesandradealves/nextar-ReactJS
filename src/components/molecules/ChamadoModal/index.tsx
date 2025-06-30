import React, { useState, useCallback, useEffect } from 'react';
import Modal from '../Modal';
import FormContainer from '../FormContainer';
import { Button, Select } from '../../atoms';
import { useEntities } from '@/context/entities';
import { useAuth } from '@/context/auth';
import type { FormFieldConfig } from '../FormContainer/types';
import type { ChamadoModalProps, ChamadoFormData } from './types';
import { PerfilUsuario } from '@/utils/enums';
import {
  FormSection,
  FieldGroup,
  SelectContainer,
  SelectOption,
  SelectLabel,
  SelectDescription,
  StatusSection,
  StatusTitle,
  StatusGrid,
  StatusCard,
  StatusLabel,
  StatusValue,
  FieldLabel
} from './styles';

/**
 * Modal de Criação/Edição/Visualização de Chamado
 * Utiliza FormContainer para validação e Modal para apresentação
 * Segue o padrão estabelecido pelo UserModal
 * 
 * @description
 * Modal responsável por:
 * - Criar novos chamados (Pesquisadores e Gestão)
 * - Editar chamados existentes (conforme permissões)
 * - Visualizar detalhes dos chamados
 * - Atualizar status (Agentes)
 * - Validação de campos em tempo real
 * - Integração com contexto de entidades
 * 
 * @decorator @modal - Componente de modal seguindo padrão do projeto
 * @decorator @form - Integração com FormContainer para validação
 * @decorator @permissions - Respeita permissões por perfil de usuário
 */
export default function ChamadoModal({
  isOpen,
  onClose,
  onSubmit,
  chamado,
  mode = 'create',
  onModeChange
}: ChamadoModalProps) {
  const { user } = useAuth();
  const { usuarios, setores, equipamentos } = useEntities();
  const [selectedTipo, setSelectedTipo] = useState<string>(chamado?.tipo || 'corretiva');
  const [selectedPrioridade, setSelectedPrioridade] = useState<string>(chamado?.prioridade || 'media');
  const [selectedStatus, setSelectedStatus] = useState<string>(chamado?.status || 'aberto');
  const [selectedSetor, setSelectedSetor] = useState<string>(chamado?.setorId || '');
  const [selectedEquipamento, setSelectedEquipamento] = useState<string>(chamado?.equipamentoId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(chamado);
  const isViewing = mode === 'view';
  const canEditStatus = user?.perfil === PerfilUsuario.AGENTE && chamado?.agenteId === user.id;
  const canEdit = mode === 'edit' && (
    user?.perfil === PerfilUsuario.GESTAO ||
    (user?.perfil === PerfilUsuario.AGENTE && chamado?.agenteId === user.id) ||
    (user?.perfil === PerfilUsuario.PESQUISADOR && chamado?.solicitanteId === user.id)
  );

  const modalTitle = isViewing ? 'Detalhes do Chamado' : 
                    isEditing ? 'Editar Chamado' : 'Novo Chamado';

  // Reset form quando modal abrir/fechar
  useEffect(() => {
    if (isOpen) {
      setSelectedTipo(chamado?.tipo || 'corretiva');
      setSelectedPrioridade(chamado?.prioridade || 'media');
      setSelectedStatus(chamado?.status || 'aberto');
      setSelectedSetor(chamado?.setorId || '');
      setSelectedEquipamento(chamado?.equipamentoId || '');
    }
  }, [isOpen, chamado]);

  /**
   * Configuração dos campos do formulário
   * @decorator @config - Configuração dinâmica baseada no contexto
   */
  const getFormFields = useCallback((): FormFieldConfig[] => {
    const baseFields: FormFieldConfig[] = [
      {
        id: 'descricao',
        label: 'Descrição do Problema',
        type: 'text',
        placeholder: 'Descreva o problema ou manutenção necessária...',
        required: true,
        defaultValue: chamado?.descricao || '',
        validation: {
          minLength: 10,
          maxLength: 500
        }
      }
    ];

    if (!isViewing) {
      baseFields.push({
        id: 'observacoes',
        label: 'Observações Adicionais',
        type: 'text',
        placeholder: 'Informações adicionais (opcional)',
        defaultValue: (chamado as Record<string, unknown>)?.observacoes as string || '',
        validation: {
          maxLength: 1000
        }
      });
    }

    return baseFields;
  }, [chamado, isViewing]);

  /**
   * Opções de setor para dropdown
   * @decorator @safe - Lista protegida contra dados undefined
   */
  const setorOptions = Array.isArray(setores) ? setores.map(setor => ({
    value: setor.id,
    label: setor.nome
  })) : [];

  /**
   * Opções de equipamento para dropdown  
   * @decorator @safe - Lista protegida contra dados undefined
   */
  const equipamentoOptions = Array.isArray(equipamentos) ? equipamentos.map(equipamento => ({
    value: equipamento.id,
    label: equipamento.nome
  })) : [];

  /**
   * Manipula submissão do formulário
   * @decorator @async - Operação assíncrona com loading
   */
  const handleSubmit = useCallback(async (formData: Record<string, string>) => {
    if (isViewing) return;

    setIsSubmitting(true);
    
    try {
      const chamadoData: ChamadoFormData = {
        tipo: selectedTipo,
        prioridade: selectedPrioridade,
        descricao: formData.descricao,
        setorId: selectedSetor,
        equipamentoId: selectedEquipamento || undefined,
        observacoes: formData.observacoes || undefined
      };

      // Se for edição e agente, incluir status
      if (isEditing && canEditStatus) {
        chamadoData.status = selectedStatus;
      }

      // Se for criação, adicionar solicitante
      if (!isEditing && user) {
        chamadoData.solicitanteId = user.id;
      }

      await onSubmit(chamadoData, chamado?.id);
      
      // Fechar modal após sucesso (igual ao UserModal)
      onClose();
    } catch (error) {
      console.error('Erro ao salvar chamado:', error);
      // Erro será tratado pela página que implementa onSubmit
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedTipo, selectedPrioridade, selectedStatus, selectedSetor, selectedEquipamento, chamado, user, onSubmit, onClose, isEditing, canEditStatus, isViewing]);

  /**
   * Renderiza informações do chamado (modo visualização)
   * @decorator @readonly - Componente apenas para leitura
   */
  const renderChamadoInfo = () => {
    if (!chamado || !isViewing) return null;

    const solicitante = Array.isArray(usuarios) ? 
      usuarios.find(u => u.id === chamado.solicitanteId)?.nome : 'N/A';
    const agente = chamado.agenteId && Array.isArray(usuarios) ? 
      usuarios.find(u => u.id === chamado.agenteId)?.nome : 'Não atribuído';
    const setor = Array.isArray(setores) ? 
      setores.find(s => s.id === chamado.setorId)?.nome : 'N/A';
    const equipamento = chamado.equipamentoId && Array.isArray(equipamentos) ? 
      equipamentos.find(e => e.id === chamado.equipamentoId)?.nome : 'Manutenção Local';

    return (
      <StatusSection>
        <StatusTitle>Informações do Chamado</StatusTitle>
        <StatusGrid>
          <StatusCard $status={chamado.status}>
            <StatusLabel>Status</StatusLabel>
            <StatusValue>{chamado.status === 'aberto' ? 'Aberto' : 
                         chamado.status === 'em_progresso' ? 'Em Progresso' : 'Concluído'}</StatusValue>
          </StatusCard>
          <StatusCard $status="info">
            <StatusLabel>Solicitante</StatusLabel>
            <StatusValue>{solicitante}</StatusValue>
          </StatusCard>
          <StatusCard $status="info">
            <StatusLabel>Agente</StatusLabel>
            <StatusValue>{agente}</StatusValue>
          </StatusCard>
          <StatusCard $status="info">
            <StatusLabel>Setor</StatusLabel>
            <StatusValue>{setor}</StatusValue>
          </StatusCard>
          <StatusCard $status="info">
            <StatusLabel>Equipamento</StatusLabel>
            <StatusValue>{equipamento}</StatusValue>
          </StatusCard>
          <StatusCard $status="info">
            <StatusLabel>Data Abertura</StatusLabel>
            <StatusValue>{chamado.dataAbertura ? new Date(chamado.dataAbertura).toLocaleDateString('pt-BR') : 'N/A'}</StatusValue>
          </StatusCard>
        </StatusGrid>
      </StatusSection>
    );
  };

  /**
   * Footer customizado com ações baseadas no modo
   * @decorator @conditional - Ações condicionais baseadas em permissões
   */
  const renderFooter = () => {
    if (isViewing) {
      return (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          {canEdit && onModeChange && (
            <Button 
              variant="primary" 
              onClick={() => onModeChange('edit')}
            >
              Editar
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Button 
          variant="outline" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={() => {
            // Trigger form submission
            const form = document.getElementById('chamado-form') as HTMLFormElement;
            if (form) {
              form.requestSubmit();
            }
          }}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {isEditing ? 'Atualizar' : 'Criar Chamado'}
        </Button>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="large"
      footer={renderFooter()}
      closeOnOverlayClick={!isSubmitting}
      closeOnEsc={!isSubmitting}
    >
      {renderChamadoInfo()}
      
      {!isViewing && (
        <FormContainer
          fields={getFormFields()}
          onSubmit={handleSubmit}
          submitDisabled={isSubmitting}
          showReset={false}
          showSubmit={false}
          formId="chamado-form"
        >
          <FormSection>
            {/* Seleção de Tipo */}
            <div style={{ marginBottom: '16px' }}>
              <FieldLabel>Tipo de Manutenção *</FieldLabel>
              <SelectContainer>
                <SelectOption
                  $selected={selectedTipo === 'corretiva'}
                  onClick={() => setSelectedTipo('corretiva')}
                >
                  <SelectLabel>Manutenção Corretiva</SelectLabel>
                  <SelectDescription>Para resolver falhas ou problemas identificados</SelectDescription>
                </SelectOption>
                <SelectOption
                  $selected={selectedTipo === 'preventiva'}
                  onClick={() => setSelectedTipo('preventiva')}
                >
                  <SelectLabel>Manutenção Preventiva</SelectLabel>
                  <SelectDescription>Para conservação e prevenção de falhas futuras</SelectDescription>
                </SelectOption>
              </SelectContainer>
            </div>

            {/* Seleção de Prioridade */}
            <div style={{ marginBottom: '16px' }}>
              <FieldLabel>Prioridade *</FieldLabel>
              <FieldGroup>
                <SelectOption
                  $selected={selectedPrioridade === 'baixa'}
                  onClick={() => setSelectedPrioridade('baixa')}
                >
                  <SelectLabel>Baixa</SelectLabel>
                </SelectOption>
                <SelectOption
                  $selected={selectedPrioridade === 'media'}
                  onClick={() => setSelectedPrioridade('media')}
                >
                  <SelectLabel>Média</SelectLabel>
                </SelectOption>
                <SelectOption
                  $selected={selectedPrioridade === 'alta'}
                  onClick={() => setSelectedPrioridade('alta')}
                >
                  <SelectLabel>Alta</SelectLabel>
                </SelectOption>
              </FieldGroup>
            </div>

            {/* Status (apenas para agentes em edição) */}
            {isEditing && canEditStatus && (
              <div style={{ marginBottom: '16px' }}>
                <FieldLabel>Status do Chamado</FieldLabel>
                <FieldGroup>
                  <SelectOption
                    $selected={selectedStatus === 'aberto'}
                    onClick={() => setSelectedStatus('aberto')}
                  >
                    <SelectLabel>Aberto</SelectLabel>
                  </SelectOption>
                  <SelectOption
                    $selected={selectedStatus === 'em_progresso'}
                    onClick={() => setSelectedStatus('em_progresso')}
                  >
                    <SelectLabel>Em Progresso</SelectLabel>
                  </SelectOption>
                  <SelectOption
                    $selected={selectedStatus === 'concluido'}
                    onClick={() => setSelectedStatus('concluido')}
                  >
                    <SelectLabel>Concluído</SelectLabel>
                  </SelectOption>
                </FieldGroup>
              </div>
            )}

            {/* Seleção de Setor */}
            <FieldGroup>
              <div>
                <FieldLabel>Setor *</FieldLabel>
                <Select
                  value={selectedSetor}
                  onChange={(e) => setSelectedSetor(e.target.value)}
                  required
                  placeholder="Selecione um setor"
                >
                  {setorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Seleção de Equipamento */}
              <div>
                <FieldLabel>Equipamento (Opcional)</FieldLabel>
                <Select
                  value={selectedEquipamento}
                  onChange={(e) => setSelectedEquipamento(e.target.value)}
                  placeholder="Manutenção Local (sem equipamento específico)"
                >
                  {equipamentoOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </FieldGroup>
          </FormSection>
        </FormContainer>
      )}
    </Modal>
  );
}
