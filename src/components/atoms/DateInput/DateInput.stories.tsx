import type { Meta, StoryObj } from '@storybook/react';
import { DateInput } from './index';

const meta: Meta<typeof DateInput> = {
  title: 'Atoms/DateInput',
  component: DateInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Componente de input de data brasileiro que usa HTML5 input type="date".

**Características:**
- Input nativo do navegador com calendário/datepicker
- Conversão automática entre formatos ISO e brasileiro
- Validação nativa de datas
- Suporte a datas mínimas e máximas
- Acessibilidade built-in

**Uso:**
\`\`\`tsx
<DateInput
  value="2025-07-02"
  onChange={(value) => console.log(value)}
  placeholder="Selecione a data"
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Valor da data em formato ISO (yyyy-mm-dd) ou objeto Date'
    },
    onChange: {
      action: 'changed',
      description: 'Função chamada quando a data muda'
    },
    placeholder: {
      control: 'text',
      description: 'Texto de placeholder do input'
    },
    disabled: {
      control: 'boolean',
      description: 'Se o input está desabilitado'
    },
    required: {
      control: 'boolean',
      description: 'Se o input é obrigatório'
    },
    min: {
      control: 'text',
      description: 'Data mínima permitida (formato yyyy-mm-dd)'
    },
    max: {
      control: 'text',
      description: 'Data máxima permitida (formato yyyy-mm-dd)'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Selecione a data'
  }
};

export const WithValue: Story = {
  args: {
    value: '2025-07-02',
    placeholder: 'Data selecionada'
  }
};

export const Required: Story = {
  args: {
    required: true,
    placeholder: 'Data obrigatória'
  }
};

export const Disabled: Story = {
  args: {
    value: '2025-07-02',
    disabled: true,
    placeholder: 'Data desabilitada'
  }
};

export const WithMinMax: Story = {
  args: {
    min: '2025-07-01',
    max: '2025-12-31',
    placeholder: 'Entre 01/07/2025 e 31/12/2025'
  },
  parameters: {
    docs: {
      description: {
        story: 'Input com datas mínima e máxima definidas. O calendário só permitirá selecionar datas dentro do intervalo.'
      }
    }
  }
};

export const MaintenanceDate: Story = {
  args: {
    value: '2025-08-15',
    min: new Date().toISOString().split('T')[0], // Hoje
    placeholder: 'Data da próxima manutenção'
  },
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso para agendamento de manutenção, onde só são permitidas datas futuras.'
      }
    }
  }
};

export const ExecutionDate: Story = {
  args: {
    max: new Date().toISOString().split('T')[0], // Hoje
    placeholder: 'Data de execução'
  },
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso para registrar data de execução, onde só são permitidas datas passadas ou atuais.'
      }
    }
  }
};
