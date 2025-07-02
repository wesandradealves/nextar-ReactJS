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
import { Input, DateInput, Badge } from '../../atoms';
import Textarea from '../../atoms/Textarea';
import type { CreateEquipamentoData, UpdateEquipamentoData, Equipamento } from '@/types';
import { useToast } from '../../../hooks/useToast';
import { useSetores } from '../../../hooks/useSetores';
import { useHistorico } from '../../../hooks/useHistorico';
import { TipoManutencao, ChamadoStatus } from '../../../utils/enums';
import styled from 'styled-components';

// Styled components para o histórico
const HistoricoContainer = styled.div`
  margin-top: 1rem;
`;

const HistoricoItem = styled.div`
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  background: #fafafa;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const HistoricoHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 1rem;
`;

const HistoricoTitle = styled.h4`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  flex: 1;
`;

const HistoricoMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-end;
  flex-shrink: 0;
`;

const HistoricoDate = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const HistoricoDescription = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 0.85rem;
  color: #555;
  line-height: 1.4;
`;

const HistoricoEmpty = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #666;
`;

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
  /** Modo de visualização: view, edit ou create */
  mode?: 'view' | 'edit' | 'create';
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
  isLoading = false,
  mode = 'create'
}: EquipamentoModalProps) {
  const { error: showError } = useToast();
  const { allSetores } = useSetores();
  
  // Hook para histórico de manutenções específico do equipamento
  const {
    chamados: historicoManutencoes,
    loading: historicoLoading,
    setFilters: setHistoricoFilters
  } = useHistorico();
  
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    modelo: '',
    setorId: '',
    proximaManutencao: '',
    observacoes: '',
    ativo: true
  });
  
  const isEditing = mode === 'edit';
  const isViewing = mode === 'view';
  const isCreating = mode === 'create';

  // Carregar histórico quando o equipamento for definido e modal aberto
  useEffect(() => {
    if (equipamento?.id && isOpen && (isViewing || isEditing)) {
      // Filtrar histórico para este equipamento específico
      setHistoricoFilters({
        equipamentoId: equipamento.id,
        dataInicio: '', // Remover limite de data para ver todo histórico
        dataFim: ''
      });
    }
  }, [equipamento?.id, isOpen, isViewing, isEditing, setHistoricoFilters]);

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

  const getModalConfig = () => {
    switch (mode) {
      case 'view':
        return {
          title: 'Visualizar Equipamento',
          subtitle: 'Informações detalhadas e histórico de manutenções',
          confirmText: 'Fechar',
          isConfirmDisabled: false
        };
      case 'edit':
        return {
          title: 'Editar Equipamento',
          subtitle: 'Atualize as informações do equipamento',
          confirmText: 'Salvar Alterações',
          isConfirmDisabled: !isFormValid
        };
      default: // create
        return {
          title: 'Novo Equipamento',
          subtitle: 'Preencha os dados do novo equipamento',
          confirmText: 'Criar Equipamento',
          isConfirmDisabled: !isFormValid
        };
    }
  };

  const modalConfig = getModalConfig();

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalConfig.title}
      subtitle={modalConfig.subtitle}
      confirmText={modalConfig.confirmText}
      onConfirm={isViewing ? onClose : handleSave}
      isLoading={isLoading}
      isConfirmDisabled={modalConfig.isConfirmDisabled}
      size="large"
    >
      <FieldGroup>
        <SectionTitle>Informações Básicas</SectionTitle>
        <div>
          <Input
            placeholder="Nome do equipamento"
            value={formData.nome}
            onChange={(e) => handleFieldChange('nome', e.target.value)}
            disabled={isViewing}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            placeholder="Código (ex: BIO001A)"
            value={formData.codigo}
            onChange={(e) => handleFieldChange('codigo', e.target.value.toUpperCase())}
            disabled={isViewing}
          />
          <Input
            placeholder="Modelo do equipamento"
            value={formData.modelo}
            onChange={(e) => handleFieldChange('modelo', e.target.value)}
            disabled={isViewing}
          />
        </div>
      </FieldGroup>

      <FieldGroup>
        <SectionTitle>Localização e data de Manutenção</SectionTitle>
        <FormSelection
          options={setorOptions}
          value={formData.setorId}
          onChange={handleSetorChange}
          disabled={isViewing}
        />

        <div>
          <DateInput
            placeholder="Data da próxima manutenção"
            value={formData.proximaManutencao}
            onChange={(value) => handleFieldChange('proximaManutencao', value)}
            required
            disabled={isViewing}
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
            disabled={isViewing}
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

      {/* Seção de Histórico - apenas para visualização e edição */}
      {(isViewing || isEditing) && equipamento && (
        <FieldGroup>
          <SectionTitle>Histórico de Manutenções ({equipamento.manutencaosCount || 0})</SectionTitle>
          <HistoricoContainer>
            {historicoLoading ? (
              <LoadingSpinner>
                Carregando histórico de manutenções...
              </LoadingSpinner>
            ) : historicoManutencoes.length > 0 ? (
              historicoManutencoes.map((chamado) => (
                <HistoricoItem key={chamado.id}>
                  <HistoricoHeader>
                    <HistoricoTitle>{chamado.titulo || 'Manutenção'}</HistoricoTitle>
                    <HistoricoMeta>
                      <HistoricoDate>
                        {chamado.dataExecucao ? 
                          new Date(chamado.dataExecucao).toLocaleDateString('pt-BR') :
                          new Date(chamado.dataAbertura).toLocaleDateString('pt-BR')
                        }
                      </HistoricoDate>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Badge variant={chamado.tipo === TipoManutencao.PREVENTIVA ? 'success' : 'warning'} size="small">
                          {chamado.tipo === TipoManutencao.PREVENTIVA ? 'Preventiva' : 'Corretiva'}
                        </Badge>
                        <Badge 
                          variant={
                            chamado.status === ChamadoStatus.CONCLUIDO ? 'success' :
                            chamado.status === ChamadoStatus.EM_PROGRESSO ? 'warning' : 'primary'
                          } 
                          size="small"
                        >
                          {chamado.status === ChamadoStatus.CONCLUIDO ? 'Concluído' :
                           chamado.status === ChamadoStatus.EM_PROGRESSO ? 'Em Progresso' : 'Aberto'}
                        </Badge>
                      </div>
                    </HistoricoMeta>
                  </HistoricoHeader>
                  {chamado.descricao && (
                    <HistoricoDescription>
                      {chamado.descricao}
                    </HistoricoDescription>
                  )}
                  {chamado.agenteNome && (
                    <HistoricoDescription>
                      <strong>Agente:</strong> {chamado.agenteNome}
                    </HistoricoDescription>
                  )}
                  {chamado.observacoesFinalizacao && (
                    <HistoricoDescription>
                      <strong>Observações:</strong> {String(chamado.observacoesFinalizacao)}
                    </HistoricoDescription>
                  )}
                </HistoricoItem>
              ))
            ) : (
              <HistoricoEmpty>
                Nenhuma manutenção registrada para este equipamento.
              </HistoricoEmpty>
            )}
          </HistoricoContainer>
        </FieldGroup>
      )}
    </FormModal>
  );
}
