import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Modal from '../Modal';
import FormContainer from '../FormContainer';
import { Button, Select, Textarea } from '../../atoms';
import { useEntities } from '@/context/entities';
import { useAuth } from '@/context/auth';
import type { FormFieldConfig } from '../FormContainer/types';
import type { ChamadoModalProps, ChamadoFormData } from './types';
import { isGestor, isAgente, getAgentes } from '@/utils/perfil';
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
  const { user: currentUser } = useAuth();
  const { usuarios, setores, equipamentos } = useEntities();
  
  // Estados do formulário
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [selectedPrioridade, setSelectedPrioridade] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('aberto');
  const [selectedSetor, setSelectedSetor] = useState<string>('');
  const [selectedEquipamento, setSelectedEquipamento] = useState<string>('');
  const [selectedAgente, setSelectedAgente] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [observacoesFinalizacao, setObservacoesFinalizacao] = useState<string>('');
  const [pecasUtilizadas, setPecasUtilizadas] = useState<Array<{ nome: string; quantidade: number }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(chamado);
  const isViewing = mode === 'view';

  // Verificar permissões baseadas no briefing
  const canEdit = useMemo(() => {
    if (!currentUser) return false;
    
    // GESTÃO: acesso completo
    if (isGestor(currentUser)) return true;
    
    // AGENTE: pode editar apenas chamados atribuídos a ele
    if (isAgente(currentUser)) {
      return chamado?.agenteId === currentUser.id;
    }
    
    // PESQUISADOR: pode apenas visualizar e criar (não editar)
    return false;
  }, [currentUser, chamado]);

  // Verificar se pode alterar status
  const canEditStatus = useMemo(() => {
    if (!currentUser || !chamado) return false;
    
    // Apenas AGENTE pode alterar status dos seus chamados
    return isAgente(currentUser) && chamado.agenteId === currentUser.id;
  }, [currentUser, chamado]);

  // Filtrar agentes e equipamentos com verificação de segurança
  const usuariosArray = useMemo(() => {
    return Array.isArray(usuarios) ? usuarios : (usuarios as any)?.data || [];
  }, [usuarios]);

  const agentes = useMemo(() => {
    return usuariosArray.filter((u: any) => u.perfil === 'agente');
  }, [usuariosArray]);

  const equipamentosDoSetor = useMemo(() => {
    if (!selectedSetor || !Array.isArray(equipamentos)) {
      return Array.isArray(equipamentos) ? [] : [];
    }
    return equipamentos.filter(eq => eq.setorId === selectedSetor);
  }, [selectedSetor, equipamentos]);

  const modalTitle = isViewing ? 'Detalhes do Chamado' : 
                    isEditing ? 'Editar Chamado' : 'Novo Chamado';

  // Reset form quando modal abrir/fechar
  useEffect(() => {
    if (isOpen) {
      if (chamado && (mode === 'edit' || mode === 'view')) {
        setSelectedTipo(chamado.tipo || '');
        setSelectedPrioridade(chamado.prioridade || '');
        setSelectedStatus(chamado.status || 'aberto');
        setSelectedSetor(chamado.setorId || '');
        setSelectedEquipamento(chamado.equipamentoId || '');
        setSelectedAgente(chamado.agenteId || '');
        setDescricao(chamado.descricao || '');
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
        setDescricao('');
        setObservacoesFinalizacao('');
        setPecasUtilizadas([]);
      }
    }
  }, [isOpen, chamado, mode]);

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
  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      
      const chamadoData: ChamadoFormData = {
        tipo: selectedTipo,
        prioridade: selectedPrioridade,
        descricao,
        setorId: selectedSetor,
        equipamentoId: selectedEquipamento || undefined,
        agenteId: selectedAgente || undefined,
        observacoesFinalizacao: selectedStatus === 'concluido' ? observacoesFinalizacao : undefined,
        pecasUtilizadas: selectedStatus === 'concluido' ? pecasUtilizadas : undefined,
        solicitanteId: currentUser?.id
      };

      // Se for edição e agente pode editar status
      if (isEditing && canEditStatus) {
        chamadoData.status = selectedStatus;
      }

      await onSubmit(chamadoData, chamado?.id);
      onClose();
    } catch {
      // Erro já tratado pelo hook
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedTipo, selectedPrioridade, selectedStatus, selectedSetor, 
    selectedEquipamento, selectedAgente, descricao, observacoesFinalizacao, 
    pecasUtilizadas, currentUser, onSubmit, onClose, isEditing, canEditStatus
  ]);

  /**
   * Renderiza informações do chamado (modo visualização)
   * @decorator @readonly - Componente apenas para leitura
   * @decorator @memo - Memoizado para performance
   */
  const renderChamadoInfo = useMemo(() => {
    if (!chamado || !isViewing) return null;

    const solicitante = usuariosArray.find((u: any) => u.id === chamado.solicitanteId)?.nome || 'N/A';
    const agente = chamado.agenteId ? usuariosArray.find((u: any) => u.id === chamado.agenteId)?.nome || 'Não atribuído' : 'Não atribuído';
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
            onClick={onClose}
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
          onClick={onClose}
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
      onClose={onClose}
      title={modalTitle}
      size="large"
      footer={renderFooter()}
      closeOnOverlayClick={!isSubmitting}
      closeOnEsc={!isSubmitting}
    >
      {renderChamadoInfo}
      
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

            {/* Status (apenas para agentes em edição) */}
            {isEditing && canEditStatus && (
              <div style={{ marginBottom: '16px' }}>
                <FieldLabel>Status do Chamado</FieldLabel>
                <Select
                  options={[
                    { value: 'aberto', label: 'Aberto' },
                    { value: 'em_progresso', label: 'Em Progresso' },
                    { value: 'concluido', label: 'Concluído' }
                  ]}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  placeholder="Selecione o status"
                />
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
                    ...agentes.map((agente: any) => ({
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

            {/* Descrição */}
            <div style={{ marginBottom: '16px' }}>
              <FieldLabel>Descrição do Problema *</FieldLabel>
              <Textarea
                value={descricao}
                onChange={setDescricao}
                placeholder="Descreva o problema ou manutenção necessária"
                required
                rows={4}
                maxLength={500}
                helperText="Seja o mais específico possível sobre o problema"
              />
            </div>

            {/* Observações de Finalização (apenas se status = concluído) */}
            {selectedStatus === 'concluido' && (
              <div style={{ marginBottom: '16px' }}>
                <FieldLabel>Observações da Finalização</FieldLabel>
                <Textarea
                  value={observacoesFinalizacao}
                  onChange={setObservacoesFinalizacao}
                  placeholder="Descreva o que foi feito na manutenção"
                  rows={3}
                  maxLength={1000}
                  helperText="Detalhe as ações realizadas durante a manutenção"
                />
              </div>
            )}

            {/* Peças Utilizadas (apenas se status = concluído) */}
            {selectedStatus === 'concluido' && (
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
