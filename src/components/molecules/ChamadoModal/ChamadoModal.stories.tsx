import type { Meta, StoryObj } from '@storybook/react';
import { FormModal, FieldGroup, SectionTitle } from '../FormModal';
import { FormSelection } from '../FormSelection';
import { FormList } from '../FormList';
import { Input, DateInput } from '../../atoms';
import { Select } from '../../atoms/Select';
import Textarea from '../../atoms/Textarea';
import { TipoManutencao, Prioridade, ChamadoStatus } from '../../../utils/enums';

// Componente simplificado para demonstração no Storybook
const ChamadoModalDemo = ({
  isOpen,
  onClose,
  chamado,
  isSaving = false,
  mode = 'create'
}: {
  isOpen: boolean;
  onClose: () => void;
  chamado?: any;
  isSaving?: boolean;
  mode?: 'view' | 'edit' | 'create';
}) => {
  const isEditing = mode === 'edit' || (mode === 'create' && !chamado);
  const isViewing = mode === 'view';
  
  const tipoOptions = [
    {
      id: TipoManutencao.PREVENTIVA,
      label: 'Preventiva',
      description: 'Manutenção programada',
      color: '#10b981',
      icon: '🔧'
    },
    {
      id: TipoManutencao.CORRETIVA,
      label: 'Corretiva',
      description: 'Reparo de falhas',
      color: '#f59e0b',
      icon: '⚡'
    }
  ];

  const prioridadeOptions = [
    {
      id: Prioridade.BAIXA,
      label: 'Baixa',
      description: 'Pode aguardar',
      color: '#6b7280',
      icon: '🔵'
    },
    {
      id: Prioridade.MEDIA,
      label: 'Média',
      description: 'Prioridade normal',
      color: '#f59e0b',
      icon: '🟡'
    },
    {
      id: Prioridade.ALTA,
      label: 'Alta',
      description: 'Necessário urgência',
      color: '#ef4444',
      icon: '🔴'
    }
  ];

  const statusOptions = [
    {
      id: ChamadoStatus.ABERTO,
      label: 'Aberto',
      description: 'Aguardando atendimento',
      color: '#3b82f6',
      icon: '📋'
    },
    {
      id: ChamadoStatus.EM_PROGRESSO,
      label: 'Em Andamento',
      description: 'Sendo executado',
      color: '#f59e0b',
      icon: '🔄'
    },
    {
      id: ChamadoStatus.CONCLUIDO,
      label: 'Concluído',
      description: 'Finalizado com sucesso',
      color: '#10b981',
      icon: '✅'
    }
  ];

  const pecasFields = [
    {
      key: 'nome',
      label: 'Nome da Peça',
      placeholder: 'Ex: Resistor 10kΩ, Fusível 20A',
      required: true
    },
    {
      key: 'quantidade',
      label: 'Quantidade',
      placeholder: 'Ex: 2',
      type: 'number' as const,
      required: true
    }
  ];

  const mockSetores = [
    { value: '1', label: 'Laboratório de Física' },
    { value: '2', label: 'Laboratório de Química' },
    { value: '3', label: 'Almoxarifado' }
  ];

  const mockAgentes = [
    { value: '1', label: 'João Silva - Técnico' },
    { value: '2', label: 'Maria Santos - Especialista' },
    { value: '3', label: 'Pedro Costa - Técnico Sênior' }
  ];

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'create' ? 'Novo Chamado' :
        mode === 'edit' ? 'Editar Chamado' :
        'Visualizar Chamado'
      }
      subtitle={
        mode === 'create' ? 'Preencha os dados do novo chamado' :
        mode === 'edit' ? 'Atualize as informações do chamado' :
        'Detalhes do chamado'
      }
      confirmText={
        mode === 'create' ? 'Criar Chamado' :
        mode === 'edit' ? 'Salvar Alterações' :
        'Fechar'
      }
      onConfirm={() => {
        console.log('Chamado salvo!');
        onClose();
      }}
      isLoading={isSaving}
      size="large"
    >
      <FieldGroup>
        <SectionTitle>Informações Básicas</SectionTitle>
        <div>
          <Input
            placeholder="Título do chamado"
            value={chamado?.titulo || ''}
            onChange={() => {}}
            readOnly={isViewing}
          />
        </div>
        
        <div>
          <Textarea
            placeholder="Descrição detalhada do problema"
            value={chamado?.descricao || ''}
            onChange={() => {}}
            rows={4}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Select
            placeholder="Selecione o setor"
            options={mockSetores}
            value={chamado?.setorId || ''}
            onChange={() => {}}
            disabled={isViewing}
          />
          
          <Input
            placeholder="Equipamento/Local"
            value={chamado?.equipamento || ''}
            onChange={() => {}}
            readOnly={isViewing}
          />
        </div>
      </FieldGroup>

      <FieldGroup>
        <SectionTitle>Classificação</SectionTitle>
        <FormSelection
          options={tipoOptions}
          value={chamado?.tipo || TipoManutencao.PREVENTIVA}
          onChange={() => {}}
        />
        
        <FormSelection
          options={prioridadeOptions}
          value={chamado?.prioridade || Prioridade.MEDIA}
          onChange={() => {}}
        />
      </FieldGroup>

      {(mode === 'edit' || mode === 'view') && (
        <FieldGroup>
          <SectionTitle>Status e Execução</SectionTitle>
          <FormSelection
            options={statusOptions}
            value={chamado?.status || ChamadoStatus.ABERTO}
            onChange={() => {}}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select
              placeholder="Agente responsável"
              options={mockAgentes}
              value={chamado?.agenteId || ''}
              onChange={() => {}}
              disabled={isViewing}
            />
            
            <DateInput
              placeholder="Data prevista"
              value={chamado?.dataPrevista || ''}
              onChange={() => {}}
            />
          </div>
        </FieldGroup>
      )}

      {(mode === 'edit' || mode === 'view') && (
        <FieldGroup>
          <SectionTitle>Peças Utilizadas</SectionTitle>
          <FormList
            title="Lista de Peças"
            items={chamado?.pecas || []}
            newItemFields={pecasFields}
            addButtonText="Adicionar Peça"
            emptyText="Nenhuma peça utilizada"
            emptyIcon="🔧"
            allowEdit={!isViewing}
            onChange={() => {}}
          />
        </FieldGroup>
      )}

      {chamado && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <strong>Status:</strong> {chamado.status || 'Aberto'} • 
          <strong> Criado em:</strong> {new Date(chamado.dataCriacao).toLocaleDateString('pt-BR')} •
          <strong> ID:</strong> #{chamado.id}
        </div>
      )}
    </FormModal>
  );
};

const meta: Meta<typeof ChamadoModalDemo> = {
  title: 'Molecules/ChamadoModal',
  component: ChamadoModalDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Modal para criação, edição e visualização de chamados de manutenção.

**Características:**
- Formulário completo de chamado
- Seleção visual de tipo, prioridade e status
- Lista dinâmica de peças utilizadas
- Diferentes modos: criar, editar, visualizar
- Campos específicos por contexto
- Validações integradas

**Tipos de manutenção:**
- **Preventiva**: Manutenção programada
- **Corretiva**: Reparo de falhas
- **Emergencial**: Urgente e crítica

**Nota**: Este é um componente demo simplificado para o Storybook.
O componente real requer contextos de autenticação, setores e usuários.
        `
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Se o modal está aberto'
    },
    chamado: {
      description: 'Chamado para edição/visualização (undefined para criação)'
    },
    isSaving: {
      control: 'boolean',
      description: 'Se está salvando'
    },
    mode: {
      control: 'select',
      options: ['create', 'edit', 'view'],
      description: 'Modo do modal'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NovoChamado: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    chamado: undefined,
    isSaving: false,
    mode: 'create'
  },
  parameters: {
    docs: {
      description: {
        story: 'Criação de novo chamado. Campos básicos e classificação são obrigatórios.'
      }
    }
  }
};

export const ChamadoAberto: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    chamado: {
      id: '1',
      titulo: 'Manutenção preventiva do microscópio',
      descricao: 'Verificar lentes, calibragem e limpeza geral do equipamento conforme cronograma anual',
      setorId: '1',
      equipamento: 'Microscópio Olympus CX23',
      tipo: TipoManutencao.PREVENTIVA,
      prioridade: Prioridade.MEDIA,
      status: ChamadoStatus.ABERTO,
      dataCriacao: '2024-07-01T08:00:00Z',
      dataPrevista: '2024-07-05',
      pecas: []
    },
    isSaving: false,
    mode: 'edit'
  },
  parameters: {
    docs: {
      description: {
        story: 'Chamado aberto em modo de edição com dados completos.'
      }
    }
  }
};

export const ChamadoEmAndamento: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    chamado: {
      id: '2',
      titulo: 'Reparo urgente da balança de precisão',
      descricao: 'Balança apresentando erro de calibração, impossibilitando pesagens precisas',
      setorId: '2',
      equipamento: 'Balança Analítica Shimadzu AUY220',
      tipo: TipoManutencao.CORRETIVA,
      prioridade: Prioridade.ALTA,
      status: ChamadoStatus.EM_PROGRESSO,
      agenteId: '2',
      dataCriacao: '2024-07-02T10:30:00Z',
      dataPrevista: '2024-07-03',
      pecas: [
        {
          id: '1',
          title: 'Célula de carga',
          subtitle: 'Quantidade: 1',
          data: { nome: 'Célula de carga', quantidade: '1' }
        }
      ]
    },
    isSaving: false,
    mode: 'edit'
  },
  parameters: {
    docs: {
      description: {
        story: 'Chamado em andamento com agente atribuído e peças utilizadas.'
      }
    }
  }
};

export const ChamadoConcluido: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    chamado: {
      id: '3',
      titulo: 'Troca do filtro do sistema de ventilação',
      descricao: 'Substituição programada dos filtros HEPA do sistema de ventilação da capela',
      setorId: '2',
      equipamento: 'Capela de Exaustão CQ-001',
      tipo: TipoManutencao.PREVENTIVA,
      prioridade: Prioridade.BAIXA,
      status: ChamadoStatus.CONCLUIDO,
      agenteId: '1',
      dataCriacao: '2024-06-25T14:00:00Z',
      dataPrevista: '2024-06-30',
      dataFinalizacao: '2024-06-29T16:30:00Z',
      pecas: [
        {
          id: '1',
          title: 'Filtro HEPA H14',
          subtitle: 'Quantidade: 2',
          data: { nome: 'Filtro HEPA H14', quantidade: '2' }
        },
        {
          id: '2',
          title: 'Vedação de borracha',
          subtitle: 'Quantidade: 1',
          data: { nome: 'Vedação de borracha', quantidade: '1' }
        }
      ]
    },
    isSaving: false,
    mode: 'view'
  },
  parameters: {
    docs: {
      description: {
        story: 'Chamado concluído em modo visualização com histórico completo.'
      }
    }
  }
};

export const ChamadoCorretivo: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    chamado: {
      id: '4',
      titulo: 'VAZAMENTO NO SISTEMA DE GÁS',
      descricao: 'Detectado vazamento de gás no laboratório. ÁREA EVACUADA. Necessário reparo imediato.',
      setorId: '2',
      equipamento: 'Sistema de distribuição de gás - Linha principal',
      tipo: TipoManutencao.CORRETIVA,
      prioridade: Prioridade.ALTA,
      status: ChamadoStatus.EM_PROGRESSO,
      agenteId: '3',
      dataCriacao: '2024-07-02T15:45:00Z',
      dataPrevista: '2024-07-02',
      pecas: []
    },
    isSaving: false,
    mode: 'edit'
  },
  parameters: {
    docs: {
      description: {
        story: 'Chamado corretivo com alta prioridade e necessidade de ação imediata.'
      }
    }
  }
};

export const Salvando: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    chamado: undefined,
    isSaving: true,
    mode: 'create'
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado de carregamento durante o salvamento do chamado.'
      }
    }
  }
};
