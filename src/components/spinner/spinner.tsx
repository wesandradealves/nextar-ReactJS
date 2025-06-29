import React from 'react';
import { useLoader } from '@/context/spinner';
import { SpinnerOverlay, SpinnerWheel } from './style';

const Spinner: React.FC = () => {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <SpinnerOverlay>
      <SpinnerWheel />
    </SpinnerOverlay>
  );
};

export default Spinner;