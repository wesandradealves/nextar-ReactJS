import React from 'react';
import { ToggleSwitchContainer, ToggleSwitchInput, ToggleSwitchSlider } from './styles';

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  'data-testid'?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'medium',
  className = '',
  'data-testid': testId
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(event.target.checked);
    }
  };

  return (
    <ToggleSwitchContainer 
      className={`${className}`}
      $size={size}
      data-testid={testId}
    >
      <ToggleSwitchInput
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <ToggleSwitchSlider 
        $checked={checked}
        $disabled={disabled}
        $size={size}
      />
    </ToggleSwitchContainer>
  );
};

export default ToggleSwitch;