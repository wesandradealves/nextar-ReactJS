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
      <div className="space-y-8">
        <FieldGroup className="space-y-6">
          <SectionTitle className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
            📋 Informações Básicas
          </SectionTitle>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Chamado *
              </label>
              <Input
                placeholder="Ex: Manutenção preventiva no microscópio eletrônico"
                value={formData.titulo}
                onChange={(e) => handleFieldChange('titulo', e.target.value)}
                disabled={isViewing}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Título claro e descritivo do problema ou serviço
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição Detalhada *
              </label>
              <Textarea
                placeholder="Descreva o problema ou serviço necessário, incluindo sintomas observados, localização específica e qualquer informação relevante..."
                value={formData.descricao}
                onChange={(value) => handleFieldChange('descricao', value)}
                disabled={isViewing}
                rows={4}
                maxLength={1000}
                className="w-full resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.descricao.length}/1000 caracteres - Seja específico sobre o problema
              </p>
            </div>
          </div>
        </FieldGroup>

        {!isViewing && (
          <FieldGroup className="space-y-6">
            <SectionTitle className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
              🏷️ Classificação e Prioridade
            </SectionTitle>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Manutenção *
                  </label>
                  <FormSelection
                    options={tipoOptions}
                    value={formData.tipo}
                    onChange={(value) => handleFieldChange('tipo', value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Preventiva para manutenção programada, Corretiva para resolução de problemas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível de Prioridade *
                  </label>
                  <FormSelection
                    options={prioridadeOptions}
                    value={formData.prioridade}
                    onChange={(value) => handleFieldChange('prioridade', value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Define a urgência do atendimento e ordem de execução
                  </p>
                </div>
              </div>
            </div>
          </FieldGroup>
        )}

        {!isCreating && !isViewing && canChangeStatus && (
          <FieldGroup className="space-y-6">
            <SectionTitle className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
              📊 Status do Chamado
            </SectionTitle>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Atual *
                  </label>
                  <FormSelection
                    options={getAvailableStatusOptions()}
                    value={formData.status}
                    onChange={(value) => handleFieldChange('status', value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    O status controla o fluxo de trabalho do chamado (Aberto → Em Progresso → Concluído)
                  </p>
                </div>
              </div>
            </div>
          </FieldGroup>
        )}

        <FieldGroup className="space-y-6">
          <SectionTitle className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
            🏢 Localização e Equipamento
          </SectionTitle>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Setor Responsável *
                </label>
                <Select
                  placeholder="Selecione o setor responsável"
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
                <p className="text-xs text-gray-500 mt-1">
                  Departamento ou área responsável pelo equipamento
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipamento ou Local *
                </label>
                <Select
                  placeholder="Selecione equipamento ou instalação"
                  value={formData.equipamentoId}
                  onChange={(e) => handleFieldChange('equipamentoId', e.target.value)}
                  disabled={isViewing}
                  options={[
                    ...allEquipamentos
                      .filter(equipamento => equipamento.ativo)
                      .map(equipamento => ({
                        value: equipamento.id,
                        label: `${equipamento.nome} (${equipamento.codigo})`
                      })),
                    { value: 'LOC001', label: 'Laboratório Principal' },
                    { value: 'LOC002', label: 'Alojamentos' },
                    { value: 'LOC003', label: 'Área de Comunicações' },
                    { value: 'LOC004', label: 'Depósito de Suprimentos' },
                    { value: 'LOC005', label: 'Área Externa - Antenas' }
                  ]}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Equipamento específico ou instalação onde será realizada a manutenção
                </p>
              </div>
            </div>
          </div>
        </FieldGroup>

        {canAssignAgent && (
          <FieldGroup className="space-y-6">
            <SectionTitle className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
              👤 Atribuição de Responsável
            </SectionTitle>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agente de Manutenção
                  </label>
                  <Select
                    placeholder="Selecione o agente responsável (opcional)"
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
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.agenteId ? 
                      'Agente específico atribuído para executar este chamado' : 
                      'Deixe vazio para atribuição posterior pelo gestor'
                    }
                  </p>
                </div>
              </div>
            </div>
          </FieldGroup>
        )}

        {formData.status === ChamadoStatus.CONCLUIDO && (
          <FieldGroup className="space-y-6">
            <SectionTitle className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
              🔧 Detalhes da Execução
            </SectionTitle>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-green-500 text-lg">✅</div>
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Chamado Concluído</h4>
                    <p className="text-sm text-green-700">
                      Preencha os detalhes da execução para finalizar o registro do atendimento.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Execução *
                    </label>
                    <DateInput
                      value={formData.dataExecucao}
                      onChange={(value) => handleFieldChange('dataExecucao', value)}
                      disabled={isViewing}
                      required
                      placeholder="Data da execução"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Quando a manutenção foi realizada
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relatório de Atendimento *
                </label>
                <Textarea
                  placeholder="Descreva detalhadamente o que foi realizado: diagnóstico, procedimentos executados, resultados obtidos, testes realizados..."
                  value={formData.observacoes}
                  onChange={(value) => handleFieldChange('observacoes', value)}
                  disabled={isViewing}
                  rows={5}
                  maxLength={2000}
                  className="w-full resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.observacoes.length}/2000 caracteres - Relatório detalhado da execução
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peças e Materiais Utilizados *
                </label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <FormList
                    title="Lista de Peças Utilizadas"
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
                        label: 'Nome da Peça/Material',
                        placeholder: 'Ex: Resistor 10kΩ, Fusível 20A, Óleo lubrificante',
                        required: true,
                        validate: (value) => {
                          if (value.length < 2) return 'Nome deve ter pelo menos 2 caracteres';
                          return null;
                        }
                      },
                      {
                        key: 'quantidade',
                        label: 'Quantidade Utilizada',
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
                    addButtonText="+ Adicionar Peça/Material"
                    emptyText="Registre todas as peças e materiais utilizados na manutenção"
                    emptyIcon="🔧"
                    maxItems={20}
                    allowEdit={!isViewing}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Liste todas as peças, componentes e materiais utilizados durante a manutenção
                </p>
              </div>
            </div>
          </FieldGroup>
        )}

        {chamado?.status === ChamadoStatus.CONCLUIDO && !isManager && (
          <FieldGroup className="space-y-4">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-r-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-amber-500 text-lg">⚠️</div>
                <div>
                  <h4 className="font-medium text-amber-900 mb-1">Chamado Finalizado</h4>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Este chamado foi concluído e não pode ser editado por agentes. 
                    Entre em contato com a gestão para realizar alterações.
                  </p>
                </div>
              </div>
            </div>
          </FieldGroup>
        )}

        <FieldGroup className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-blue-500 text-lg">💡</div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Dicas sobre Chamados</h4>
                <div className="text-sm text-blue-700 leading-relaxed space-y-1">
                  <p><strong>Títulos claros</strong> facilitam a identificação e priorização.</p>
                  <p><strong>Descrições detalhadas</strong> ajudam o agente a preparar-se adequadamente.</p>
                  <p><strong>Prioridade Alta</strong> deve ser usada apenas para urgências reais.</p>
                  {!isViewing && <p><strong>Status</strong> controla automaticamente o fluxo do chamado.</p>}
                </div>
              </div>
            </div>
          </div>
        </FieldGroup>
      </div>
    </FormModal>
  );
}
