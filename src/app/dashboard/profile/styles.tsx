import styled from 'styled-components';

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1.5rem;
  }
`;

export const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

export const ProfileTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const ProfileDescription = styled.p`
  font-size: 1rem;
  color: #718096;
  margin: 0;
  line-height: 1.5;
`;

export const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #68d391 0%, #38a169 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ProfileInfo = styled.div`
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ProfileInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
`;

export const ProfileInfoLabel = styled.span`
  font-weight: 600;
  color: #4a5568;
  font-size: 0.875rem;
`;

export const ProfileInfoValue = styled.span`
  color: #2d3748;
  font-size: 0.875rem;
  text-transform: capitalize;
  
  @media (max-width: 480px) {
    font-weight: 500;
  }
`;
