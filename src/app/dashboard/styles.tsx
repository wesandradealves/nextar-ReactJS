/**
 * Styled Components para a página do dashboard
 */

import styled from 'styled-components';

export const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

export const Header = styled.header`
  background: white;
  padding: 20px 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e293b;
  margin: 0;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const UserGreeting = styled.span`
  color: #475569;
  font-size: 0.9rem;
`;

export const UserProfile = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
`;

export const LogoutButton = styled.button`
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

export const Content = styled.main`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const WelcomeSection = styled.section`
  text-align: center;
  margin-bottom: 40px;
`;

export const WelcomeTitle = styled.h2`
  color: #1e293b;
  margin-bottom: 16px;
`;

export const WelcomeText = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

export const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const StatTitle = styled.h3`
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 8px 0;
`;

export const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;
`;

export const QuickActions = styled.section`
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ActionTitle = styled.h3`
  font-size: 1.25rem;
  color: #1e293b;
  margin: 0 0 24px 0;
`;

export const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

export const ActionButton = styled.button`
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

export const ActionNote = styled.p`
  font-size: 0.875rem;
  color: #94a3b8;
  text-align: center;
  margin: 0;
  font-style: italic;
`;

// Novos componentes styled para substituir tags HTML cruas
export const PageTitle = styled.h2``;
export const PageDescription = styled.p``;
export const SectionContainer = styled.div``;
export const GridContainer = styled.div``;
export const ChartContainer = styled.div``;
export const ChartTitle = styled.h3``;