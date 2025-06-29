import type { Meta, StoryObj } from '@storybook/react';
import { UserCard } from './index';
import { PerfilUsuario } from '@/utils/enums';

const meta: Meta<typeof UserCard> = {
  title: 'Molecules/UserCard',
  component: UserCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente molecular UserCard que combina Avatar + Nome + Perfil + Status.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    profile: {
      control: 'select',
      options: Object.values(PerfilUsuario),
      description: 'Perfil do usuário',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do card',
    },
    isOnline: {
      control: 'boolean',
      description: 'Se o usuário está online',
    },
    clickable: {
      control: 'boolean',
      description: 'Se o card é clicável',
    },
    onClick: {
      action: 'clicked',
      description: 'Função executada ao clicar',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'João Silva',
    email: 'joao.silva@antartica.gov.br',
    profile: PerfilUsuario.PESQUISADOR,
  },
};

export const Profiles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <UserCard
        name="Dr. Maria Santos"
        email="maria.santos@antartica.gov.br"
        profile={PerfilUsuario.GESTAO}
        isOnline={true}
      />
      <UserCard
        name="Carlos Eduardo"
        email="carlos.eduardo@antartica.gov.br"
        profile={PerfilUsuario.AGENTE}
        isOnline={false}
      />
      <UserCard
        name="Ana Paula"
        email="ana.paula@antartica.gov.br"
        profile={PerfilUsuario.PESQUISADOR}
        isOnline={true}
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <UserCard
        name="Usuário Pequeno"
        profile={PerfilUsuario.PESQUISADOR}
        size="small"
      />
      <UserCard
        name="Usuário Médio"
        email="usuario@antartica.gov.br"
        profile={PerfilUsuario.AGENTE}
        size="medium"
      />
      <UserCard
        name="Usuário Grande"
        email="grande@antartica.gov.br"
        profile={PerfilUsuario.GESTAO}
        size="large"
        isOnline={true}
      />
    </div>
  ),
};

export const WithoutEmail: Story = {
  args: {
    name: 'Usuário Sem Email',
    profile: PerfilUsuario.PESQUISADOR,
    isOnline: true,
  },
};

export const Clickable: Story = {
  args: {
    name: 'Usuário Clicável',
    email: 'clicavel@antartica.gov.br',
    profile: PerfilUsuario.AGENTE,
    clickable: true,
    onClick: () => alert('Card clicado!'),
  },
};

export const OnlineStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <UserCard
        name="Usuário Online"
        email="online@antartica.gov.br"
        profile={PerfilUsuario.PESQUISADOR}
        isOnline={true}
      />
      <UserCard
        name="Usuário Offline"
        email="offline@antartica.gov.br"
        profile={PerfilUsuario.AGENTE}
        isOnline={false}
      />
    </div>
  ),
};

export const TeamExample: Story = {
  render: () => (
    <div style={{ width: '400px', padding: '20px' }}>
      <h3 style={{ marginBottom: '16px', color: '#374151' }}>Equipe da Estação Antártica</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <UserCard
          name="Dr. Roberto Mendes"
          email="roberto.mendes@antartica.gov.br"
          profile={PerfilUsuario.GESTAO}
          isOnline={true}
          clickable
          onClick={() => console.log('Abrir perfil do gestor')}
        />
        
        <UserCard
          name="Eng. Carlos Santos"
          email="carlos.santos@antartica.gov.br"
          profile={PerfilUsuario.AGENTE}
          isOnline={true}
          clickable
          onClick={() => console.log('Abrir perfil do agente')}
        />
        
        <UserCard
          name="Dra. Ana Costa"
          email="ana.costa@antartica.gov.br"
          profile={PerfilUsuario.PESQUISADOR}
          isOnline={false}
          clickable
          onClick={() => console.log('Abrir perfil da pesquisadora')}
        />
        
        <UserCard
          name="José Silva"
          email="jose.silva@antartica.gov.br"
          profile={PerfilUsuario.AGENTE}
          isOnline={true}
          clickable
          onClick={() => console.log('Abrir perfil do técnico')}
        />
      </div>
    </div>
  ),
};

export const CompactList: Story = {
  render: () => (
    <div style={{ width: '300px', padding: '20px' }}>
      <h4 style={{ marginBottom: '12px', color: '#374151' }}>Usuários Online</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <UserCard
          name="Maria Santos"
          profile={PerfilUsuario.GESTAO}
          size="small"
          isOnline={true}
          clickable
        />
        <UserCard
          name="João Silva"
          profile={PerfilUsuario.AGENTE}
          size="small"
          isOnline={true}
          clickable
        />
        <UserCard
          name="Ana Paula"
          profile={PerfilUsuario.PESQUISADOR}
          size="small"
          isOnline={true}
          clickable
        />
      </div>
    </div>
  ),
};
