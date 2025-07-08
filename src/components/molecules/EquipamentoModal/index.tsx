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

  useEffect(() => {
    if (equipamento?.id && isOpen && (isViewing || isEditing)) {
      setHistoricoFilters({
        equipamentoId: equipamento.id,
        dataInicio: '',
        dataFim: ''
      });
    }
  }, [equipamento?.id, isOpen, isViewing, isEditing]);

  useEffect(() => {
    if (equipamento && isOpen) {
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

    if (!formData.codigo.trim()) {
      showError('Código é obrigatório');
      return false;
    }
    
    const hexPattern = /^[A-Z]{3}\d{3}[A-Z]$/;
    if (!hexPattern.test(formData.codigo.toUpperCase())) {
      showError('Código deve seguir o formato hexadecimal (ex: BIO001A)');
      return false;
    }

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

    if (!formData.setorId) {
      showError('Setor é obrigatório');
      return false;
    }

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
        const updateData: UpdateEquipamentoData = dataToSave;
        await onSubmit?.(updateData, equipamento.id);
      } else {
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
    const randomNum = Math.floor(Math.random() * 900) + 100;
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));

    return `${prefix}${randomNum}${randomLetter}`;
  };

  const handleSetorChange = (setorId: string) => {
    handleFieldChange('setorId', setorId);
    
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
      <div className="space-y-8">
        <FieldGroup className="space-y-6">
          <SectionTitle className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            📋 Informações Básicas
          </SectionTitle>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Equipamento *
              </label>
              <Input
                placeholder="Ex: Microscópio Eletrônico"
                value={formData.nome}
                onChange={(e) => handleFieldChange('nome', e.target.value)}
                disabled={isViewing}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código *
                </label>
                <Input
                  placeholder="Ex: BIO001A"
                  value={formData.codigo}
                  onChange={(e) => handleFieldChange('codigo', e.target.value.toUpperCase())}
                  disabled={isViewing}
                  className="w-full font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formato: 3 letras + 3 números + 1 letra
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo *
                </label>
                <Input
                  placeholder="Ex: TEM-2100F"
                  value={formData.modelo}
                  onChange={(e) => handleFieldChange('modelo', e.target.value)}
                  disabled={isViewing}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup className="space-y-6">
          <SectionTitle className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            🏢 Localização e Manutenção
          </SectionTitle>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Setor *
              </label>
              <FormSelection
                options={setorOptions}
                value={formData.setorId}
                onChange={handleSetorChange}
                disabled={isViewing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Próxima Manutenção *
              </label>
              <DateInput
                placeholder="Selecione a data"
                value={formData.proximaManutencao}
                onChange={(value) => handleFieldChange('proximaManutencao', value)}
                required
                disabled={isViewing}
                className="w-full"
              />
            </div>
          </div>
        </FieldGroup>

        <FieldGroup className="space-y-6">
          <SectionTitle className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            📝 Informações Adicionais
          </SectionTitle>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <Textarea
                placeholder="Adicione observações importantes sobre o equipamento..."
                value={formData.observacoes}
                onChange={(value: string) => handleFieldChange('observacoes', value)}
                rows={4}
                maxLength={500}
                disabled={isViewing}
                className="w-full resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.observacoes.length}/500 caracteres
              </p>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup className="space-y-6">
          <SectionTitle className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            ⚙️ Configurações
          </SectionTitle>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <ToggleContainer className="flex items-center justify-between">
              <ToggleInfo className="flex-1">
                <ToggleTitle className="font-semibold text-gray-900 text-base flex items-center gap-2">
                  {formData.ativo ? '✅' : '❌'} Status do Equipamento
                </ToggleTitle>
                <ToggleText className="text-sm text-gray-600 mt-1">
                  {formData.ativo 
                    ? '🟢 Ativo - Disponível para manutenções e chamados' 
                    : '🔴 Inativo - Não aparecerá nas listagens'}
                </ToggleText>
              </ToggleInfo>
              
              <ToggleSwitch className="relative inline-block w-14 h-7 ml-4">
                <ToggleInput
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) => handleFieldChange('ativo', e.target.checked)}
                  disabled={isViewing}
                  className="opacity-0 w-0 h-0"
                />
                <ToggleSlider 
                  $checked={formData.ativo} 
                  className={`
                    absolute cursor-pointer top-0 left-0 right-0 bottom-0 
                    transition-all duration-300 rounded-full shadow-lg
                    ${formData.ativo 
                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                      : 'bg-gradient-to-r from-gray-300 to-gray-400'}
                  `}
                />
              </ToggleSwitch>
            </ToggleContainer>
          </div>
        </FieldGroup>

        {(isViewing || isEditing) && equipamento && (
          <FieldGroup className="space-y-6">
            <SectionTitle className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
              🔧 Histórico de Manutenções 
              <Badge variant="secondary" size="small">
                {equipamento.manutencaosCount || 0}
              </Badge>
            </SectionTitle>
            
            <div className="bg-gray-50 rounded-lg border p-1">
              {historicoLoading ? (
                <div className="flex justify-center items-center p-8 text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
                  Carregando histórico...
                </div>
              ) : historicoManutencoes.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto p-3">
                  {historicoManutencoes.map((chamado) => (
                    <div key={chamado.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                          🔧 {chamado.titulo || 'Manutenção'}
                        </h4>
                        <div className="flex flex-col gap-2 items-end">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            📅 {chamado.dataExecucao ? 
                              new Date(chamado.dataExecucao).toLocaleDateString('pt-BR') :
                              new Date(chamado.dataAbertura).toLocaleDateString('pt-BR')
                            }
                          </span>
                          <div className="flex gap-2">
                            <Badge variant={chamado.tipo === TipoManutencao.PREVENTIVA ? 'success' : 'warning'} size="small">
                              {chamado.tipo === TipoManutencao.PREVENTIVA ? '🛡️ Preventiva' : '⚡ Corretiva'}
                            </Badge>
                            <Badge 
                              variant={
                                chamado.status === ChamadoStatus.CONCLUIDO ? 'success' :
                                chamado.status === ChamadoStatus.EM_PROGRESSO ? 'warning' : 'primary'
                              } 
                              size="small"
                            >
                              {chamado.status === ChamadoStatus.CONCLUIDO ? '✅ Concluído' :
                               chamado.status === ChamadoStatus.EM_PROGRESSO ? '⏳ Em Progresso' : '🆕 Aberto'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {chamado.descricao && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded border-l-4 border-blue-200">
                            {chamado.descricao}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                        {chamado.agenteNome && (
                          <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                            <span>👤</span>
                            <strong>Agente:</strong> {chamado.agenteNome}
                          </div>
                        )}
                        
                        {chamado.observacoesFinalizacao && (
                          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                            <span>📝</span>
                            <strong>Obs:</strong> {String(chamado.observacoesFinalizacao).substring(0, 50)}
                            {String(chamado.observacoesFinalizacao).length > 50 && '...'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <div className="text-4xl mb-2">🔧</div>
                  <p className="font-medium">Nenhuma manutenção registrada</p>
                  <p className="text-sm">Este equipamento ainda não possui histórico</p>
                </div>
              )}
            </div>
          </FieldGroup>
        )}
      </div>
    </FormModal>
  );
}
