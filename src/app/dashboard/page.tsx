"use client";

import { useAuth } from '@/context/auth';
import { useMetadata } from '@/hooks/useMetadata';
import { Logo } from '@/components/atoms';
import {
  DashboardContainer,
  Header,
  UserInfo,
  UserGreeting,
  UserProfile,
  LogoutButton,
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
  const { user, logout, isLoggingOut } = useAuth();

  useMetadata({
    title: `Nextar - Dashboard - Olá, ${user?.nome ?? 'Usuário'}`,
    ogTitle: `Nextar - Dashboard - Olá, ${user?.nome ?? 'Usuário'}`
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <DashboardContainer>
      <Header>
        <Logo variant="header" size="small" />
        <UserInfo>
          {!isLoggingOut && user && (
            <>
              <UserGreeting className='hidden sm:flex'>
                Olá, <strong>{user.nome}</strong>!
              </UserGreeting>
              <UserProfile className='hidden sm:flex'>
                Perfil: {user.perfil}
              </UserProfile>
            </>
          )}
          {isLoggingOut ? (
            <LogoutButton disabled>
              Saindo...
            </LogoutButton>
          ) : (
            <LogoutButton onClick={handleLogout}>
              Sair
            </LogoutButton>
          )}
        </UserInfo>
      </Header>

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
            <StatLabel>Em desenvolvimento</StatLabel>
          </StatCard>

          <StatCard>
            <StatTitle>⚙️ Equipamentos</StatTitle>
            <StatValue>--</StatValue>
            <StatLabel>Em desenvolvimento</StatLabel>
          </StatCard>

          <StatCard>
            <StatTitle>👥 Usuários</StatTitle>
            <StatValue>6</StatValue>
            <StatLabel>Ativos no sistema</StatLabel>
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


