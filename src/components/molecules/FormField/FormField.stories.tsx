import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './index';

const meta: Meta<typeof FormField> = {
  title: 'Molecules/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente molecular FormField que combina Label + Input + validação e ajuda.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Tipo do input',
    },
    required: {
      control: 'boolean',
      description: 'Se o campo é obrigatório',
    },
    disabled: {
      control: 'boolean',
      description: 'Se o campo está desabilitado',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'default',
    label: 'Nome',
    placeholder: 'Digite seu nome',
  },
};

export const Required: Story = {
  args: {
    id: 'required',
    label: 'Email',
    type: 'email',
    placeholder: 'seu@email.com',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    id: 'error',
    label: 'Senha',
    type: 'password',
    placeholder: 'Digite sua senha',
    required: true,
    error: 'Senha deve ter pelo menos 8 caracteres',
    value: '123',
  },
};

export const WithHelp: Story = {
  args: {
    id: 'help',
    label: 'Telefone',
    type: 'tel',
    placeholder: '(11) 99999-9999',
    helpText: 'Digite seu telefone com DDD no formato (11) 99999-9999',
  },
};

export const Disabled: Story = {
  args: {
    id: 'disabled',
    label: 'Campo Desabilitado',
    placeholder: 'Este campo está desabilitado',
    disabled: true,
    value: 'Valor fixo',
  },
};

export const FormExample: Story = {
  render: () => (
    <div style={{ width: '400px', padding: '20px' }}>
      <h3 style={{ marginBottom: '24px', color: '#374151' }}>Formulário de Cadastro</h3>
      
      <FormField
        id="name"
        label="Nome Completo"
        type="text"
        placeholder="Digite seu nome completo"
        required
      />
      
      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="seu@email.com"
        required
        helpText="Usaremos este email para contato"
      />
      
      <FormField
        id="password"
        label="Senha"
        type="password"
        placeholder="Mínimo 8 caracteres"
        required
        helpText="Use uma combinação de letras, números e símbolos"
      />
      
      <FormField
        id="phone"
        label="Telefone"
        type="tel"
        placeholder="(11) 99999-9999"
        helpText="Opcional - para contato em caso de urgência"
      />
    </div>
  ),
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ width: '400px', padding: '20px' }}>
      <h3 style={{ marginBottom: '24px', color: '#374151' }}>Estados de Validação</h3>
      
      <FormField
        id="valid"
        label="Campo Válido"
        type="email"
        value="usuario@exemplo.com"
        helpText="Email em formato válido"
      />
      
      <FormField
        id="invalid"
        label="Campo Inválido"
        type="email"
        value="email-invalido"
        required
        error="Formato de email inválido"
      />
      
      <FormField
        id="empty-required"
        label="Campo Obrigatório Vazio"
        type="text"
        placeholder="Este campo é obrigatório"
        required
        error="Este campo é obrigatório"
      />
    </div>
  ),
};
