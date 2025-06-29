"use client";

import { useAuth } from '@/context/auth';
import { useMetadata } from '@/hooks/useMetadata';
import { PerfilUsuario } from '@/utils/enums';
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
  const { user, logout, isLoggingOut } = useAuth();

  useMetadata({
    title: `Nextar - Dashboard - Olá, ${user?.nome ?? 'Usuário'}`,
    ogTitle: `Nextar - Dashboard - Olá, ${user?.nome ?? 'Usuário'}`
  });

  const handleLogout = () => {
    logout();
  };

  // Garante que o header permaneça visível durante todo o processo de logout
  const shouldShowHeader = user || isLoggingOut;
  // Dados seguros para o header durante logout
  const headerUserName = user?.nome || 'Usuário';
  const headerUserEmail = user?.email || '';
  const headerUserProfile = user?.perfil || PerfilUsuario.PESQUISADOR;

  return (
    <DashboardContainer>
      {shouldShowHeader && (
        <HeaderComponent
          userName={headerUserName}
          userEmail={headerUserEmail}
          userProfile={headerUserProfile}
          isOnline={true}
          isLoggingOut={isLoggingOut}
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
            <ActionButton disabled={isLoggingOut}>
              📋 Novo Chamado
            </ActionButton>
            <ActionButton disabled={isLoggingOut}>
              👤 Gerenciar Usuários
            </ActionButton>
            <ActionButton disabled={isLoggingOut}>
              🔧 Equipamentos
            </ActionButton>
            <ActionButton disabled={isLoggingOut}>
              📊 Relatórios
            </ActionButton>
          </ActionGrid>
          <ActionNote>
            {isLoggingOut ? '🔄 Fazendo logout... Aguarde um momento.' : '* Funcionalidades em desenvolvimento'}
          </ActionNote>
        </QuickActions>
      </Content>
    </DashboardContainer>
  );
}


