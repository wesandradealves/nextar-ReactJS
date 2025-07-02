"use client";

import { useAuth } from '@/context/auth';
import { useMetadata } from '@/hooks/useMetadata';
import { useDashboard } from '@/hooks/useApi';
import { Badge } from '@/components/atoms';
import { DashboardCharts } from '@/components/molecules';
import { PerfilUsuario } from '@/utils/enums';
import CountUp from 'react-countup';
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
  // QuickActions,
  // ActionTitle,
  // ActionGrid,
  // ActionButton,
  // ActionNote
} from './styles';

/**
 * Página principal do dashboard após login
 * Exibe informações do usuário logado e opções de navegação
 */
export default function Dashboard() {
  const { user } = useAuth();
  const { data: dashboardData } = useDashboard();

  useMetadata({
    title: `Nextar - Dashboard - Olá, ${user?.nome ?? 'Usuário'}`,
    ogTitle: `Nextar - Dashboard - Olá, ${user?.nome ?? 'Usuário'}`
  });

  // Use cached dashboard data or fallback to static data
  const stats = dashboardData?.stats || {
    totalEquipamentos: 0,
    chamadosAbertos: 0,
    chamadosResolvidos: 0,
    usuariosAtivos: 0
  };

  // Dados para os gráficos
  const distribucaoTipo = dashboardData?.distribucaoTipo || {
    1: 0, // TipoManutencao.CORRETIVA
    2: 0  // TipoManutencao.PREVENTIVA
  };

  const distribucaoAgente = dashboardData?.distribucaoAgente || [];

  // Verificar permissões do usuário
  const isGestao = user?.perfil === PerfilUsuario.GESTAO;

  return (
    <DashboardContainer>
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
            <StatValue>
              <CountUp
                end={stats.chamadosAbertos}
                duration={1.2}
                separator="."
              />
            </StatValue>
            <StatLabel>
              <Badge variant="primary" size="small">Abertos</Badge>
            </StatLabel>
          </StatCard>

          <StatCard>
            <StatTitle>⚙️ Equipamentos</StatTitle>
            <StatValue>
              <CountUp
                end={stats.totalEquipamentos}
                duration={1.5}
                separator="."
              />
            </StatValue>
            <StatLabel>
              <Badge variant="success" size="small">Total</Badge>
            </StatLabel>
          </StatCard>

          <StatCard>
            <StatTitle>👥 Usuários</StatTitle>
            <StatValue>
              <CountUp
                end={stats.usuariosAtivos}
                duration={1.0}
                separator="."
              />
            </StatValue>
            <StatLabel>
              <Badge variant="success" size="small">Ativos</Badge>
            </StatLabel>
          </StatCard>

          <StatCard>
            <StatTitle>✅ Resolvidos</StatTitle>
            <StatValue>
              <CountUp
                end={stats.chamadosResolvidos}
                duration={1.8}
                separator="."
              />
            </StatValue>
            <StatLabel>
              <Badge variant="primary" size="small">Este mês</Badge>
            </StatLabel>
          </StatCard>
        </StatsGrid>

        {/* Gráficos do Dashboard */}
        {(isGestao || distribucaoAgente.length > 0) && (
          <DashboardCharts 
            distribucaoTipo={distribucaoTipo}
            distribucaoAgente={distribucaoAgente}
          />
        )}

        {/* <QuickActions>
          <ActionTitle>🚀 Ações Rápidas</ActionTitle>
          <ActionGrid>
            <ActionButton onClick={() => handleNavigate('/dashboard/chamados')}>
              📋 Ver Chamados
            </ActionButton>
            
            {canCreateChamados && (
              <></>
            )}
            
            {isGestao && (
              <ActionButton onClick={() => handleNavigate('/dashboard/usuarios')}>
                👥 Gerenciar Usuários
              </ActionButton>
            )}
            
            <ActionButton onClick={() => handleNavigate('/dashboard/profile')}>
              👤 Meu Perfil
            </ActionButton>
          </ActionGrid>
          <ActionNote>
            * Algumas funcionalidades ainda em desenvolvimento
          </ActionNote>
        </QuickActions> */}
      </Content>
    </DashboardContainer>
  );
}


