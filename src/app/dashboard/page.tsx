"use client";

import { useAuth } from '@/context/auth';
import { useMetadata } from '@/hooks/useMetadata';
import { Badge } from '@/components/atoms';
import { Header as HeaderComponent } from '@/components/organisms/Header';
import {
  DashboardContainer,
  Content,
  WelcomeSection,
  WelcomeTitle,
  WelcomeText,
  StatsGrid,
  StatCard,
  StatTitle,
  StatValue,
  StatLabel,
  QuickActions,
  ActionTitle,
  ActionGrid,
  ActionButton,
  ActionNote
} from './styles';

/**
 * Página principal do dashboard após login
 * Exibe informações do usuário logado e opções de navegação
 */
export default function Dashboard() {
  const { user, logout } = useAuth();

  useMetadata({
    title: `Nextar - Dashboard - Olá, ${user?.nome ?? 'Usuário'}`,
    ogTitle: `Nextar - Dashboard - Olá, ${user?.nome ?? 'Usuário'}`
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <DashboardContainer>
      {user && (
        <HeaderComponent
          userName={user.nome}
          userEmail={user.email}
          userProfile={user.perfil}
          isOnline={true}
          onLogout={handleLogout}
          onProfileClick={() => console.log('Abrir perfil')}
        />
      )}

      <Content>
        <WelcomeSection>
          <WelcomeTitle className='text-2xl leading-none xl:text-4xl'>Bem-vindo ao Sistema de Manutenção da Antártica</WelcomeTitle>
          <WelcomeText>
            Sistema integrado para gestão de equipamentos, chamados e recursos humanos
            em ambiente científico extremo.
          </WelcomeText>
        </WelcomeSection>

        <StatsGrid>
          <StatCard>
            <StatTitle>🔧 Chamados</StatTitle>
            <StatValue>--</StatValue>
            <StatLabel>
              <Badge variant="warning" size="small">Em desenvolvimento</Badge>
            </StatLabel>
          </StatCard>

          <StatCard>
            <StatTitle>⚙️ Equipamentos</StatTitle>
            <StatValue>--</StatValue>
            <StatLabel>
              <Badge variant="warning" size="small">Em desenvolvimento</Badge>
            </StatLabel>
          </StatCard>

          <StatCard>
            <StatTitle>👥 Usuários</StatTitle>
            <StatValue>6</StatValue>
            <StatLabel>
              <Badge variant="success" size="small">API Pronta</Badge>
            </StatLabel>
          </StatCard>

          <StatCard>
            <StatTitle>🏢 Setores</StatTitle>
            <StatValue>--</StatValue>
            <StatLabel>Em desenvolvimento</StatLabel>
          </StatCard>
        </StatsGrid>

        <QuickActions>
          <ActionTitle>🚀 Ações Rápidas</ActionTitle>
          <ActionGrid>
            <ActionButton disabled>
              📋 Novo Chamado
            </ActionButton>
            <ActionButton disabled>
              👤 Gerenciar Usuários
            </ActionButton>
            <ActionButton disabled>
              🔧 Equipamentos
            </ActionButton>
            <ActionButton disabled>
              📊 Relatórios
            </ActionButton>
          </ActionGrid>
          <ActionNote>
            * Funcionalidades em desenvolvimento
          </ActionNote>
        </QuickActions>
      </Content>
    </DashboardContainer>
  );
}


