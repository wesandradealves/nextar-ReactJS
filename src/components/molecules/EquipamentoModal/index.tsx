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
import type { CreateEquipamentoData, UpdateEquipamentoData } from '@/types';
import { useToast } from '../../../hooks/useToast';
import { useSetores } from '../../../hooks/useSetores';
import { useHistorico } from '../../../hooks/useHistorico';
import { TipoManutencao, ChamadoStatus } from '../../../utils/enums';
import { EquipamentoModalProps } from './types';

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
        await onSubmit?.(updateData, equipamento.id);
      } else {
        // Criar novo equipamento
        const createData: CreateEquipamentoData = dataToSave;
        await onSubmit?.(createData);
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
            <ToggleTitle className="font-medium text-gray-900">Equipamento ativo</ToggleTitle>
            <ToggleText className="text-sm text-gray-500">
              {formData.ativo ? 'Disponível para manutenções e chamados' : 'Inativo, não aparecerá nas listagens'}
            </ToggleText>
          </ToggleInfo>
        </ToggleContainer>
      </FieldGroup>

      {/* Seção de Histórico - apenas para visualização e edição */}
      {(isViewing || isEditing) && equipamento && (
        <FieldGroup className="flex flex-col gap-4 mt-6">
          <SectionTitle className="text-sm font-semibold text-gray-700 mb-1">Histórico de Manutenções ({equipamento.manutencaosCount || 0})</SectionTitle>
          <div className="mt-4">
            {historicoLoading ? (
              <div className="flex justify-center items-center p-8 text-gray-500">
                Carregando histórico de manutenções...
              </div>
            ) : historicoManutencoes.length > 0 ? (
              historicoManutencoes.map((chamado) => (
                <div key={chamado.id} className="p-4 border border-gray-200 rounded-lg mb-3 bg-gray-50 last:mb-0">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h4 className="m-0 text-sm font-semibold text-gray-800 flex-1">{chamado.titulo || 'Manutenção'}</h4>
                    <div className="flex flex-col gap-1 items-end flex-shrink-0">
                      <span className="text-xs text-gray-500">
                        {chamado.dataExecucao ? 
                          new Date(chamado.dataExecucao).toLocaleDateString('pt-BR') :
                          new Date(chamado.dataAbertura).toLocaleDateString('pt-BR')
                        }
                      </span>
                      <div className="flex gap-2">
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
                    </div>
                  </div>
                  {chamado.descricao && (
                    <p className="mt-2 mb-0 text-sm text-gray-600 leading-relaxed">
                      {chamado.descricao}
                    </p>
                  )}
                  {chamado.agenteNome && (
                    <p className="mt-2 mb-0 text-sm text-gray-600 leading-relaxed">
                      <strong>Agente:</strong> {chamado.agenteNome}
                    </p>
                  )}
                  {chamado.observacoesFinalizacao && (
                    <p className="mt-2 mb-0 text-sm text-gray-600 leading-relaxed">
                      <strong>Observações:</strong> {String(chamado.observacoesFinalizacao)}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-gray-500 italic">
                Nenhuma manutenção registrada para este equipamento.
              </div>
            )}
          </div>
        </FieldGroup>
      )}
    </FormModal>
  );
}
