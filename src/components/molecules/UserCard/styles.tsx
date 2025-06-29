import styled from 'styled-components';
import { Badge } from '@/components/atoms';

interface UserCardContainerProps {
  $size: 'small' | 'medium' | 'large';
  $clickable: boolean;
}

export const UserCardContainer = styled.div<UserCardContainerProps>`
  display: flex;
  align-items: center;
  gap: ${props => {
    switch (props.$size) {
      case 'small': return '8px';
      case 'medium': return '12px';
      case 'large': return '16px';
      default: return '12px';
    }
  }};
  padding: ${props => {
    switch (props.$size) {
      case 'small': return '8px';
      case 'medium': return '12px';
      case 'large': return '16px';
      default: return '12px';
    }
  }};
  border-radius: 8px;
  transition: all 0.2s ease;
  background: white;
  border: 1px solid #e5e7eb;
  
  ${props => props.$clickable && `
    cursor: pointer;
    
    &:hover {
      border-color: #667eea;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`;

interface AvatarProps {
  $size: 'small' | 'medium' | 'large';
}

export const Avatar = styled.div<AvatarProps>`
  position: relative;
  width: ${props => {
    switch (props.$size) {
      case 'small': return '32px';
      case 'medium': return '40px';
      case 'large': return '48px';
      default: return '40px';
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case 'small': return '32px';
      case 'medium': return '40px';
      case 'large': return '48px';
      default: return '40px';
    }
  }};
  border-radius: 50%;
  overflow: hidden;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '0.75rem';
      case 'medium': return '0.875rem';
      case 'large': return '1rem';
      default: return '0.875rem';
    }
  }};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const OnlineIndicator = styled.div<{ $size: 'small' | 'medium' | 'large' }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${props => {
    switch (props.$size) {
      case 'small': return '8px';
      case 'medium': return '10px';
      case 'large': return '12px';
      default: return '10px';
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case 'small': return '8px';
      case 'medium': return '10px';
      case 'large': return '12px';
      default: return '10px';
    }
  }};
  border-radius: 50%;
  background: #10b981;
  border: 2px solid white;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0; /* Para permitir truncate */
`;

export const UserName = styled.div<{ $size: 'small' | 'medium' | 'large' }>`
  font-weight: 600;
  color: #374151;
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '0.875rem';
      case 'medium': return '1rem';
      case 'large': return '1.125rem';
      default: return '1rem';
    }
  }};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserEmail = styled.div<{ $size: 'small' | 'medium' | 'large' }>`
  color: #6b7280;
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '0.75rem';
      case 'medium': return '0.875rem';
      case 'large': return '0.875rem';
      default: return '0.875rem';
    }
  }};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProfileBadge = styled(Badge)<{ $size: 'small' | 'medium' | 'large' }>`
  ${props => {
    switch (props.$size) {
      case 'small':
        return `
          font-size: 0.75rem;
          padding: 2px 6px;
        `;
      case 'large':
        return `
          font-size: 0.875rem;
          padding: 4px 8px;
        `;
      default:
        return '';
    }
  }}
`;
