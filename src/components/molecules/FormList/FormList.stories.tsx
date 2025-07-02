import type { Meta, StoryObj } from '@storybook/react';
import { FormList } from './index';
import { useState } from 'react';

const meta: Meta<typeof FormList> = {
  title: 'Molecules/FormList',
  component: FormList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Componente de lista dinâmica para formulários.

**Características:**
- Adicionar/remover itens dinamicamente
- Formulário inline para novos itens
- Validação de campos
- Estados de vazio personalizáveis
- Limite máximo de itens
- Edição inline dos itens

**Uso:**
\`\`\`tsx
<FormList
  title="Lista de Itens"
  items={items}
  onChange={setItems}
  newItemFields={fields}
  addButtonText="Adicionar Item"
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Título da lista'
    },
    items: {
      description: 'Array de itens da lista'
    },
    maxItems: {
      control: 'number',
      description: 'Número máximo de itens permitidos'
    },
    allowEdit: {
      control: 'boolean',
      description: 'Se permite editar/remover itens'
    },
    addButtonText: {
      control: 'text',
      description: 'Texto do botão de adicionar'
    },
    emptyText: {
      control: 'text',
      description: 'Texto quando a lista está vazia'
    },
    emptyIcon: {
      control: 'text',
      description: 'Ícone quando a lista está vazia'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Template base
const FormListTemplate = (args: StoryObj<typeof FormList>) => {
  const [items, setItems] = useState(args.items || []);
  
  return (
    <div style={{ width: '600px' }}>
      <FormList
        {...args}
        items={items}
        onChange={setItems}
      />
    </div>
  );
};

// Campos para peças utilizadas
const pecasFields = [
  {
    key: 'nome',
    label: 'Nome da Peça',
    placeholder: 'Ex: Resistor 10kΩ, Fusível 20A',
    required: true,
    validate: (value: string) => {
      if (value.length < 2) return 'Nome deve ter pelo menos 2 caracteres';
      return null;
    }
  },
  {
    key: 'quantidade',
    label: 'Quantidade',
    placeholder: 'Ex: 2',
    type: 'number' as const,
    required: true,
    validate: (value: string) => {
      const num = parseInt(value);
      if (!value.trim() || isNaN(num) || num < 1) return 'Quantidade deve ser um número maior que 0';
      return null;
    }
  }
];

// Campos para contatos
const contatosFields = [
  {
    key: 'nome',
    label: 'Nome',
    placeholder: 'Nome completo',
    required: true
  },
  {
    key: 'email',
    label: 'Email',
    placeholder: 'email@exemplo.com',
    type: 'email' as const,
    required: true,
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Email inválido';
      return null;
    }
  },
  {
    key: 'telefone',
    label: 'Telefone',
    placeholder: '(11) 99999-9999',
    required: false
  }
];

// Campos para tarefas
const tarefasFields = [
  {
    key: 'titulo',
    label: 'Título',
    placeholder: 'Título da tarefa',
    required: true
  },
  {
    key: 'descricao',
    label: 'Descrição',
    placeholder: 'Descrição detalhada (opcional)',
    required: false
  }
];

export const PecasUtilizadas: Story = {
  args: {
    title: 'Peças Utilizadas',
    items: [
      {
        id: '1',
        title: 'Resistor 10kΩ',
        subtitle: 'Quantidade: 3',
        data: { nome: 'Resistor 10kΩ', quantidade: '3' }
      },
      {
        id: '2',
        title: 'Fusível 20A',
        subtitle: 'Quantidade: 1',
        data: { nome: 'Fusível 20A', quantidade: '1' }
      }
    ],
    newItemFields: pecasFields,
    addButtonText: 'Adicionar Peça',
    emptyText: 'Registre as peças utilizadas na manutenção',
    emptyIcon: '🔧',
    maxItems: 20,
    allowEdit: true,
    onChange: () => {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Lista de peças utilizadas em manutenção com validação de quantidade.'
      }
    }
  }
};

export const ListaContatos: Story = {
  render: FormListTemplate,
  args: {
    title: 'Contatos de Emergência',
    items: [
      {
        id: '1',
        title: 'João Silva',
        subtitle: 'joao@exemplo.com • (11) 99999-9999',
        data: { nome: 'João Silva', email: 'joao@exemplo.com', telefone: '(11) 99999-9999' }
      }
    ],
    newItemFields: contatosFields,
    addButtonText: 'Adicionar Contato',
    emptyText: 'Adicione contatos de emergência',
    emptyIcon: '📞',
    maxItems: 5,
    allowEdit: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Lista de contatos com validação de email.'
      }
    }
  }
};

export const ListaTarefas: Story = {
  render: FormListTemplate,
  args: {
    title: 'Lista de Tarefas',
    items: [
      {
        id: '1',
        title: 'Revisar documentação',
        subtitle: 'Atualizar manual do usuário',
        data: { titulo: 'Revisar documentação', descricao: 'Atualizar manual do usuário' }
      },
      {
        id: '2',
        title: 'Testar funcionalidades',
        subtitle: '',
        data: { titulo: 'Testar funcionalidades', descricao: '' }
      }
    ],
    newItemFields: tarefasFields,
    addButtonText: 'Adicionar Tarefa',
    emptyText: 'Nenhuma tarefa adicionada',
    emptyIcon: '📝',
    allowEdit: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Lista simples de tarefas.'
      }
    }
  }
};

export const ListaVazia: Story = {
  render: FormListTemplate,
  args: {
    title: 'Lista de Materiais',
    items: [],
    newItemFields: [
      {
        key: 'nome',
        label: 'Nome do Material',
        placeholder: 'Digite o nome do material',
        required: true
      }
    ],
    addButtonText: 'Adicionar Material',
    emptyText: 'Nenhum material adicionado ainda',
    emptyIcon: '📦',
    allowEdit: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado vazio da lista com mensagem personalizada.'
      }
    }
  }
};

export const LimiteMaximo: Story = {
  render: FormListTemplate,
  args: {
    title: 'Lista Limitada (máx 3)',
    items: [
      { id: '1', title: 'Item 1', subtitle: 'Primeiro item' },
      { id: '2', title: 'Item 2', subtitle: 'Segundo item' },
      { id: '3', title: 'Item 3', subtitle: 'Terceiro item' }
    ],
    newItemFields: [
      {
        key: 'nome',
        label: 'Nome',
        placeholder: 'Nome do item',
        required: true
      }
    ],
    addButtonText: 'Adicionar Item',
    emptyText: 'Lista vazia',
    emptyIcon: '📋',
    maxItems: 3,
    allowEdit: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Lista que atingiu o limite máximo de itens. O botão de adicionar fica desabilitado.'
      }
    }
  }
};

export const SomenteVisualizacao: Story = {
  render: FormListTemplate,
  args: {
    title: 'Itens (Somente Leitura)',
    items: [
      { id: '1', title: 'Item Fixo 1', subtitle: 'Não pode ser editado' },
      { id: '2', title: 'Item Fixo 2', subtitle: 'Visualização apenas' }
    ],
    newItemFields: [],
    addButtonText: 'Adicionar',
    emptyText: 'Nenhum item',
    emptyIcon: '👁️',
    allowEdit: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Lista em modo somente leitura - sem botões de edição ou adição.'
      }
    }
  }
};

export const ComValidacao: Story = {
  render: FormListTemplate,
  args: {
    title: 'Lista com Validação',
    items: [],
    newItemFields: [
      {
        key: 'codigo',
        label: 'Código',
        placeholder: 'Ex: ABC123',
        required: true,
        validate: (value: string) => {
          if (!/^[A-Z]{3}\d{3}$/.test(value.toUpperCase())) {
            return 'Código deve ter formato ABC123';
          }
          return null;
        }
      },
      {
        key: 'valor',
        label: 'Valor',
        placeholder: 'Ex: 100',
        type: 'number' as const,
        required: true,
        validate: (value: string) => {
          const num = parseFloat(value);
          if (isNaN(num) || num <= 0) {
            return 'Valor deve ser um número positivo';
          }
          if (num > 1000) {
            return 'Valor não pode ser maior que 1000';
          }
          return null;
        }
      }
    ],
    addButtonText: 'Adicionar Item',
    emptyText: 'Adicione itens com validação',
    emptyIcon: '✅',
    allowEdit: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Lista com validação customizada de campos. Tente adicionar valores inválidos para ver as mensagens de erro.'
      }
    }
  }
};
