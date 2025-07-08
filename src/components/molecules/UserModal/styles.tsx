import styled from 'styled-components';

export const PasswordToggleContainer = styled.div<{ $visible: boolean }>`
  max-height: ${({ $visible }) => $visible ? '200px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, margin 0.3s ease-in-out;
  opacity: ${({ $visible }) => $visible ? '1' : '0'};
  margin-top: ${({ $visible }) => $visible ? '16px' : '0'};
`;

export const ValidationMessage = styled.div<{ $type: 'error' | 'success' | 'warning' | 'info' }>`
  color: ${({ $type }) => {
    switch ($type) {
      case 'error': return '#ef4444';
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
`;

export const ToggleSwitch = styled.label`
  display: inline-block;
  position: relative;
  cursor: pointer;
`;

export const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

export const ToggleSlider = styled.span<{ $checked: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 9999px;
  transition: all 0.2s ease-in-out;
  
  &:before {
    content: '';
    position: absolute;
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.2s ease-in-out;
    transform: ${({ $checked }) => $checked ? 'translateX(20px)' : 'translateX(0)'};
  }
`;
