'use client';

import { useEffect, useState } from 'react';

interface CounterProps {
  value: number;
  duration?: number;
  loading?: boolean;
}

export const Counter: React.FC<CounterProps> = ({ 
  value, 
  duration = 1500,
  loading = false 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (loading) return;
    
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function para suavizar a animação
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration, loading]);

  if (loading) {
    return <>...</>;
  }

  return <>{count}</>;
};
