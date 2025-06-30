import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Textarea from './index';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Componente atômico para campos de texto multilinha com suporte a validação, contador de caracteres e estados de erro.'
      }
    }
  },
  argTypes: {
    value: {
      description: 'Valor atual do textarea',
      control: 'text'
    },
    onChange: {
      description: 'Callback executado quando o valor muda',
      action: 'changed'
    },
    placeholder: {
      description: 'Texto de placeholder',
      control: 'text'
    },
    disabled: {
      description: 'Se o textarea está desabilitado',
      control: 'boolean'
    },
    required: {
      description: 'Se o textarea é obrigatório',
      control: 'boolean'
    },
    rows: {
      description: 'Número de linhas visíveis',
      control: 'number'
    },
    error: {
      description: 'Se está em estado de erro',
      control: 'boolean'
    },
    helperText: {
      description: 'Texto de ajuda ou erro',
      control: 'text'
    },
    maxLength: {
      description: 'Máximo de caracteres permitidos',
      control: 'number'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Textarea>;

import type { TextareaProps } from './types';

// Template com estado controlado
const InteractiveTemplate = (args: TextareaProps) => {
  const [value, setValue] = useState(args.value || '');
  
  return (
    <Textarea
      {...args}
      value={value}
      onChange={setValue}
    />
  );
};

export const Default: Story = {
  render: InteractiveTemplate,
  args: {
    placeholder: 'Digite sua mensagem aqui...',
    rows: 3
  }
};

export const WithHelperText: Story = {
  render: InteractiveTemplate,
  args: {
    placeholder: 'Descreva o problema',
    helperText: 'Seja o mais específico possível',
    rows: 4
  }
};

export const WithCharacterLimit: Story = {
  render: InteractiveTemplate,
  args: {
    placeholder: 'Máximo 200 caracteres',
    maxLength: 200,
    rows: 4
  }
};

export const ErrorState: Story = {
  render: InteractiveTemplate,
  args: {
    placeholder: 'Campo obrigatório',
    error: true,
    helperText: 'Este campo é obrigatório',
    rows: 3
  }
};

export const Disabled: Story = {
  render: InteractiveTemplate,
  args: {
    value: 'Este textarea está desabilitado',
    disabled: true,
    rows: 3
  }
};

export const Required: Story = {
  render: InteractiveTemplate,
  args: {
    placeholder: 'Campo obrigatório *',
    required: true,
    helperText: 'Este campo é obrigatório',
    rows: 3
  }
};

export const LargeTextarea: Story = {
  render: InteractiveTemplate,
  args: {
    placeholder: 'Textarea grande para textos longos',
    rows: 8,
    maxLength: 1000
  }
};

// Componente separado para evitar problemas com hooks
const FormExampleComponent = () => {
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Descrição do Problema *
        </label>
        <Textarea
          value={description}
          onChange={setDescription}
          placeholder="Descreva detalhadamente o problema encontrado"
          required
          rows={4}
          maxLength={500}
          error={description.length === 0}
          helperText={description.length === 0 ? 'Campo obrigatório' : undefined}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Observações Adicionais
        </label>
        <Textarea
          value={notes}
          onChange={setNotes}
          placeholder="Informações extras (opcional)"
          rows={3}
          maxLength={300}
          helperText="Adicione qualquer informação relevante"
        />
      </div>
    </div>
  );
};

export const FormExample: Story = {
  render: () => <FormExampleComponent />
};
