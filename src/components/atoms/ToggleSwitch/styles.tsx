import styled from 'styled-components';

export const ToggleSwitchContainer = styled.label<{ $size: 'small' | 'medium' | 'large' }>`
  position: relative;
  display: inline-block;
  cursor: pointer;
  
  ${props => {
    switch (props.$size) {
      case 'small':
        return `
          width: 3rem;
          height: 1.5rem;
        `;
      case 'large':
        return `
          width: 4rem;
          height: 2rem;
        `;
      default: // medium
        return `
          width: 3.5rem;
          height: 1.75rem;
        `;
    }
  }}
`;

export const ToggleSwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;

export const ToggleSwitchSlider = styled.span<{ 
  $checked: boolean; 
  $disabled: boolean;
  $size: 'small' | 'medium' | 'large';
}>`
  position: absolute;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 9999px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  ${props => {
    if (props.$disabled) {
      return `
        background: linear-gradient(to right, #e5e7eb, #d1d5db);
        opacity: 0.6;
      `;
    }
    
    if (props.$checked) {
      return `
        background: linear-gradient(to right, #10b981, #059669);
      `;
    } else {
      return `
        background: linear-gradient(to right, #ef4444, #dc2626);
      `;
    }
  }}
  
  &:before {
    content: "";
    position: absolute;
    border-radius: 50%;
    background: white;
    transition: transform 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    ${props => {
      const translateX = props.$checked ? 
        (props.$size === 'small' ? '1.5rem' : 
         props.$size === 'large' ? '2rem' : '1.75rem') : '0';
      
      switch (props.$size) {
        case 'small':
          return `
            height: 1.25rem;
            width: 1.25rem;
            left: 0.125rem;
            bottom: 0.125rem;
            transform: translateX(${translateX});
          `;
        case 'large':
          return `
            height: 1.75rem;
            width: 1.75rem;
            left: 0.125rem;
            bottom: 0.125rem;
            transform: translateX(${translateX});
          `;
        default: // medium
          return `
            height: 1.5rem;
            width: 1.5rem;
            left: 0.125rem;
            bottom: 0.125rem;
            transform: translateX(${translateX});
          `;
      }
    }}
  }
  
  &:hover {
    ${props => !props.$disabled && `
      transform: scale(1.05);
    `}
  }
  
  &:active {
    ${props => !props.$disabled && `
      transform: scale(0.95);
    `}
  }
`;