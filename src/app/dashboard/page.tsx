"use client";

import { useAuth } from '@/context/auth';
import { useMetadata } from '@/hooks/useMetadata';
import { useDashboard } from '@/hooks/useApi';
import { Badge } from '@/components/atoms';
import { PerfilUsuario } from '@/utils/enums';
import CountUp from 'react-countup';
import { useRouter } from 'next/navigation';
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
  const { user } = useAuth();
  const { data: dashboardData } = useDashboard();
  const router = useRouter();

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

  // Verificar permissões do usuário
  const isGestao = user?.perfil === PerfilUsuario.GESTAO;

  /**
   * Navega para o path especificado
   * @param path - Caminho para navegação
   */
  const handleNavigate = (path: string) => {
    router.push(path);
  };

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

        <QuickActions>
          <ActionTitle>🚀 Ações Rápidas</ActionTitle>
          <ActionGrid>
            {/* Novo Chamado - Todos os perfis podem criar */}
            {/* <ActionButton onClick={() => handleNavigate('/dashboard/chamados')}>
              📋 Novo Chamado
            </ActionButton> */}
            
            {/* Gestão de Usuários - Apenas GESTAO */}
            {isGestao && (
              <ActionButton onClick={() => handleNavigate('/dashboard/usuarios')}>
                👥 Gerenciar Usuários
              </ActionButton>
            )}
            
            {/* Equipamentos - GESTAO e AGENTE */}
            {/* {(isGestao || isAgente) && (
              <ActionButton onClick={() => handleNavigate('/dashboard/equipamentos')}>
                🔧 Equipamentos
              </ActionButton>
            )} */}
            
            {/* Meu Perfil - Todos os perfis */}
            <ActionButton onClick={() => handleNavigate('/dashboard/profile')}>
              👤 Meu Perfil
            </ActionButton>
            
            {/* Relatórios - GESTAO e AGENTE */}
            {/* {(isGestao || isAgente) && (
              <ActionButton onClick={() => handleNavigate('/dashboard/relatorios')}>
                📊 Relatórios
              </ActionButton>
            )} */}
          </ActionGrid>
          <ActionNote>
            * Funcionalidades em desenvolvimento
          </ActionNote>
        </QuickActions>
      </Content>
    </DashboardContainer>
  );
}


