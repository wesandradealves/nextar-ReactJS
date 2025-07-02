import React, { useEffect, useState } from 'react';
import {
  FormModal,
  FieldGroup,
  SectionTitle
} from '../FormModal';
import { FormSelection } from '../FormSelection';
import { FormList } from '../FormList';
import { Input, DateInput } from '../../atoms';
import { Select } from '../../atoms/Select';
import Textarea from '../../atoms/Textarea';
import { TipoManutencao, Prioridade, ChamadoStatus, PerfilUsuario } from '../../../utils/enums';
import { useAuth } from '../../../context/auth';
import { useSetores } from '../../../hooks/useSetores';
import { useUsers } from '../../../hooks/useUsers';
import { useEquipamentos } from '../../../hooks/useEquipamentos';
import { useToast } from '../../../hooks/useToast';
import { ChamadoModalProps } from './types';

/**
 * Modal para criação, edição e visualização de chamados
 * 
 * @version 2.0.3
 * @description
 * Modal padronizada usando os novos componentes:
 * - FormModal para estrutura base
 * - FormSelection para seleções visuais (tipo, prioridade, status)
 * - FormList para gerenciar peças utilizadas
 * - Validações integradas
 * - Layout responsivo
 * - Workflow de status controlado
 * - Permissões baseadas no perfil do usuário
 */
export default function ChamadoModal({
  isOpen,
  onClose,
  chamado,
  onSave,
  isSaving = false,
  mode = 'create'
}: ChamadoModalProps) {
  const { user: currentUser } = useAuth();
  const { allSetores } = useSetores();
  const { allUsers } = useUsers();
  const { allEquipamentos } = useEquipamentos();
  const { error: showError } = useToast();

  const [currentMode, setCurrentMode] = useState<'view' | 'edit' | 'create'>(mode);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: TipoManutencao.PREVENTIVA,
    prioridade: Prioridade.MEDIA,
    status: ChamadoStatus.ABERTO,
    setorId: '',
    equipamentoId: '',
    agenteId: '',
    observacoes: '',
    dataExecucao: '',
    pecasUtilizadas: [] as { nome: string; quantidade: number }[]
  });

  const isEditing = currentMode === 'edit';
  const isViewing = currentMode === 'view';
  const isCreating = currentMode === 'create';
  const isManager = currentUser?.perfil === PerfilUsuario.GESTAO;
  const isAssignedAgent = chamado?.agenteId === currentUser?.id;

  // Permissões
  const canChangeStatus = isManager || isAssignedAgent;
  const canAssignAgent = isManager;

  // Carrega dados do chamado para edição/visualização
  useEffect(() => {
    if (chamado && isOpen) {
      setFormData({
        titulo: chamado.titulo || '',
        descricao: chamado.descricao || '',
        tipo: chamado.tipo || TipoManutencao.PREVENTIVA,
        prioridade: chamado.prioridade || Prioridade.MEDIA,
        status: chamado.status || ChamadoStatus.ABERTO,
        setorId: chamado.setorId || '',
        equipamentoId: chamado.equipamentoId || '',
        agenteId: chamado.agenteId || '',
        observacoes: typeof chamado.observacoes === 'string' ? chamado.observacoes : '',
        dataExecucao: chamado.dataExecucao || '',
        pecasUtilizadas: chamado.pecasUtilizadas || []
      });
    } else if (!chamado && isOpen) {
      // Reset para criação
      setFormData({
        titulo: '',
        descricao: '',
        tipo: TipoManutencao.PREVENTIVA,
        prioridade: Prioridade.MEDIA,
        status: ChamadoStatus.ABERTO,
        setorId: '',
        equipamentoId: '',
        agenteId: '',
        observacoes: '',
        dataExecucao: '',
        pecasUtilizadas: []
      });
    }

    setCurrentMode(mode);
  }, [chamado, isOpen, mode]);

  const validateForm = (): boolean => {
    if (!formData.titulo.trim()) {
      showError('Título é obrigatório');
      return false;
    } else if (formData.titulo.trim().length < 5) {
      showError('Título deve ter pelo menos 5 caracteres');
      return false;
    }

    if (!formData.descricao.trim()) {
      showError('Descrição é obrigatória');
      return false;
    } else if (formData.descricao.trim().length < 10) {
      showError('Descrição deve ter pelo menos 10 caracteres');
      return false;
    }

    if (!formData.setorId) {
      showError('Setor é obrigatório');
      return false;
    }

    if (!formData.equipamentoId) {
      showError('Equipamento ou local é obrigatório');
      return false;
    }

    // Validações específicas para finalização
    if (formData.status === ChamadoStatus.CONCLUIDO) {
      if (!formData.observacoes.trim()) {
        showError('Observações são obrigatórias para finalizar o chamado');
        return false;
      } else if (formData.observacoes.trim().length < 10) {
        showError('Observações devem ter pelo menos 10 caracteres');
        return false;
      }

      if (!formData.dataExecucao) {
        showError('Data de execução é obrigatória para finalizar o chamado');
        return false;
      } else {
        const execDate = new Date(formData.dataExecucao);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Permite até o final do dia atual
        
        const chamadoDate = chamado?.dataAbertura ? new Date(chamado.dataAbertura) : null;
        
        // Permite data até o final do dia atual
        if (execDate > today) {
          showError('Data de execução não pode ser no futuro');
          return false;
        }
        
        // Só valida data de abertura se existir e se não for edição
        if (chamadoDate && execDate < chamadoDate && isCreating) {
          showError('Data de execução não pode ser anterior à data de abertura');
          return false;
        }
      }

      if (!formData.pecasUtilizadas || formData.pecasUtilizadas.length === 0) {
        showError('É obrigatório registrar pelo menos uma peça utilizada para finalizar o chamado');
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    // Verificar se agente está tentando editar chamado concluído
    if (!canSaveChanges) {
      showError('Chamados concluídos não podem ser editados por agentes. Entre em contato com a gestão.');
      return;
    }

    if (!validateForm()) return;

    try {
      await onSave(formData);
      // Sempre fechar a modal após salvar (criação ou edição)
      onClose();
    } catch (error) {
      console.error('Erro ao salvar chamado:', error);
    }
  };



  const handleFieldChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePecasChange = (pecas: { nome: string; quantidade: number }[]) => {
    setFormData(prev => ({ ...prev, pecasUtilizadas: pecas }));
  };

  // Opções para seleções
  const tipoOptions = [
    {
      id: TipoManutencao.PREVENTIVA,
      label: 'Manutenção Preventiva',
      description: 'Manutenção planejada para prevenir problemas',
      color: '#10b981',
      icon: '🔧'
    },
    {
      id: TipoManutencao.CORRETIVA,
      label: 'Manutenção Corretiva',
      description: 'Correção de problemas identificados',
      color: '#f59e0b',
      icon: '⚠️'
    }
  ];

  const prioridadeOptions = [
    {
      id: Prioridade.BAIXA,
      label: 'Baixa',
      description: 'Pode aguardar programação',
      color: '#10b981',
      icon: '🟢'
    },
    {
      id: Prioridade.MEDIA,
      label: 'Média',
      description: 'Programar com antecedência',
      color: '#f59e0b',
      icon: '🟡'
    },
    {
      id: Prioridade.ALTA,
      label: 'Alta',
      description: 'Necessita atenção prioritária',
      color: '#ef4444',
      icon: '🔴'
    }
  ];

  const statusOptions = [
    {
      id: ChamadoStatus.ABERTO,
      label: 'Aberto',
      description: 'Aguardando atribuição de agente',
      color: '#6b7280',
      icon: '📋'
    },
    {
      id: ChamadoStatus.EM_PROGRESSO,
      label: 'Em Progresso',
      description: 'Sendo executado pelo agente',
      color: '#3b82f6',
      icon: '⚙️'
    },
    {
      id: ChamadoStatus.CONCLUIDO,
      label: 'Concluído',
      description: 'Manutenção finalizada',
      color: '#10b981',
      icon: '✅'
    }
  ];

  // Filtrar opções de status baseado no workflow
  const getAvailableStatusOptions = () => {
    if (!canChangeStatus) {
      return statusOptions.filter(opt => opt.id === formData.status);
    }

    const currentStatus = formData.status;

    switch (currentStatus) {
      case ChamadoStatus.ABERTO:
        return statusOptions.filter(opt =>
          opt.id === ChamadoStatus.ABERTO ||
          opt.id === ChamadoStatus.EM_PROGRESSO
        );
      case ChamadoStatus.EM_PROGRESSO:
        return statusOptions.filter(opt =>
          opt.id === ChamadoStatus.EM_PROGRESSO ||
          opt.id === ChamadoStatus.CONCLUIDO
        );
      case ChamadoStatus.CONCLUIDO:
        // Gestores podem alterar chamados finalizados
        return isManager ? statusOptions : statusOptions.filter(opt => opt.id === ChamadoStatus.CONCLUIDO);
      default:
        return statusOptions;
    }
  };

  const isFormValid = formData.titulo.trim() &&
    formData.descricao.trim() &&
    formData.setorId &&
    formData.equipamentoId;

  // Agentes não podem editar chamados concluídos, mas gestores podem
  const canSaveChanges = isCreating || isManager || (chamado?.status !== ChamadoStatus.CONCLUIDO);

  const modalTitle = isCreating ? 'Novo Chamado' :
    isEditing ? 'Editar Chamado' :
      'Detalhes do Chamado';

  const modalSubtitle = isCreating ? 'Preencha os dados do chamado de manutenção' :
    isEditing ? 'Atualize as informações do chamado' :
      'Visualize os detalhes do chamado';

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      subtitle={modalSubtitle}
      confirmText={isCreating ? 'Criar Chamado' : isEditing ? 'Salvar Alterações' : undefined}
      onConfirm={isViewing ? undefined : handleSave}
      isLoading={isSaving}
      isConfirmDisabled={!isFormValid || !canSaveChanges}
      size="large"
    >
      {/* Campos básicos */}
      <FieldGroup>
        <div>
          <Input
            placeholder="Título do chamado"
            value={formData.titulo}
            onChange={(e) => handleFieldChange('titulo', e.target.value)}
            disabled={isViewing}
          />
        </div>

        <div>
          <Textarea
            placeholder="Descrição detalhada do problema ou serviço necessário..."
            value={formData.descricao}
            onChange={(value) => handleFieldChange('descricao', value)}
            disabled={isViewing}
            rows={3}
          />
        </div>
      </FieldGroup>

      {/* Tipo do Chamado */}
      {!isViewing && (
        <FieldGroup>
          <SectionTitle>Tipo do Chamado</SectionTitle>
          <FormSelection
            options={tipoOptions}
            value={formData.tipo}
            onChange={(value) => handleFieldChange('tipo', value)}
          />
        </FieldGroup>
      )}

      {/* Prioridade */}
      {!isViewing && (
        <FieldGroup>
          <SectionTitle>Prioridade</SectionTitle>
          <FormSelection
            options={prioridadeOptions}
            value={formData.prioridade}
            onChange={(value) => handleFieldChange('prioridade', value)}
          />
        </FieldGroup>
      )}

      {/* Status (apenas para edição) */}
      {!isCreating && !isViewing && canChangeStatus && (
        <FieldGroup>
          <SectionTitle>Status do Chamado</SectionTitle>
          <FormSelection
            options={getAvailableStatusOptions()}
            value={formData.status}
            onChange={(value) => handleFieldChange('status', value)}
          />
        </FieldGroup>
      )}

      {/* Setor e Equipamento */}
      <FieldGroup>
        <SectionTitle>Relação</SectionTitle>
        <div>
          <Select
            placeholder="Selecione o setor"
            value={formData.setorId}
            onChange={(e) => handleFieldChange('setorId', e.target.value)}
            disabled={isViewing}
            options={allSetores
              .filter(setor => setor.ativo)
              .map(setor => ({
                value: setor.id,
                label: setor.nome
              }))
            }
          />
        </div>

        <div>
          <Select
            placeholder="Selecione o equipamento ou local"
            value={formData.equipamentoId}
            onChange={(e) => handleFieldChange('equipamentoId', e.target.value)}
            disabled={isViewing}
            options={[
              // Equipamentos reais do sistema (ativos)
              ...allEquipamentos
                .filter(equipamento => equipamento.ativo)
                .map(equipamento => ({
                  value: equipamento.id,
                  label: `${equipamento.nome} (${equipamento.codigo})`
                })),
              // Locais/Instalações fixas
              { value: 'LOC001', label: 'Laboratório Principal' },
              { value: 'LOC002', label: 'Alojamentos' },
              { value: 'LOC003', label: 'Área de Comunicações' },
              { value: 'LOC004', label: 'Depósito de Suprimentos' },
              { value: 'LOC005', label: 'Área Externa - Antenas' }
            ]}
          />
        </div>
      </FieldGroup>

      {/* Agente responsável (apenas para gestores) */}
      {canAssignAgent && (
        <FieldGroup>
          <SectionTitle>Agente Responsável</SectionTitle>
          <div>
            <Select
              placeholder="Selecione o agente (opcional)"
              value={formData.agenteId}
              onChange={(e) => handleFieldChange('agenteId', e.target.value)}
              disabled={isViewing}
              options={allUsers
                .filter(user => user.perfil === PerfilUsuario.AGENTE && user.ativo)
                .map(user => ({
                  value: user.id,
                  label: user.nome
                }))
              }
            />
          </div>
        </FieldGroup>
      )}

      {/* Data de Execução (apenas se concluído) */}
      {formData.status === ChamadoStatus.CONCLUIDO && (
        <FieldGroup>
          <SectionTitle>Data de Execução *</SectionTitle>
          <div>
            <DateInput
              value={formData.dataExecucao}
              onChange={(value) => handleFieldChange('dataExecucao', value)}
              disabled={isViewing}
              required
              placeholder="Data da execução"
            />
          </div>
        </FieldGroup>
      )}

      {/* Observações (apenas se concluído) */}
      {formData.status === ChamadoStatus.CONCLUIDO && (
        <FieldGroup>
          <SectionTitle>Observações do Atendimento *</SectionTitle>
          <div>
            <Textarea
              placeholder="Descreva detalhadamente o que foi realizado na manutenção..."
              value={formData.observacoes}
              onChange={(value) => handleFieldChange('observacoes', value)}
              disabled={isViewing}
              rows={4}
            />
          </div>
        </FieldGroup>
      )}

      {/* Peças Utilizadas (apenas se concluído) */}
      {formData.status === ChamadoStatus.CONCLUIDO && (
        <FieldGroup>
          <FormList
            title="Peças Utilizadas *"
            items={formData.pecasUtilizadas.map((peca, index) => ({
              id: `peca-${index}`,
              title: peca.nome,
              subtitle: `Quantidade: ${peca.quantidade}`,
              data: peca
            }))}
            onChange={(items) => {
              const pecas = items.map(item => {
                const pecaData = item.data as { nome: string; quantidade: string };
                return {
                  nome: pecaData.nome,
                  quantidade: parseInt(pecaData.quantidade) || 1
                };
              });
              handlePecasChange(pecas);
            }}
            newItemFields={[
              {
                key: 'nome',
                label: 'Nome da Peça',
                placeholder: 'Ex: Resistor 10kΩ, Fusível 20A',
                required: true,
                validate: (value) => {
                  if (value.length < 2) return 'Nome deve ter pelo menos 2 caracteres';
                  return null;
                }
              },
              {
                key: 'quantidade',
                label: 'Quantidade',
                placeholder: 'Ex: 2',
                type: 'number',
                required: true,
                validate: (value) => {
                  const num = parseInt(value);
                  if (!value.trim() || isNaN(num) || num < 1) return 'Quantidade deve ser um número maior que 0';
                  return null;
                }
              }
            ]}
            addButtonText="Adicionar Peça"
            emptyText="Registre as peças utilizadas na manutenção"
            emptyIcon="🔧"
            maxItems={20}
            allowEdit={!isViewing}
          />
        </FieldGroup>
      )}

      {/* Aviso para chamados finalizados */}
      {chamado?.status === ChamadoStatus.CONCLUIDO && !isManager && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fef3c7',
          borderLeft: '4px solid #f59e0b',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#92400e'
        }}>
          <strong>Chamado Finalizado:</strong> Este chamado foi concluído e não pode ser editado.
          Entre em contato com a gestão para ajustes.
        </div>
      )}
    </FormModal>
  );
}
