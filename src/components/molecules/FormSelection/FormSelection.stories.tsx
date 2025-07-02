import type { Meta, StoryObj } from '@storybook/react';
import { FormSelection } from './index';
import { useState } from 'react';

const meta: Meta<typeof FormSelection> = {
  title: 'Molecules/FormSelection',
  component: FormSelection,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Componente de seleção visual com opções estilizadas.

**Características:**
- Seleção única ou múltipla
- Opções com cores, ícones e descrições
- Indicadores visuais (radio/checkbox)
- Diferentes tamanhos
- Estados desabilitados

**Uso:**
\`\`\`tsx
<FormSelection
  options={options}
  value={selected}
  onChange={(value) => setSelected(value)}
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    options: {
      description: 'Array de opções para seleção'
    },
    value: {
      control: 'text',
      description: 'Valor selecionado atual (para seleção única)'
    },
    multiple: {
      control: 'boolean',
      description: 'Se permite múltipla seleção'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Tamanho das opções'
    },
    showIndicator: {
      control: 'boolean',
      description: 'Se deve mostrar radio/checkbox visual'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Opções de exemplo para prioridade
const priorityOptions = [
  {
    id: 'low',
    label: 'Baixa',
    description: 'Pode aguardar programação',
    color: '#10b981',
    icon: '🟢'
  },
  {
    id: 'medium',
    label: 'Média',
    description: 'Programar com antecedência',
    color: '#f59e0b',
    icon: '🟡'
  },
  {
    id: 'high',
    label: 'Alta',
    description: 'Necessita atenção prioritária',
    color: '#ef4444',
    icon: '🔴'
  }
];

// Opções de exemplo para tipo de manutenção
const maintenanceTypeOptions = [
  {
    id: 'preventive',
    label: 'Manutenção Preventiva',
    description: 'Manutenção planejada para prevenir problemas',
    color: '#10b981',
    icon: '🔧'
  },
  {
    id: 'corrective',
    label: 'Manutenção Corretiva',
    description: 'Correção de problemas identificados',
    color: '#f59e0b',
    icon: '⚠️'
  }
];

// Opções de exemplo para setores
const sectorOptions = [
  {
    id: 'biology',
    label: 'Biologia',
    description: 'Pesquisas biológicas e ecológicas',
    color: '#10b981',
    icon: '🧬'
  },
  {
    id: 'meteorology',
    label: 'Meteorologia',
    description: 'Monitoramento climático',
    color: '#3b82f6',
    icon: '🌤️'
  },
  {
    id: 'glaciology',
    label: 'Glaciologia',
    description: 'Estudos de gelo e glaciares',
    color: '#06b6d4',
    icon: '❄️'
  },
  {
    id: 'medicine',
    label: 'Medicina',
    description: 'Cuidados médicos da equipe',
    color: '#ef4444',
    icon: '⚕️',
    disabled: true
  }
];

const SingleSelectionTemplate = (args: any) => {
  const [selected, setSelected] = useState(args.value || '');
  
  return (
    <div style={{ width: '500px' }}>
      <FormSelection
        {...args}
        value={selected}
        onChange={setSelected}
      />
      <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
        Selecionado: {selected || 'Nenhum'}
      </p>
    </div>
  );
};

const MultipleSelectionTemplate = (args: any) => {
  const [selected, setSelected] = useState<string[]>(args.values || []);
  
  return (
    <div style={{ width: '500px' }}>
      <FormSelection
        {...args}
        values={selected}
        onMultipleChange={setSelected}
      />
      <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
        Selecionados: {selected.join(', ') || 'Nenhum'}
      </p>
    </div>
  );
};

export const Priority: Story = {
  render: SingleSelectionTemplate,
  args: {
    options: priorityOptions,
    value: 'medium'
  },
  parameters: {
    docs: {
      description: {
        story: 'Seleção de prioridade com cores e ícones visuais.'
      }
    }
  }
};

export const MaintenanceType: Story = {
  render: SingleSelectionTemplate,
  args: {
    options: maintenanceTypeOptions,
    value: 'preventive'
  },
  parameters: {
    docs: {
      description: {
        story: 'Seleção de tipo de manutenção.'
      }
    }
  }
};

export const Sectors: Story = {
  render: SingleSelectionTemplate,
  args: {
    options: sectorOptions,
    showIndicator: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Seleção de setores com indicadores visuais (radio buttons). Note que uma opção está desabilitada.'
      }
    }
  }
};

export const SmallSize: Story = {
  render: SingleSelectionTemplate,
  args: {
    options: priorityOptions,
    size: 'small',
    value: 'high'
  },
  parameters: {
    docs: {
      description: {
        story: 'Opções em tamanho pequeno.'
      }
    }
  }
};

export const LargeSize: Story = {
  render: SingleSelectionTemplate,
  args: {
    options: maintenanceTypeOptions,
    size: 'large',
    showIndicator: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Opções em tamanho grande com indicadores.'
      }
    }
  }
};

export const MultipleSelection: Story = {
  render: MultipleSelectionTemplate,
  args: {
    options: sectorOptions,
    multiple: true,
    values: ['biology', 'meteorology'],
    showIndicator: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Seleção múltipla com checkboxes. Permite selecionar várias opções ao mesmo tempo.'
      }
    }
  }
};

export const NoSelection: Story = {
  render: SingleSelectionTemplate,
  args: {
    options: priorityOptions
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado inicial sem nenhuma seleção.'
      }
    }
  }
};

export const WithoutDescriptions: Story = {
  render: SingleSelectionTemplate,
  args: {
    options: [
      { id: 'option1', label: 'Opção 1', color: '#3b82f6', icon: '1️⃣' },
      { id: 'option2', label: 'Opção 2', color: '#10b981', icon: '2️⃣' },
      { id: 'option3', label: 'Opção 3', color: '#f59e0b', icon: '3️⃣' }
    ],
    value: 'option2',
    showIndicator: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Opções simples sem descrições detalhadas.'
      }
    }
  }
};
