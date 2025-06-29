import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './index';
import { PerfilUsuario } from '@/utils/enums';

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Componente organism Header que combina Logo + Navigation + SearchBox + UserCard.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    userProfile: {
      control: 'select',
      options: Object.values(PerfilUsuario),
      description: 'Perfil do usuário',
    },
    isOnline: {
      control: 'boolean',
      description: 'Se o usuário está online',
    },
    onLogout: {
      action: 'logout',
      description: 'Função executada ao fazer logout',
    },
    onProfileClick: {
      action: 'profile-click',
      description: 'Função executada ao clicar no perfil',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    userName: 'João Silva',
    userEmail: 'joao.silva@antartica.gov.br',
    userProfile: PerfilUsuario.PESQUISADOR,
    isOnline: true,
  },
};

export const Gestao: Story = {
  args: {
    userName: 'Dr. Maria Santos',
    userEmail: 'maria.santos@antartica.gov.br',
    userProfile: PerfilUsuario.GESTAO,
    isOnline: true,
  },
};

export const Agente: Story = {
  args: {
    userName: 'Carlos Eduardo',
    userEmail: 'carlos.eduardo@antartica.gov.br',
    userProfile: PerfilUsuario.AGENTE,
    isOnline: false,
  },
};

export const WithLongName: Story = {
  args: {
    userName: 'Ana Paula dos Santos Oliveira',
    userEmail: 'ana.paula.santos.oliveira@antartica.gov.br',
    userProfile: PerfilUsuario.PESQUISADOR,
    isOnline: true,
  },
};

export const Interactive: Story = {
  render: () => {
    const handleLogout = () => {
      alert('Logout realizado!');
    };
    
    const handleProfileClick = () => {
      alert('Abrindo perfil do usuário...');
    };
    
    return (
      <div style={{ height: '100vh', background: '#f9fafb' }}>
        <Header
          userName="Roberto Mendes"
          userEmail="roberto.mendes@antartica.gov.br"
          userProfile={PerfilUsuario.GESTAO}
          isOnline={true}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
        />
        
        <div style={{ padding: '24px' }}>
          <h1 style={{ color: '#374151', marginBottom: '16px' }}>
            Página de Exemplo
          </h1>
          <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
            Este é um exemplo de como o Header aparece em uma página real.
            O header fica fixo no topo e fornece navegação, busca e acesso
            ao perfil do usuário.
          </p>
          
          <div style={{ 
            marginTop: '32px', 
            padding: '20px', 
            background: 'white', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{ color: '#374151', marginBottom: '12px' }}>
              Funcionalidades do Header:
            </h2>
            <ul style={{ color: '#6b7280', lineHeight: '1.8' }}>
              <li>• Logo clicável para voltar ao dashboard</li>
              <li>• Menu de navegação principal</li>
              <li>• Busca global no sistema</li>
              <li>• Card do usuário com status online/offline</li>
              <li>• Menu dropdown com opções do usuário</li>
              <li>• Design responsivo para mobile</li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
};
