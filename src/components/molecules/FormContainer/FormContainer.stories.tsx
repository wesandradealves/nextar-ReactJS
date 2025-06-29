import type { Meta, StoryObj } from '@storybook/react';
import { FormContainer } from './index';
import { FormFieldConfig } from './types';

const meta = {
  title: 'Molecules/FormContainer',
  component: FormContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Container de formulário com validação automática. Permite agrupar múltiplos FormFields com validação centralizada.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    fields: {
      description: 'Configurações dos campos do formulário',
      control: 'object'
    },
    onSubmit: {
      description: 'Callback executado quando o formulário é submetido',
      action: 'submitted'
    },
    initialValues: {
      description: 'Valores iniciais dos campos',
      control: 'object'
    },
    validateOnChange: {
      description: 'Se deve validar em tempo real',
      control: 'boolean'
    },
    validateOnBlur: {
      description: 'Se deve validar quando o campo perde o foco',
      control: 'boolean'
    },
    submitText: {
      description: 'Texto do botão de submit',
      control: 'text'
    },
    resetText: {
      description: 'Texto do botão de reset',
      control: 'text'
    },
    showReset: {
      description: 'Se deve mostrar o botão de reset',
      control: 'boolean'
    }
  }
} satisfies Meta<typeof FormContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Campos de exemplo para login
const loginFields: FormFieldConfig[] = [
  {
    id: 'email',
    label: 'E-mail',
    type: 'email',
    placeholder: 'seu@email.com',
    required: true,
    validation: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },
  {
    id: 'password',
    label: 'Senha',
    type: 'password',
    placeholder: 'Digite sua senha',
    required: true,
    validation: {
      minLength: 6
    }
  }
];

// Campos de exemplo para cadastro de usuário
const userRegistrationFields: FormFieldConfig[] = [
  {
    id: 'name',
    label: 'Nome Completo',
    type: 'text',
    placeholder: 'João da Silva',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 100
    }
  },
  {
    id: 'email',
    label: 'E-mail',
    type: 'email',
    placeholder: 'joao@exemplo.com',
    required: true,
    helpText: 'Será usado para login no sistema',
    validation: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },
  {
    id: 'phone',
    label: 'Telefone',
    type: 'tel',
    placeholder: '(11) 99999-9999',
    validation: {
      pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      custom: (value) => {
        if (value && !value.match(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)) {
          return 'Formato: (11) 99999-9999';
        }
        return null;
      }
    }
  },
  {
    id: 'age',
    label: 'Idade',
    type: 'number',
    placeholder: '25',
    validation: {
      min: 18,
      max: 120
    }
  },
  {
    id: 'password',
    label: 'Senha',
    type: 'password',
    placeholder: 'Mínimo 8 caracteres',
    required: true,
    helpText: 'Use pelo menos 8 caracteres com letras e números',
    validation: {
      minLength: 8,
      custom: (value) => {
        if (value && value.length >= 8) {
          if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
            return 'Use pelo menos uma letra e um número';
          }
        }
        return null;
      }
    }
  },
  {
    id: 'confirmPassword',
    label: 'Confirmar Senha',
    type: 'password',
    placeholder: 'Digite a senha novamente',
    required: true,
    validation: {
      custom: (value) => {
        // Em uma implementação real, você teria acesso aos outros campos
        // Por ora, apenas validamos se não está vazio
        if (!value) {
          return 'Confirmação de senha é obrigatória';
        }
        return null;
      }
    }
  }
];

/**
 * Formulário de login simples
 */
export const LoginForm: Story = {
  args: {
    fields: loginFields,
    onSubmit: (data) => console.log('Login:', data),
    submitText: 'Entrar',
    validateOnBlur: true,
    validateOnChange: false
  }
};

/**
 * Formulário de login com validação em tempo real
 */
export const LoginFormRealTime: Story = {
  args: {
    fields: loginFields,
    onSubmit: (data) => console.log('Login:', data),
    submitText: 'Entrar',
    validateOnBlur: true,
    validateOnChange: true
  }
};

/**
 * Formulário de cadastro completo
 */
export const UserRegistration: Story = {
  args: {
    fields: userRegistrationFields,
    onSubmit: (data) => console.log('Cadastro:', data),
    submitText: 'Cadastrar',
    resetText: 'Limpar',
    showReset: true,
    validateOnBlur: true,
    validateOnChange: false
  }
};

/**
 * Formulário de cadastro com validação em tempo real
 */
export const UserRegistrationRealTime: Story = {
  args: {
    fields: userRegistrationFields,
    onSubmit: (data) => console.log('Cadastro:', data),
    submitText: 'Cadastrar',
    resetText: 'Limpar',
    showReset: true,
    validateOnBlur: true,
    validateOnChange: true
  }
};

/**
 * Formulário com valores iniciais
 */
export const WithInitialValues: Story = {
  args: {
    fields: userRegistrationFields,
    onSubmit: (data) => console.log('Atualização:', data),
    submitText: 'Atualizar',
    resetText: 'Restaurar',
    showReset: true,
    validateOnBlur: true,
    initialValues: {
      name: 'João da Silva',
      email: 'joao@exemplo.com',
      phone: '(11) 99999-9999',
      age: '30'
    }
  }
};

/**
 * Formulário simples com apenas um campo
 */
export const SingleField: Story = {
  args: {
    fields: [
      {
        id: 'search',
        label: 'Buscar',
        type: 'search',
        placeholder: 'Digite sua busca...',
        helpText: 'Pressione Enter para buscar'
      }
    ],
    onSubmit: (data) => console.log('Busca:', data),
    submitText: 'Buscar',
    validateOnChange: false
  }
};
