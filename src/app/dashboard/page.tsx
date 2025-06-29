"use client";

import { useAuth } from '@/context/auth';
import { useMetadata } from '@/hooks/useMetadata';
import { useDashboard } from '@/hooks/useApi';
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
  const { data: dashboardData, loading: dashboardLoading } = useDashboard();

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

  // Use cached dashboard data or fallback to static data
  const stats = dashboardData?.stats || {
    totalEquipamentos: 156,
    chamadosAbertos: 23,
    chamadosResolvidos: 89,
    usuariosAtivos: 42
  };

  return (
    <DashboardContainer>
      {shouldShowHeader && (
        <HeaderComponent
          userName={headerUserName}
          userEmail={headerUserEmail}
          userProfile={headerUserProfile}
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
            <StatValue>{dashboardLoading ? '...' : stats.chamadosAbertos}</StatValue>
            <StatLabel>
              <Badge variant="primary" size="small">Abertos</Badge>
            </StatLabel>
          </StatCard>

          <StatCard>
            <StatTitle>⚙️ Equipamentos</StatTitle>
            <StatValue>{dashboardLoading ? '...' : stats.totalEquipamentos}</StatValue>
            <StatLabel>
              <Badge variant="success" size="small">Total</Badge>
            </StatLabel>
          </StatCard>

          <StatCard>
            <StatTitle>👥 Usuários</StatTitle>
            <StatValue>{dashboardLoading ? '...' : stats.usuariosAtivos}</StatValue>
            <StatLabel>
              <Badge variant="success" size="small">Ativos</Badge>
            </StatLabel>
          </StatCard>

          <StatCard>
            <StatTitle>✅ Resolvidos</StatTitle>
            <StatValue>{dashboardLoading ? '...' : stats.chamadosResolvidos}</StatValue>
            <StatLabel>
              <Badge variant="primary" size="small">Este mês</Badge>
            </StatLabel>
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


