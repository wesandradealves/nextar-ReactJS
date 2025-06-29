import type { Meta, StoryObj } from '@storybook/react';
import { Navigation } from './index';
import { PerfilUsuario } from '@/utils/enums';
import { navigationItems } from '@/data/navigation';

const meta: Meta<typeof Navigation> = {
  title: 'Molecules/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Componente molecular Navigation - Menu de navegação reutilizável para desktop e mobile com controle de permissões por perfil.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    userProfile: {
      control: 'select',
      options: Object.values(PerfilUsuario),
      description: 'Perfil do usuário para filtrar itens',
    },
    isMobile: {
      control: 'boolean',
      description: 'Se é versão mobile',
    },
    isOpen: {
      control: 'boolean',
      description: 'Se menu mobile está aberto',
    },
    onItemClick: {
      action: 'item-clicked',
      description: 'Função executada ao clicar em item',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Navigation>;

export const Desktop: Story = {
  args: {
    items: navigationItems,
    userProfile: PerfilUsuario.GESTAO,
    isMobile: false,
    currentPath: '/dashboard',
  },
};

export const Mobile: Story = {
  args: {
    items: navigationItems,
    userProfile: PerfilUsuario.GESTAO,
    isMobile: true,
    isOpen: true,
    currentPath: '/chamados',
  },
};

export const MobileClosed: Story = {
  args: {
    items: navigationItems,
    userProfile: PerfilUsuario.GESTAO,
    isMobile: true,
    isOpen: false,
  },
};

export const Pesquisador: Story = {
  args: {
    items: navigationItems,
    userProfile: PerfilUsuario.PESQUISADOR,
    isMobile: false,
    currentPath: '/chamados',
  },
};

export const Agente: Story = {
  args: {
    items: navigationItems,
    userProfile: PerfilUsuario.AGENTE,
    isMobile: false,
    currentPath: '/equipamentos',
  },
};

export const Interactive: Story = {
  render: () => {
    return (
      <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
        <div style={{ padding: '24px' }}>
          <h1 style={{ marginBottom: '24px', color: '#374151' }}>
            Navegação por Perfil
          </h1>
          
          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ marginBottom: '12px', color: '#374151' }}>Gestão (Acesso Total)</h3>
              <Navigation
                items={navigationItems}
                userProfile={PerfilUsuario.GESTAO}
                isMobile={false}
                currentPath="/usuarios"
              />
            </div>
            
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ marginBottom: '12px', color: '#374151' }}>Pesquisador (Acesso Limitado)</h3>
              <Navigation
                items={navigationItems}
                userProfile={PerfilUsuario.PESQUISADOR}
                isMobile={false}
                currentPath="/chamados"
              />
            </div>
            
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ marginBottom: '12px', color: '#374151' }}>Agente (Acesso Limitado)</h3>
              <Navigation
                items={navigationItems}
                userProfile={PerfilUsuario.AGENTE}
                isMobile={false}
                currentPath="/equipamentos"
              />
            </div>
            
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ marginBottom: '12px', color: '#374151' }}>Versão Mobile (Gestão)</h3>
              <div style={{ position: 'relative', height: '200px' }}>
                <Navigation
                  items={navigationItems}
                  userProfile={PerfilUsuario.GESTAO}
                  isMobile={true}
                  isOpen={true}
                  currentPath="/relatorios"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
