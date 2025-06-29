"use client";

import React from 'react';
import styled from 'styled-components';
import { useAuth } from '@/context/auth';
import { useMetadata } from '@/hooks/useMetadata';

/**
 * Página principal do dashboard após login
 * Exibe informações do usuário logado e opções de navegação
 */
export default function Dashboard() {
  const { user, logout, isLoggingOut } = useAuth();

  useMetadata({
    title: `Nextar - Dashboard`,
    ogTitle: `Nextar - Dashboard`
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>🐧 Dashboard - Sistema NextAR</Title>
        <UserInfo>
          {!isLoggingOut && user && (
            <>
              <UserGreeting>
                Olá, <strong>{user.nome}</strong>!
              </UserGreeting>
              <UserProfile>
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
          <WelcomeTitle>Bem-vindo ao Sistema de Manutenção da Antártica</WelcomeTitle>
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

/**
 * Styled Components para o Dashboard
 */
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const Header = styled.header`
  background: white;
  padding: 20px 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e293b;
  margin: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserGreeting = styled.span`
  color: #475569;
  font-size: 0.9rem;
`;

const UserProfile = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
  }
`;

const Content = styled.main`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.section`
  text-align: center;
  margin-bottom: 40px;
`;

const WelcomeTitle = styled.h2`
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 16px;
`;

const WelcomeText = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatTitle = styled.h3`
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 8px 0;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;
`;

const QuickActions = styled.section`
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ActionTitle = styled.h3`
  font-size: 1.25rem;
  color: #1e293b;
  margin: 0 0 24px 0;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #94a3b8;
  }
`;

const ActionNote = styled.p`
  font-size: 0.875rem;
  color: #94a3b8;
  text-align: center;
  margin: 0;
  font-style: italic;
`;
