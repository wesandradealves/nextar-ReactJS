'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useCache } from '@/context/cache';

const DebugContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 16px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  max-width: 300px;
  z-index: 9999;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const DebugHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #333;
`;

const DebugTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  color: #00ff00;
`;

const ToggleButton = styled.button`
  background: #333;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  
  &:hover {
    background: #555;
  }
`;

const ClearButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  margin-left: 8px;
  
  &:hover {
    background: #ff6666;
  }
`;

const DebugContent = styled.div<{ $collapsed: boolean }>`
  display: ${props => props.$collapsed ? 'none' : 'block'};
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const StatLabel = styled.span`
  color: #aaa;
`;

const StatValue = styled.span`
  color: #00ff00;
  font-weight: bold;
`;

interface CacheDebugProps {
  enabled?: boolean;
}

export const CacheDebug: React.FC<CacheDebugProps> = ({ 
  enabled = process.env.NODE_ENV === 'development' 
}) => {
  const cache = useCache();
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState({ size: 0, hits: 0, misses: 0 });

  useEffect(() => {
    if (!enabled) return;

    const updateStats = () => {
      setStats(cache.getStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);

    return () => clearInterval(interval);
  }, [cache, enabled]);

  if (!enabled) return null;

  const hitRate = stats.hits + stats.misses > 0 
    ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1)
    : '0.0';

  return (
    <DebugContainer>
      <DebugHeader>
        <DebugTitle>Cache Debug</DebugTitle>
        <div>
          <ToggleButton onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '▼' : '▲'}
          </ToggleButton>
          <ClearButton onClick={() => cache.clear()}>
            Clear
          </ClearButton>
        </div>
      </DebugHeader>
      
      <DebugContent $collapsed={collapsed}>
        <StatRow>
          <StatLabel>Entries:</StatLabel>
          <StatValue>{stats.size}</StatValue>
        </StatRow>
        
        <StatRow>
          <StatLabel>Hits:</StatLabel>
          <StatValue>{stats.hits}</StatValue>
        </StatRow>
        
        <StatRow>
          <StatLabel>Misses:</StatLabel>
          <StatValue>{stats.misses}</StatValue>
        </StatRow>
        
        <StatRow>
          <StatLabel>Hit Rate:</StatLabel>
          <StatValue>{hitRate}%</StatValue>
        </StatRow>
      </DebugContent>
    </DebugContainer>
  );
};
