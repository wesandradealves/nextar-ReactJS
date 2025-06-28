import React from 'react';
import { useLoader } from '@/context/spinner';
import { useTheme } from 'styled-components';
const Spinner: React.FC = () => {
  const { isLoading } = useLoader();
  const theme = useTheme();

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          border: '5px solid rgba(255,255,255,.1)',
          borderTop: `5px solid ${theme._colors.primary.bdm3}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Spinner;