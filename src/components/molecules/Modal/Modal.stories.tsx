import type { Meta, StoryObj } from '@storybook/react';
import Modal from './index';
import { useState } from 'react';
import { Button } from '../../atoms/Button';

const meta: Meta<typeof Modal> = {
  title: 'Molecules/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Modal base reutilizável com overlay e animações.

**Características:**
- Bloqueia scroll do body quando aberto
- Fecha com ESC ou clique no overlay
- Suporta conteúdo customizado e ações
- Funciona com React Portal
- Focável e acessível
- Diferentes tamanhos

**Uso:**
\`\`\`tsx
<Modal
  isOpen={true}
  onClose={() => {}}
  title="Título do Modal"
>
  Conteúdo do modal
</Modal>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Se o modal está aberto'
    },
    title: {
      control: 'text',
      description: 'Título do modal'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do modal'
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Se deve mostrar o botão X de fechar'
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Se deve fechar ao clicar no overlay'
    },
    closeOnEsc: {
      control: 'boolean',
      description: 'Se deve fechar ao pressionar ESC'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const ModalTemplate = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="primary">
        Abrir Modal
      </Button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        {args.children}
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: ModalTemplate,
  args: {
    title: 'Modal Padrão',
    children: (
      <div style={{ padding: '20px' }}>
        <p>Este é o conteúdo do modal padrão.</p>
        <p>Você pode incluir qualquer conteúdo aqui.</p>
      </div>
    )
  }
};

export const SmallSize: Story = {
  render: ModalTemplate,
  args: {
    title: 'Modal Pequeno',
    size: 'small',
    children: (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Modal em tamanho pequeno</p>
        <p>Ideal para confirmações simples.</p>
      </div>
    )
  }
};

export const LargeSize: Story = {
  render: ModalTemplate,
  args: {
    title: 'Modal Grande',
    size: 'large',
    children: (
      <div style={{ padding: '20px' }}>
        <p>Modal em tamanho grande para mais conteúdo.</p>
        <div style={{ marginTop: '20px' }}>
          <h3>Seção 1</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          
          <h3>Seção 2</h3>
          <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          
          <h3>Seção 3</h3>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
        </div>
      </div>
    )
  }
};

export const WithFooter: Story = {
  render: ModalTemplate,
  args: {
    title: 'Modal com Footer',
    children: (
      <div style={{ padding: '20px' }}>
        <p>Este modal possui um footer customizado com botões de ação.</p>
        <p>O footer é passado como prop separada do conteúdo principal.</p>
      </div>
    ),
    footer: (
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'flex-end',
        padding: '16px'
      }}>
        <Button variant="outline">Cancelar</Button>
        <Button variant="primary">Confirmar</Button>
      </div>
    )
  }
};

export const WithoutCloseButton: Story = {
  render: ModalTemplate,
  args: {
    title: 'Sem Botão Fechar',
    showCloseButton: false,
    children: (
      <div style={{ padding: '20px' }}>
        <p>Este modal não possui o botão X no canto superior direito.</p>
        <p>Só pode ser fechado via ação programática ou ESC.</p>
      </div>
    )
  }
};

export const NoOverlayClose: Story = {
  render: ModalTemplate,
  args: {
    title: 'Sem Fechar no Overlay',
    closeOnOverlayClick: false,
    children: (
      <div style={{ padding: '20px' }}>
        <p>Este modal não fecha ao clicar no overlay (fundo escuro).</p>
        <p>Use o botão X ou pressione ESC para fechar.</p>
      </div>
    )
  }
};

export const NoEscapeClose: Story = {
  render: ModalTemplate,
  args: {
    title: 'Sem Fechar com ESC',
    closeOnEsc: false,
    children: (
      <div style={{ padding: '20px' }}>
        <p>Este modal não fecha ao pressionar a tecla ESC.</p>
        <p>Use o botão X ou clique no overlay para fechar.</p>
      </div>
    )
  }
};

export const FullyControlled: Story = {
  render: ModalTemplate,
  args: {
    title: 'Modal Totalmente Controlado',
    showCloseButton: false,
    closeOnOverlayClick: false,
    closeOnEsc: false,
    children: (
      <div style={{ padding: '20px' }}>
        <p>Este modal só pode ser fechado programaticamente.</p>
        <p>Todas as opções de fechamento automático estão desabilitadas.</p>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Button variant="primary">Ação Obrigatória</Button>
        </div>
      </div>
    )
  }
};

export const ConfirmationDialog: Story = {
  render: (args: any) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)} variant="danger">
          Excluir Item
        </Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ marginBottom: '16px', color: '#dc2626' }}>Confirmar Exclusão</h3>
            <p style={{ marginBottom: '24px', color: '#6b7280' }}>
              Esta ação não pode ser desfeita. Tem certeza que deseja excluir este item?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={() => setIsOpen(false)}>
                Excluir
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
  args: {
    title: 'Excluir Item',
    size: 'small'
  },
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso como diálogo de confirmação.'
      }
    }
  }
};

export const ContentModal: Story = {
  render: ModalTemplate,
  args: {
    title: 'Modal com Conteúdo Rico',
    size: 'large',
    children: (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3>Informações do Usuário</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px',
            marginTop: '16px'
          }}>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                Nome:
              </label>
              <span>João Silva</span>
            </div>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                Email:
              </label>
              <span>joao@exemplo.com</span>
            </div>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                Telefone:
              </label>
              <span>(11) 99999-9999</span>
            </div>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                Setor:
              </label>
              <span>Biologia</span>
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>Histórico de Atividades</h3>
          <div style={{ marginTop: '16px' }}>
            <div style={{ 
              padding: '12px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <strong>Login realizado</strong> • Hoje às 09:30
            </div>
            <div style={{ 
              padding: '12px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <strong>Chamado criado</strong> • Ontem às 14:22
            </div>
            <div style={{ 
              padding: '12px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '6px'
            }}>
              <strong>Perfil atualizado</strong> • 2 dias atrás
            </div>
          </div>
        </div>
      </div>
    ),
    footer: (
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'flex-end',
        padding: '16px'
      }}>
        <Button variant="outline">Editar</Button>
        <Button variant="primary">Salvar</Button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de modal com conteúdo rico e estruturado.'
      }
    }
  }
};
