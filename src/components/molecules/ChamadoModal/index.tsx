import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Modal from '../Modal';
import FormContainer from '../FormContainer';
import { Button, Select, Textarea } from '../../atoms';
import { useEntities } from '@/context/entities';
import { useAuth } from '@/context/auth';
import { useCache } from '@/context/cache';
import { useToast } from '@/hooks/useToast';
import type { User } from '@/types';
import type { FormFieldConfig } from '../FormContainer/types';
import type { ChamadoModalProps, ChamadoFormData } from './types';
import { isGestor, isAgente } from '@/utils/perfil';
import { 
  ChamadoStatus, 
  STATUS_LABELS, 
  getAvailableStatusTransitions,
  statusRequiresFinalizationFields 
} from '@/utils/enums';
import {
  FormSection,
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
 * - Atualizar status (Gestores e Agentes atribuídos)
 * - Workflow de status controlado (Aberto → Em Progresso → Concluído)
 * - Validação de campos obrigatórios para finalização
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
  mode = 'create'
}: ChamadoModalProps) {
  const { user: currentUser } = useAuth();
  const { usuarios, setores, equipamentos } = useEntities();
  const cache = useCache();
  const toast = useToast();
  
  // Estados do formulário
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [selectedPrioridade, setSelectedPrioridade] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('aberto');
  const [selectedSetor, setSelectedSetor] = useState<string>('');
  const [selectedEquipamento, setSelectedEquipamento] = useState<string>('');
  const [selectedAgente, setSelectedAgente] = useState<string>('');
  const [titulo, setTitulo] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [dataExecucao, setDataExecucao] = useState<string>('');
  const [observacoesFinalizacao, setObservacoesFinalizacao] = useState<string>('');
  const [pecasUtilizadas, setPecasUtilizadas] = useState<Array<{ nome: string; quantidade: number }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(chamado);
  const isViewing = mode === 'view';

  // Verificar se pode alterar status
  const canEditStatus = useMemo(() => {
    if (!currentUser || !chamado) return false;
    
    // Chamados finalizados não podem ter status alterado
    if (chamado.status === ChamadoStatus.CONCLUIDO) return false;
    
    // GESTÃO: pode alterar status de qualquer chamado
    if (isGestor(currentUser)) return true;
    
    // AGENTE: pode alterar status apenas dos seus chamados atribuídos
    if (isAgente(currentUser)) {
      return chamado.agenteId === currentUser.id;
    }
    
    return false;
  }, [currentUser, chamado]);

  // Filtrar agentes e equipamentos com verificação de segurança
  const usuariosArray = useMemo(() => {
    if (Array.isArray(usuarios)) {
      return usuarios;
    }
    const usuariosData = (usuarios as Record<string, unknown>)?.data;
    return Array.isArray(usuariosData) ? usuariosData : [];
  }, [usuarios]);

  const agentes = useMemo(() => {
    return usuariosArray.filter((u: User) => u.perfil === 'agente');
  }, [usuariosArray]);

  const equipamentosDoSetor = useMemo(() => {
    if (!selectedSetor || !Array.isArray(equipamentos)) {
      return Array.isArray(equipamentos) ? [] : [];
    }
    return equipamentos.filter(eq => eq.setorId === selectedSetor);
  }, [selectedSetor, equipamentos]);

  // Opções de status baseadas no workflow
  const statusOptions = useMemo(() => {
    if (!chamado || !canEditStatus) {
      return [];
    }

    const currentStatus = chamado.status as ChamadoStatus;
    const availableTransitions = getAvailableStatusTransitions(currentStatus);
    
    // Incluir o status atual + transições possíveis
    const allAvailableStatus = [currentStatus, ...availableTransitions];
    
    return allAvailableStatus.map(status => ({
      value: status,
      label: STATUS_LABELS[status]
    }));
  }, [chamado, canEditStatus]);

  // Verificar se status atual requer campos de finalização
  const requiresFinalizationFields = useMemo(() => {
    return statusRequiresFinalizationFields(selectedStatus as ChamadoStatus);
  }, [selectedStatus]);

  // Verificar se deve mostrar campo de data de execução
  const shouldShowDataExecucao = useMemo(() => {
    return requiresFinalizationFields || (isEditing && chamado?.dataExecucao);
  }, [requiresFinalizationFields, isEditing, chamado?.dataExecucao]);

  const modalTitle = isViewing ? 'Detalhes do Chamado' : 
                    isEditing ? 'Editar Chamado' : 'Novo Chamado';

  /**
   * Manipula fechamento da modal com limpeza de cache
   */
  const handleClose = useCallback(() => {
    // Limpar cache relacionado a chamados para garantir dados atualizados
    cache.invalidateByTag('chamados');
    onClose();
  }, [cache, onClose]);

  // Reset form quando modal abrir/fechar ou chamado mudar
  useEffect(() => {
    if (isOpen) {
      if (chamado && (mode === 'edit' || mode === 'view')) {
        setSelectedTipo(chamado.tipo || '');
        setSelectedPrioridade(chamado.prioridade || '');
        setSelectedStatus(chamado.status || 'aberto');
        setSelectedSetor(chamado.setorId || '');
        setSelectedEquipamento(chamado.equipamentoId || '');
        setSelectedAgente(chamado.agenteId || '');
        
        // Lógica corrigida para título e descrição
        if (chamado.titulo && chamado.titulo.trim()) {
          // Se tem título separado, usar título e descrição separados
          setTitulo(chamado.titulo.trim());
          setDescricao(chamado.descricao?.trim() || '');
        } else {
          // Caso antigo: usar descrição como título e deixar descrição vazia
          setTitulo(chamado.descricao?.trim() || '');
          setDescricao('');
        }
        
        // Converter dataExecucao do formato ISO para YYYY-MM-DD (formato do input date)
        const dataExec = chamado.dataExecucao ? 
          new Date(chamado.dataExecucao).toISOString().split('T')[0] : '';
        setDataExecucao(dataExec);
        setObservacoesFinalizacao(chamado.observacoesFinalizacao || '');
        setPecasUtilizadas(chamado.pecasUtilizadas || []);
      } else {
        // Reset para criar novo
        setSelectedTipo('');
        setSelectedPrioridade('');
        setSelectedStatus('aberto');
        setSelectedSetor('');
        setSelectedEquipamento('');
        setSelectedAgente('');
        setTitulo('');
        setDescricao('');
        setDataExecucao('');
        setObservacoesFinalizacao('');
        setPecasUtilizadas([]);
      }
    }
  }, [isOpen, chamado?.id, chamado?.titulo, chamado?.descricao, chamado?.tipo, chamado?.prioridade, chamado?.status, chamado?.setorId, chamado?.equipamentoId, chamado?.agenteId, chamado?.dataExecucao, chamado?.observacoesFinalizacao, chamado?.pecasUtilizadas, mode]);

  // Key única para forçar re-render do FormContainer quando dados importantes mudam
  const formKey = useMemo(() => {
    // Usar dados estáveis para a key, evitando re-renders desnecessários
    const baseKey = `chamado-form-${chamado?.id || 'new'}`;
    const dataHash = `${titulo.substring(0,10)}-${descricao.substring(0,10)}-${mode}`;
    return `${baseKey}-${dataHash}`;
  }, [chamado?.id, titulo, descricao, mode]);

  /**
   * Configuração dos campos do formulário
   * @decorator @config - Configuração dinâmica baseada no contexto
   */
  const getFormFields = useCallback((): FormFieldConfig[] => {
    const baseFields: FormFieldConfig[] = [
      {
        id: 'titulo',
        label: 'Título do Chamado',
        type: 'text',
        placeholder: 'Ex: Problema na impressora do laboratório',
        required: true,
        defaultValue: titulo,
        validation: {
          minLength: 5,
          maxLength: 100
        }
      },
      {
        id: 'descricao',
        label: 'Descrição Detalhada',
        type: 'text',
        placeholder: 'Descreva detalhadamente o problema ou manutenção necessária...',
        required: true,
        defaultValue: descricao,
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
  }, [chamado, isViewing, titulo, descricao]);

  /**
   * Opções de setor para dropdown
   * @decorator @safe - Lista protegida contra dados undefined
   * @decorator @memo - Memoizado para performance
   */
  const setorOptions = useMemo(() => {
    return Array.isArray(setores) ? setores.map(setor => ({
      value: setor.id,
      label: setor.nome
    })) : [];
  }, [setores]);

  /**
   * Opções de equipamento para dropdown  
   * @decorator @safe - Lista protegida contra dados undefined
   */
  // const equipamentoOptions = Array.isArray(equipamentos) ? equipamentos.map(equipamento => ({
  //   value: equipamento.id,
  //   label: equipamento.nome
  // })) : [];

  /**
   * Manipula submissão do formulário
   * @decorator @async - Operação assíncrona com loading
   */
  const handleSubmit = useCallback(async (formData: Record<string, string>) => {
    try {
      setIsSubmitting(true);
      
      // Validações básicas
      if (!selectedTipo) {
        toast.error('Erro de Validação', 'Selecione o tipo de manutenção');
        return;
      }
      
      if (!selectedPrioridade) {
        toast.error('Erro de Validação', 'Selecione a prioridade do chamado');
        return;
      }
      
      if (!selectedSetor) {
        toast.error('Erro de Validação', 'Selecione o setor responsável');
        return;
      }
      
      // Validação específica para status "concluído"
      if (requiresFinalizationFields) {
        if (!observacoesFinalizacao || observacoesFinalizacao.trim().length < 10) {
          const errorMessage = 'Observações de finalização são obrigatórias e devem ter pelo menos 10 caracteres';
          toast.error('Erro de Validação', errorMessage);
          return;
        }
        
        if (!dataExecucao || dataExecucao.trim() === '') {
          toast.error('Erro de Validação', 'Data de execução é obrigatória ao finalizar um chamado');
          return;
        }
        
        // Validar se a data de execução não é futura
        const hoje = new Date();
        const dataExec = new Date(dataExecucao);
        if (dataExec > hoje) {
          toast.error('Erro de Validação', 'A data de execução não pode ser no futuro');
          return;
        }
        
        // Validar se a data de execução não é anterior à data de abertura
        if (chamado?.dataAbertura) {
          const dataAbertura = new Date(chamado.dataAbertura);
          if (dataExec < dataAbertura) {
            toast.error('Erro de Validação', 'A data de execução não pode ser anterior à data de abertura do chamado');
            return;
          }
        }
      }
      
      const chamadoData: ChamadoFormData = {
        tipo: selectedTipo,
        prioridade: selectedPrioridade,
        titulo: formData.titulo, // Usar dados do formulário, não estado local
        descricao: formData.descricao, // Usar dados do formulário, não estado local
        setorId: selectedSetor,
        equipamentoId: selectedEquipamento || undefined,
        agenteId: selectedAgente || undefined,
        observacoes: formData.observacoes || undefined,
        dataExecucao: (requiresFinalizationFields || isEditing) && dataExecucao ? 
          new Date(dataExecucao).toISOString() : undefined,
        observacoesFinalizacao: requiresFinalizationFields ? observacoesFinalizacao : undefined,
        pecasUtilizadas: requiresFinalizationFields ? pecasUtilizadas : undefined,
        solicitanteId: currentUser?.id
      };

      // Se for edição e agente pode editar status
      if (isEditing && canEditStatus) {
        chamadoData.status = selectedStatus;
      }

      await onSubmit(chamadoData, chamado?.id);
      
      // Limpar cache após submissão bem-sucedida
      cache.invalidateByTag('chamados');
      
      // Mostrar toast de sucesso
      toast.success(
        isEditing ? 'Chamado atualizado!' : 'Chamado criado!',
        isEditing ? 'As alterações foram salvas com sucesso' : 'O novo chamado foi registrado no sistema'
      );
      
      handleClose();
    } catch (error) {
      console.error('❌ Erro no handleSubmit:', error);
      
      // Mostrar toast de erro para problemas de API
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro inesperado';
      toast.error(
        'Erro ao salvar chamado',
        errorMessage
      );
      
      // Não fechar a modal em caso de erro para permitir correção
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedTipo, selectedPrioridade, selectedStatus, selectedSetor, 
    selectedEquipamento, selectedAgente, dataExecucao, observacoesFinalizacao, 
    pecasUtilizadas, currentUser, onSubmit, handleClose, isEditing, canEditStatus,
    requiresFinalizationFields, chamado, cache, titulo, descricao, toast
  ]);

  /**
   * Renderiza informações do chamado (modo visualização)
   * @decorator @readonly - Componente apenas para leitura
   * @decorator @memo - Memoizado para performance
   */
  const renderChamadoInfo = useMemo(() => {
    if (!chamado || !isViewing) return null;

    const solicitante = usuariosArray.find((u: User) => u.id === chamado.solicitanteId)?.nome || 'N/A';
    const agente = chamado.agenteId ? usuariosArray.find((u: User) => u.id === chamado.agenteId)?.nome || 'Não atribuído' : 'Não atribuído';
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
            <StatusValue>{STATUS_LABELS[chamado.status as ChamadoStatus] || chamado.status}</StatusValue>
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
          {chamado.dataExecucao && (
            <StatusCard $status="info">
              <StatusLabel>Data Execução</StatusLabel>
              <StatusValue>{new Date(chamado.dataExecucao).toLocaleDateString('pt-BR')}</StatusValue>
            </StatusCard>
          )}
        </StatusGrid>
      </StatusSection>
    );
  }, [chamado, isViewing, usuariosArray, setores, equipamentos]);

  /**
   * Footer customizado com ações baseadas no modo
   * @decorator @conditional - Ações condicionais baseadas em permissões
   */
  const renderFooter = () => {
    if (isViewing) {
      return (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Fechar
          </Button>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Button 
          variant="secondary" 
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          form="chamado-form"
          type="submit"
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
      onClose={handleClose}
      title={modalTitle}
      size="large"
      footer={renderFooter()}
      closeOnOverlayClick={!isSubmitting}
      closeOnEsc={!isSubmitting}
    >
      {renderChamadoInfo}
      
      {/* Aviso para chamados finalizados */}
      {chamado?.status === ChamadoStatus.CONCLUIDO && !isViewing && (
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          color: '#0369a1',
          fontSize: '14px'
        }}>
          <strong>ℹ️ Chamado Finalizado:</strong> Este chamado foi concluído e não pode mais ser editado.
        </div>
      )}
      
      {!isViewing && (
        <FormContainer
          key={formKey} // Key única para forçar re-render
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
              <Select
                options={[
                  { value: 'corretiva', label: 'Manutenção Corretiva' },
                  { value: 'preventiva', label: 'Manutenção Preventiva' }
                ]}
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value)}
                placeholder="Selecione o tipo de manutenção"
                required
              />
            </div>

            {/* Seleção de Prioridade */}
            <div style={{ marginBottom: '16px' }}>
              <FieldLabel>Prioridade *</FieldLabel>
              <Select
                options={[
                  { value: 'baixa', label: 'Baixa' },
                  { value: 'media', label: 'Média' },
                  { value: 'alta', label: 'Alta' }
                ]}
                value={selectedPrioridade}
                onChange={(e) => setSelectedPrioridade(e.target.value)}
                placeholder="Selecione a prioridade"
                required
              />
            </div>

            {/* Status (para gestores e agentes em edição) */}
            {isEditing && canEditStatus && (
              <div style={{ marginBottom: '16px' }}>
                <FieldLabel>Status do Chamado</FieldLabel>
                <Select
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  placeholder="Selecione o status"
                />
                {statusOptions.length === 1 && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#64748b', 
                    marginTop: '4px' 
                  }}>
                    Status atual. {getAvailableStatusTransitions(selectedStatus as ChamadoStatus).length === 0 
                      ? 'Chamado finalizado.' 
                      : `Selecione uma nova etapa para continuar. ${isGestor(currentUser) ? '(Gestão)' : '(Agente responsável)'}`
                    }
                  </div>
                )}
              </div>
            )}

            {/* Seleção de Setor e Equipamento */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <FieldLabel>Setor *</FieldLabel>
                <Select
                  options={setorOptions}
                  value={selectedSetor}
                  onChange={(e) => setSelectedSetor(e.target.value)}
                  placeholder="Selecione um setor"
                  required
                />
              </div>

              <div>
                <FieldLabel>Equipamento (Opcional)</FieldLabel>
                <Select
                  options={[
                    { value: '', label: 'Manutenção Local' },
                    ...equipamentosDoSetor.map(eq => ({
                      value: eq.id,
                      label: `${eq.nome} (${eq.codigo})`
                    }))
                  ]}
                  value={selectedEquipamento}
                  onChange={(e) => setSelectedEquipamento(e.target.value)}
                  placeholder="Equipamento específico (opcional)"
                  disabled={!selectedSetor}
                />
              </div>
            </div>

            {/* Atribuir Agente (apenas para GESTÃO) */}
            {isGestor(currentUser) && (
              <div style={{ marginBottom: '16px' }}>
                <FieldLabel>Agente Responsável</FieldLabel>
                <Select
                  options={[
                    { value: '', label: 'Sem agente atribuído' },
                    ...agentes.map((agente: User) => ({
                      value: agente.id,
                      label: agente.nome
                    }))
                  ]}
                  value={selectedAgente}
                  onChange={(e) => setSelectedAgente(e.target.value)}
                  placeholder="Atribuir a um agente (opcional)"
                />
              </div>
            )}

            {/* Data de Execução (obrigatória ao finalizar ou editável se já existe) */}
            {shouldShowDataExecucao && (
              <div style={{ marginBottom: '16px' }}>
                <FieldLabel>Data de Execução {requiresFinalizationFields ? '*' : ''}</FieldLabel>
                <input
                  type="date"
                  value={dataExecucao}
                  onChange={(e) => setDataExecucao(e.target.value)}
                  max={new Date().toISOString().split('T')[0]} // Não permite datas futuras
                  required={requiresFinalizationFields}
                  style={{ 
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                />
                <div style={{ 
                  fontSize: '12px', 
                  color: '#64748b', 
                  marginTop: '4px' 
                }}>
                  {requiresFinalizationFields 
                    ? 'Campo obrigatório. Informe a data em que o serviço foi executado.'
                    : 'Data em que o serviço foi executado (opcional).'
                  }
                </div>
              </div>
            )}

            {/* Observações de Finalização (apenas se status = concluído) */}
            {requiresFinalizationFields && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <FieldLabel>Observações da Finalização *</FieldLabel>
                  <Textarea
                    value={observacoesFinalizacao}
                    onChange={setObservacoesFinalizacao}
                    placeholder="Descreva detalhadamente o que foi feito na manutenção"
                    rows={4}
                    maxLength={1000}
                    required
                    helperText="Campo obrigatório. Detalhe as ações realizadas durante a manutenção."
                  />
                </div>
              </>
            )}

            {/* Peças Utilizadas (apenas se status = concluído) */}
            {requiresFinalizationFields && (
              <div style={{ marginBottom: '16px' }}>
                <FieldLabel>Peças Utilizadas</FieldLabel>
                <div style={{ 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px', 
                  padding: '12px',
                  backgroundColor: '#f8fafc'
                }}>
                  {pecasUtilizadas.length === 0 ? (
                    <p style={{ color: '#64748b', margin: 0 }}>
                      Nenhuma peça foi utilizada nesta manutenção
                    </p>
                  ) : (
                    <div>
                      {pecasUtilizadas.map((peca, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                          padding: '8px',
                          backgroundColor: 'white',
                          borderRadius: '4px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <span>{peca.nome}</span>
                          <span>Qtd: {peca.quantidade}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const nome = prompt('Nome da peça:');
                      const quantidade = prompt('Quantidade:');
                      if (nome && quantidade) {
                        setPecasUtilizadas([...pecasUtilizadas, { 
                          nome, 
                          quantidade: parseInt(quantidade) 
                        }]);
                      }
                    }}
                  >
                    Adicionar Peça
                  </Button>
                </div>
              </div>
            )}
          </FormSection>
        </FormContainer>
      )}
    </Modal>
  );
}
