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
  StatCard,
  StatTitle,
  StatValue,
  StatLabel,
  // QuickActions,
  // ActionTitle,
  // ActionGrid,
  // ActionButton,
  // ActionNote
  
  // Novos componentes styled
  PageTitle,
  PageDescription,
  SectionContainer,
  GridContainer,
  ChartContainer,
  ChartTitle
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
    <DashboardContainer className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Content className="container mx-auto px-4 py-8 max-w-7xl">
        <SectionContainer className="text-center mb-10">
          <PageTitle className="text-blue-800 dark:text-blue-300 text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            Bem-vindo ao Sistema de Manutenção da Antártica
          </PageTitle>
          <PageDescription className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Sistema integrado para gestão de equipamentos, chamados e recursos humanos
            em ambiente científico extremo.
          </PageDescription>
        </SectionContainer>

        <GridContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
            <StatTitle className="text-blue-700 dark:text-blue-300">🔧 Chamados</StatTitle>
            <StatValue className="text-gray-800 dark:text-white">
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

          <StatCard className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
            <StatTitle className="text-green-700 dark:text-green-300">⚙️ Equipamentos</StatTitle>
            <StatValue className="text-gray-800 dark:text-white">
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

          <StatCard className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
            <StatTitle className="text-purple-700 dark:text-purple-300">👥 Usuários</StatTitle>
            <StatValue className="text-gray-800 dark:text-white">
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

          <StatCard className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
            <StatTitle className="text-indigo-700 dark:text-indigo-300">✅ Resolvidos</StatTitle>
            <StatValue className="text-gray-800 dark:text-white">
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
        </GridContainer>

        {/* Gráficos do Dashboard */}
        {(isGestao || distribucaoAgente.length > 0) && (
          <ChartContainer className="mt-8 p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <ChartTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">📊 Análise de Dados</ChartTitle>
            <DashboardCharts 
              distribucaoTipo={distribucaoTipo}
              distribucaoAgente={distribucaoAgente}
            />
          </ChartContainer>
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


