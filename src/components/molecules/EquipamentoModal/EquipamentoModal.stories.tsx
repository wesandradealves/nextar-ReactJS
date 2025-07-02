import type { Meta, StoryObj } from '@storybook/react';
import { FormModal, FieldGroup, SectionTitle, ToggleContainer, ToggleSwitch, ToggleInput, ToggleSlider, ToggleInfo, ToggleTitle, ToggleText } from '../FormModal';
import { FormSelection } from '../FormSelection';
import { Input, DateInput } from '../../atoms';
import Textarea from '../../atoms/Textarea';

// Componente simplificado para demonstração no Storybook
const EquipamentoModalDemo = ({
  isOpen,
  onClose,
  equipamento,
  isLoading = false
}: {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  equipamento?: any;
  isLoading?: boolean;
}) => {
  const isEditing = !!equipamento;
  
  const setorOptions = [
    {
      id: '1',
      label: 'Laboratório de Física',
      description: 'Experimentos e análises',
      color: '#3b82f6',
      icon: '⚗️'
    },
    {
      id: '2',
      label: 'Laboratório de Química',
      description: 'Síntese e análises químicas',
      color: '#10b981',
      icon: '🧪'
    },
    {
      id: '3',
      label: 'Almoxarifado',
      description: 'Armazenamento',
      color: '#6b7280',
      icon: '📦'
    }
  ];

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Equipamento' : 'Novo Equipamento'}
      subtitle={isEditing ? 'Atualize as informações do equipamento' : 'Preencha os dados do novo equipamento'}
      confirmText={isEditing ? 'Salvar Alterações' : 'Criar Equipamento'}
      onConfirm={() => {
        console.log('Equipamento salvo!');
        onClose();
      }}
      isLoading={isLoading}
      size="large"
    >
      <FieldGroup>
        <SectionTitle>Informações Básicas</SectionTitle>
        <div>
          <Input
            placeholder="Nome do equipamento"
            value={equipamento?.nome || ''}
            onChange={() => {}}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            placeholder="Código (ex: EQ001)"
            value={equipamento?.codigo || ''}
            onChange={() => {}}
          />
          <Input
            placeholder="Número de série"
            value={equipamento?.numeroSerie || ''}
            onChange={() => {}}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            placeholder="Marca"
            value={equipamento?.marca || ''}
            onChange={() => {}}
          />
          <Input
            placeholder="Modelo"
            value={equipamento?.modelo || ''}
            onChange={() => {}}
          />
        </div>
        
        <div>
          <Textarea
            placeholder="Descrição do equipamento (opcional)"
            value={equipamento?.descricao || ''}
            onChange={() => {}}
            rows={3}
          />
        </div>
      </FieldGroup>

      <FieldGroup>
        <SectionTitle>Localização</SectionTitle>
        <FormSelection
          options={setorOptions}
          value={equipamento?.setorId || '1'}
          onChange={() => {}}
        />
      </FieldGroup>

      <FieldGroup>
        <SectionTitle>Dados Técnicos</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <DateInput
            placeholder="Data de aquisição"
            value={equipamento?.dataAquisicao || ''}
            onChange={() => {}}
          />
          <Input
            placeholder="Valor (R$)"
            type="number"
            value={equipamento?.valor || ''}
            onChange={() => {}}
          />
        </div>
        
        <div>
          <Input
            placeholder="Especificações técnicas"
            value={equipamento?.especificacoes || ''}
            onChange={() => {}}
          />
        </div>
      </FieldGroup>

      <FieldGroup>
        <SectionTitle>Configurações</SectionTitle>
        <ToggleContainer>
          <ToggleSwitch>
            <ToggleInput
              id="ativo"
              checked={equipamento?.ativo ?? true}
              onChange={() => {}}
            />
            <ToggleSlider $checked={equipamento?.ativo ?? true} />
          </ToggleSwitch>
          <ToggleInfo>
            <ToggleTitle>Status Ativo</ToggleTitle>
            <ToggleText>
              Equipamentos ativos podem receber chamados de manutenção
            </ToggleText>
          </ToggleInfo>
        </ToggleContainer>

        <ToggleContainer>
          <ToggleSwitch>
            <ToggleInput
              id="critico"
              checked={equipamento?.critico ?? false}
              onChange={() => {}}
            />
            <ToggleSlider $checked={equipamento?.critico ?? false} />
          </ToggleSwitch>
          <ToggleInfo>
            <ToggleTitle>Equipamento Crítico</ToggleTitle>
            <ToggleText>
              Equipamentos críticos têm prioridade alta em manutenções
            </ToggleText>
          </ToggleInfo>
        </ToggleContainer>
      </FieldGroup>

      {equipamento && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <strong>Status:</strong> {equipamento.ativo ? '✅ Ativo' : '❌ Inativo'} • 
          <strong> Crítico:</strong> {equipamento.critico ? '🔴 Sim' : '🟢 Não'} • 
          <strong> Criado em:</strong> {new Date(equipamento.dataCriacao).toLocaleDateString('pt-BR')}
        </div>
      )}
    </FormModal>
  );
};

const meta: Meta<typeof EquipamentoModalDemo> = {
  title: 'Molecules/EquipamentoModal',
  component: EquipamentoModalDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Modal para criação e edição de equipamentos do sistema.

**Características:**
- Formulário completo de equipamento
- Seleção visual de setor
- Campos técnicos (marca, modelo, especificações)
- Controle de data de aquisição
- Toggle para status ativo/inativo
- Toggle para equipamento crítico
- Validação de código único

**Funcionalidades:**
- Equipamentos ativos podem receber manutenções
- Equipamentos críticos têm prioridade alta
- Associação com setores

**Nota**: Este é um componente demo simplificado para o Storybook.
O componente real requer contextos de toast e setores.
        `
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Se o modal está aberto'
    },
    equipamento: {
      description: 'Equipamento para edição (undefined para criação)'
    },
    isLoading: {
      control: 'boolean',
      description: 'Se está salvando'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NovoEquipamento: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    equipamento: undefined,
    isLoading: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Criação de novo equipamento. Nome e código são obrigatórios.'
      }
    }
  }
};

export const Microscopio: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    equipamento: {
      id: '1',
      codigo: 'MIC001',
      nome: 'Microscópio Óptico Avançado',
      marca: 'Olympus',
      modelo: 'CX23',
      numeroSerie: 'OLY2024001',
      descricao: 'Microscópio óptico binocular com iluminação LED e objetivas planacromáticas',
      setorId: '1',
      dataAquisicao: '2024-01-15',
      valor: '15000.00',
      especificacoes: 'Aumento: 40x-1000x, Iluminação LED 3W, Base metálica',
      ativo: true,
      critico: true,
      dataCriacao: '2024-01-15T10:30:00Z'
    },
    isLoading: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Equipamento crítico com especificações técnicas completas.'
      }
    }
  }
};

export const BalancaPrecisao: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    equipamento: {
      id: '2',
      codigo: 'BAL002',
      nome: 'Balança Analítica de Precisão',
      marca: 'Shimadzu',
      modelo: 'AUY220',
      numeroSerie: 'SHI2023045',
      descricao: 'Balança analítica com precisão de 0,1mg para pesagens de alta precisão',
      setorId: '2',
      dataAquisicao: '2023-08-20',
      valor: '8500.00',
      especificacoes: 'Capacidade: 220g, Precisão: 0,1mg, Calibração interna',
      ativo: true,
      critico: true,
      dataCriacao: '2023-08-20T14:20:00Z'
    },
    isLoading: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Balança de precisão classificada como equipamento crítico.'
      }
    }
  }
};

export const Centrifuga: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    equipamento: {
      id: '3',
      codigo: 'CEN003',
      nome: 'Centrífuga de Bancada',
      marca: 'Eppendorf',
      modelo: '5424R',
      numeroSerie: 'EPP2024012',
      descricao: 'Centrífuga refrigerada para tubos de 1,5ml e 2,0ml',
      setorId: '2',
      dataAquisicao: '2024-03-10',
      valor: '12000.00',
      especificacoes: 'Velocidade máx: 21.130 x g, Temperatura: -9°C a +40°C',
      ativo: true,
      critico: false,
      dataCriacao: '2024-03-10T09:15:00Z'
    },
    isLoading: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Equipamento ativo mas não crítico com especificações de temperatura.'
      }
    }
  }
};

export const EquipamentoInativo: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    equipamento: {
      id: '4',
      codigo: 'EST004',
      nome: 'Estufa de Secagem Antiga',
      marca: 'Fanem',
      modelo: '315SE',
      numeroSerie: 'FAN2020088',
      descricao: 'Estufa desativada temporariamente para manutenção do sistema de controle',
      setorId: '3',
      dataAquisicao: '2020-05-15',
      valor: '3500.00',
      especificacoes: 'Temperatura: 5°C acima da ambiente até 250°C',
      ativo: false,
      critico: false,
      dataCriacao: '2020-05-15T16:45:00Z'
    },
    isLoading: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Equipamento inativo. Status é exibido no rodapé do modal.'
      }
    }
  }
};

export const EquipamentoBasico: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    equipamento: {
      id: '5',
      codigo: 'ARM005',
      nome: 'Armário de Segurança',
      marca: 'Permution',
      modelo: 'AS-60',
      numeroSerie: '',
      descricao: '',
      setorId: '3',
      dataAquisicao: '2023-12-01',
      valor: '2800.00',
      especificacoes: '',
      ativo: true,
      critico: false,
      dataCriacao: '2023-12-01T11:00:00Z'
    },
    isLoading: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Equipamento com informações mínimas, sem número de série e especificações.'
      }
    }
  }
};

export const Salvando: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    equipamento: undefined,
    isLoading: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado de carregamento durante o salvamento do equipamento.'
      }
    }
  }
};
