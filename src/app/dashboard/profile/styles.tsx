import styled from 'styled-components';

export const ProfileContainer = styled.div``;
export const ProfileHeader = styled.div``;
export const ProfileTitle = styled.h1``;
export const ProfileDescription = styled.p``;
export const ProfileContent = styled.div``;
export const SuccessMessage = styled.div`
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
export const ProfileInfo = styled.div``;
export const ProfileInfoItem = styled.div``;
export const ProfileInfoLabel = styled.span`
  color: #4a5568;
`;
export const ProfileInfoValue = styled.span`
  color: #2d3748;
`;
export const ProfileActions = styled.div``;
export const ProfileSection = styled.div``;
export const SectionTitle = styled.h2`
  color: #2d3748;
`;
export const SectionDescription = styled.p`
  color: #718096;
`;
export const FormGroup = styled.div``;
export const FormLabel = styled.label``;
export const ErrorMessage = styled.div`
  color: #ef4444;
`;
