import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchBox } from './index';

const meta: Meta<typeof SearchBox> = {
  title: 'Molecules/SearchBox',
  component: SearchBox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente molecular SearchBox que combina Input + Button + Icons para busca.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Se o componente está desabilitado',
    },
    loading: {
      control: 'boolean',
      description: 'Se está em estado de carregamento',
    },
    onSearch: {
      action: 'searched',
      description: 'Função executada ao buscar',
    },
    onClear: {
      action: 'cleared',
      description: 'Função executada ao limpar',
    },
    onChange: {
      action: 'changed',
      description: 'Função executada ao alterar valor',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Buscar...',
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Buscar equipamentos, chamados, usuários...',
  },
};

export const Loading: Story = {
  args: {
    placeholder: 'Buscando...',
    loading: true,
    value: 'termo de busca',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Busca desabilitada',
    disabled: true,
    value: 'busca bloqueada',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Buscar...',
    value: 'equipamento servidor',
  },
};

export const SearchExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '400px' }}>
      <div>
        <h4 style={{ marginBottom: '8px', color: '#374151' }}>Busca de Equipamentos</h4>
        <SearchBox
          placeholder="Buscar por nome, modelo, setor..."
          onSearch={(value) => console.log('Buscando equipamentos:', value)}
        />
      </div>
      
      <div>
        <h4 style={{ marginBottom: '8px', color: '#374151' }}>Busca de Chamados</h4>
        <SearchBox
          placeholder="Buscar por título, descrição, status..."
          onSearch={(value) => console.log('Buscando chamados:', value)}
        />
      </div>
      
      <div>
        <h4 style={{ marginBottom: '8px', color: '#374151' }}>Busca de Usuários</h4>
        <SearchBox
          placeholder="Buscar por nome, email, setor..."
          onSearch={(value) => console.log('Buscando usuários:', value)}
        />
      </div>
    </div>
  ),
};

export const InteractiveExample: Story = {
  render: function InteractiveExample() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [results, setResults] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    
    const mockResults = [
      'Servidor Dell PowerEdge',
      'Switch Cisco Catalyst',
      'Impressora HP LaserJet',
      'Notebook Lenovo ThinkPad',
      'Monitor Samsung 27"',
      'Roteador TP-Link',
    ];
    
    const handleSearch = async (value: string) => {
      setLoading(true);
      
      // Simula busca assíncrona
      setTimeout(() => {
        const filtered = mockResults.filter(item =>
          item.toLowerCase().includes(value.toLowerCase())
        );
        setResults(filtered);
        setLoading(false);
      }, 1000);
    };
    
    const handleClear = () => {
      setResults([]);
    };
    
    return (
      <div style={{ width: '400px' }}>
        <SearchBox
          value={searchTerm}
          placeholder="Buscar equipamentos..."
          loading={loading}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          onClear={handleClear}
        />
        
        {results.length > 0 && (
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            backgroundColor: '#f9fafb'
          }}>
            <strong>Resultados ({results.length}):</strong>
            <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
              {results.map((result, index) => (
                <li key={index} style={{ marginBottom: '4px' }}>
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {searchTerm && results.length === 0 && !loading && (
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            color: '#6b7280',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            Nenhum resultado encontrado para &quot;{searchTerm}&quot;
          </div>
        )}
      </div>
    );
  },
};
