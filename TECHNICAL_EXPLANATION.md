# Explicação Técnica - Sistema de Manutenção da Antártica

Este documento apresenta as principais decisões técnicas adotadas no desenvolvimento do sistema de manutenção para a base de pesquisa na Antártica, destacando a arquitetura, padrões de design, gerenciamento de estado e outras escolhas tecnológicas relevantes.

## 1. Arquitetura do Projeto

### 1.1 Estrutura de Pastas

Optamos por uma estrutura organizada por responsabilidade, facilitando a manutenção e escalabilidade:

```
nextar/
├── public/              # Recursos estáticos e dados mockados
│   └── api/resources/   # JSONs para simulação do backend
├── src/
│   ├── app/             # App Router do Next.js (páginas da aplicação)
│   ├── assets/          # Recursos como SCSS, imagens
│   ├── components/      # Componentes React (Atomic Design)
│   ├── context/         # Contextos globais React
│   ├── hooks/           # Custom hooks para lógica reutilizável
│   ├── pages/api/       # API Routes do Next.js (backend simulado)
│   ├── services/        # Serviços e interações com API
│   ├── types/           # Definições TypeScript
│   └── utils/           # Utilitários, enums e helpers
└── middleware.ts        # Middleware Next.js (autenticação)
```

### 1.2 Next.js App Router

Utilizamos o App Router do Next.js 15 para:
- **Roteamento baseado em sistema de arquivos**
- **Componentes de layout** para reutilização de UI entre rotas
- **Server Components e Client Components** para otimização de performance
- **API Routes** para simulação de backend

### 1.3 Camada de API Simulada

Implementamos uma API simulada usando Next.js API Routes e dados JSON mockados:

```typescript
// pages/api/users.ts
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = getUsersData(); // Carrega do JSON
    
    // Implementação de lógica de filtragem, paginação, etc.
    const filtered = applyFilters(users, req.query);
    const paginated = applyPagination(filtered, req.query);
    
    res.status(200).json({
      data: paginated,
      pagination: { ... }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao carregar usuários' });
  }
}
```

### 1.4 Integração Frontend-Backend

Implementamos uma camada de serviços que isola a lógica de comunicação com a API:

```typescript
// services/api.ts - Configuração Axios
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// services/resources.ts - Métodos específicos por recurso
export const getUsers = async (filters?: UserFilters) => {
  const response = await api.get('/users', { params: filters });
  return response.data;
};
```

## 2. Design Patterns Aplicados

### 2.1 Provider Pattern

Implementamos o padrão Provider através de contextos React para disponibilizar estado global e funcionalidades a toda a aplicação:

```
AuthProvider (autenticação)
├── EntitiesProvider (dados CRUD)
│   ├── LoaderProvider (spinner global)
│   └── CacheProvider (cache multicamadas)
```

Exemplo de implementação:

```tsx
// context/auth.tsx
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Métodos de autenticação
  const login = async (email: string, password: string) => { /* ... */ };
  const logout = () => { /* ... */ };
  
  // Verificação de autenticação ao iniciar
  useEffect(() => { /* ... */ }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2.2 Custom Hook Pattern

Criamos hooks especializados para encapsular lógica de negócio e reutilizá-la em componentes:

```typescript
// hooks/useUsuarios.ts
export const useUsuarios = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({});
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const cache = useCache();

  // Carregamento inicial com cache
  useEffect(() => { /* ... */ }, []);

  // Métodos CRUD
  const createUser = async (userData: CreateUserData) => { /* ... */ };
  const updateUser = async (id: string, userData: UpdateUserData) => { /* ... */ };
  const deleteUser = async (id: string) => { /* ... */ };

  return {
    data,
    loading,
    filters,
    pagination,
    setFilters,
    setPagination,
    createUser,
    updateUser,
    deleteUser
  };
};
```

### 2.3 Atomic Design Pattern

Estruturamos os componentes seguindo o Atomic Design:

1. **Atoms**: Componentes básicos indivisíveis (Button, Input, Badge)
2. **Molecules**: Combinação de atoms (FormField, SearchBox, UserCard)
3. **Organisms**: Seções da interface (Header, DataTable)
4. **Templates**: Layout de páginas
5. **Pages**: Implementações específicas

```typescript
// components/atoms/Button/index.tsx
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  onClick,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? <Spinner size="small" /> : children}
    </StyledButton>
  );
};
```

### 2.4 Factory Pattern

Utilizamos o padrão Factory para criar componentes dinâmicos baseados em configuração:

```typescript
// components/molecules/FormContainer/index.tsx
export const FormContainer: React.FC<FormContainerProps> = ({
  fields,
  values,
  onChange,
  onSubmit,
  ...props
}) => {
  // Factory de campos baseado na configuração
  const renderField = (field: FormFieldConfig) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <Input
            type={field.type}
            id={field.id}
            name={field.id}
            value={values[field.id] || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
          />
        );
      case 'select':
        return (
          <Select
            id={field.id}
            name={field.id}
            value={values[field.id] || ''}
            onChange={handleChange}
            required={field.required}
            disabled={field.disabled}
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      // Outros tipos de campos...
    }
  };

  return (
    <Form onSubmit={handleFormSubmit} {...props}>
      {fields.map(field => (
        <FormField
          key={field.id}
          label={field.label}
          error={field.error}
          helpText={field.helpText}
        >
          {renderField(field)}
        </FormField>
      ))}
      {/* ... */}
    </Form>
  );
};
```

### 2.5 Strategy Pattern

Aplicamos o padrão Strategy para comportamentos variáveis como validação:

```typescript
// Estratégias de validação
const validationStrategies = {
  required: (value: any) => !!value || 'Campo obrigatório',
  email: (value: string) => 
    /\S+@\S+\.\S+/.test(value) || 'Email inválido',
  minLength: (value: string, min: number) => 
    value.length >= min || `Mínimo de ${min} caracteres`,
  password: (value: string) => 
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value) || 
    'Senha deve ter 8+ caracteres, letras e números'
};

// Uso da estratégia
const validate = (value: any, rules: ValidationRule[]) => {
  for (const rule of rules) {
    const strategy = validationStrategies[rule.type];
    const result = strategy(value, rule.param);
    if (result !== true) return result;
  }
  return true;
};
```

## 3. Gerenciamento de Estado

### 3.1 Múltiplas Camadas de Estado

Implementamos um sistema de gerenciamento de estado em múltiplas camadas:

1. **Estado Local**: `useState()` para estado isolado de componentes
2. **Estado Compartilhado**: Contextos React para estado global
3. **Estado Persistente**: LocalStorage/Cookies para persistência entre sessões
4. **Estado do Servidor**: Dados da API com cache inteligente

### 3.2 Sistema de Cache Multicamadas

Implementamos um cache sofisticado para otimização de performance:

```typescript
// context/cache.tsx
export const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const CacheProvider: React.FC<CacheProviderProps> = ({ 
  children, 
  defaultTTL = 300000 // 5 minutos 
}) => {
  const [cache, setCache] = useState<Record<string, CacheEntry<any>>>({});
  const [stats, setStats] = useState({ hits: 0, misses: 0 });
  
  // Limpeza automática de entradas expiradas
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newCache = { ...cache };
      let changed = false;
      
      Object.entries(newCache).forEach(([key, entry]) => {
        if (now - entry.timestamp > entry.ttl) {
          delete newCache[key];
          changed = true;
        }
      });
      
      if (changed) setCache(newCache);
    }, 60000); // Verifica a cada minuto
    
    return () => clearInterval(interval);
  }, [cache]);

  // Métodos de cache
  const get = <T,>(key: string): T | null => { /* ... */ };
  const set = <T,>(key: string, data: T, ttl = defaultTTL, tags: string[] = []) => { /* ... */ };
  const remove = (key: string) => { /* ... */ };
  const invalidateByTag = (tag: string) => { /* ... */ };
  const clear = () => { /* ... */ };

  return (
    <CacheContext.Provider 
      value={{ 
        get, 
        set, 
        remove, 
        invalidateByTag, 
        clear, 
        stats,
        size: Object.keys(cache).length
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};
```

### 3.3 Integração Cache-API

Implementamos hooks que integram automaticamente o cache com chamadas de API:

```typescript
// hooks/useApi.ts
export const useApi = <T,>(
  fetcher: () => Promise<T>,
  options: ApiOptions = {}
) => {
  const { 
    cacheKey, 
    ttl = 300000, // 5 minutos 
    tags = [],
    enabled = true
  } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cache = useCache();

  const fetchData = useCallback(async (force = false) => {
    // Verifica cache primeiro
    if (cacheKey && !force) {
      const cached = cache.get<T>(cacheKey);
      if (cached) {
        setData(cached);
        return cached;
      }
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await fetcher();
      setData(result);
      
      // Armazena no cache
      if (cacheKey) {
        cache.set(cacheKey, result, ttl, tags);
      }
      
      return result;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetcher, cacheKey, ttl, tags, cache]);

  // Fetch inicial
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  return { data, loading, error, refetch: fetchData, clearCache: () => cacheKey && cache.remove(cacheKey) };
};
```

## 4. Outras Decisões Técnicas

### 4.1 Estilização com Styled Components

Escolhemos styled-components pela facilidade de criação de componentes reutilizáveis com estilos encapsulados:

```typescript
// components/atoms/Button/styles.tsx
export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => 
    props.$size === 'small' ? '0.5rem 1rem' : 
    props.$size === 'large' ? '0.75rem 1.5rem' : 
    '0.625rem 1.25rem'
  };
  font-size: ${(props) => 
    props.$size === 'small' ? '0.875rem' : 
    props.$size === 'large' ? '1.125rem' : 
    '1rem'
  };
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${(props) => props.disabled ? 0.6 : 1};
  
  /* Variantes */
  ${(props) => {
    switch (props.$variant) {
      case 'primary':
        return css`
          background-color: #3b82f6;
          color: white;
          border: none;
          &:hover:not(:disabled) {
            background-color: #2563eb;
          }
        `;
      case 'secondary':
        return css`
          background-color: #6b7280;
          color: white;
          border: none;
          &:hover:not(:disabled) {
            background-color: #4b5563;
          }
        `;
      // Outras variantes...
    }
  }}
`;
```

### 4.2 Middleware de Autenticação

Implementamos um middleware Next.js para proteção de rotas:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Verifica autenticação nos cookies
  const authCookie = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!authCookie;
  
  // Rotas públicas
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Redireciona baseado em autenticação
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Verifica permissões baseadas no perfil
  if (isAuthenticated && pathname.startsWith('/dashboard/admin')) {
    const user = parseJwt(authCookie);
    if (user.perfil !== 'gestao') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}
```

### 4.3 Simulação de Backend com JSONs

Optamos por simular o backend usando JSONs para facilitar o desenvolvimento sem dependências externas:

```typescript
// utils/storage.ts
export const getUsersData = (): User[] => {
  try {
    const usersJson = fs.readFileSync(path.join(process.cwd(), 'public/api/resources/users.json'), 'utf8');
    return JSON.parse(usersJson);
  } catch (error) {
    console.error('Erro ao carregar users.json:', error);
    return [];
  }
};

export const saveUsersData = (users: User[]): void => {
  try {
    fs.writeFileSync(
      path.join(process.cwd(), 'public/api/resources/users.json'),
      JSON.stringify(users, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error('Erro ao salvar users.json:', error);
  }
};
```

### 4.4 Documentação com Storybook

Implementamos Storybook para documentação viva dos componentes:

```typescript
// components/atoms/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';

const meta: Meta<typeof Button> = {
  title: 'Components/Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente de botão reutilizável com variantes e estados.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger'],
      description: 'Estilo visual do botão'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do botão'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carregamento'
    },
    disabled: {
      control: 'boolean',
      description: 'Estado desabilitado'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Botão Primário',
    variant: 'primary',
    size: 'medium'
  }
};

export const Secondary: Story = {
  args: {
    children: 'Botão Secundário',
    variant: 'secondary',
    size: 'medium'
  }
};

export const Loading: Story = {
  args: {
    children: 'Carregando...',
    variant: 'primary',
    loading: true
  }
};

export const Disabled: Story = {
  args: {
    children: 'Desabilitado',
    variant: 'primary',
    disabled: true
  }
};
```

### 4.5 Visualização de Dados com Chart.js

Implementamos gráficos interativos usando Chart.js e react-chartjs-2:

```tsx
// components/molecules/Charts/index.tsx
export const MaintenanceTypeChart: React.FC<{ distribucaoTipo: DistribuicaoTipo }> = ({ distribucaoTipo }) => {
  const hasData = distribucaoTipo && 
    (distribucaoTipo[TipoManutencao.CORRETIVA] > 0 || distribucaoTipo[TipoManutencao.PREVENTIVA] > 0);

  if (!hasData) {
    return (
      <ChartCard>
        <ChartTitle>Distribuição por Tipo de Manutenção</ChartTitle>
        <NoDataMessage>Nenhum dado disponível</NoDataMessage>
      </ChartCard>
    );
  }

  const data = {
    labels: ['Corretiva', 'Preventiva'],
    datasets: [
      {
        data: [
          distribucaoTipo[TipoManutencao.CORRETIVA],
          distribucaoTipo[TipoManutencao.PREVENTIVA]
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw as number;
            const total = (data.datasets[0].data as number[]).reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <ChartCard>
      <ChartTitle>Distribuição por Tipo de Manutenção</ChartTitle>
      <ChartContent>
        <Pie data={data} options={options} />
      </ChartContent>
      <ChartLegend>
        {/* Legenda customizada */}
      </ChartLegend>
    </ChartCard>
  );
};
```

## 5. Desafios e Soluções

### 5.1 Performance e Cache

**Desafio**: Manter a interface responsiva com várias operações assíncronas.

**Solução**: Implementamos um sistema de cache multicamadas que:
- Evita chamadas repetidas à API
- Utiliza TTL (Time To Live) por tipo de dados
- Implementa invalidação inteligente por tags
- Oferece feedback visual durante carregamento
- Integra-se perfeitamente com os hooks de API

### 5.2 Gerenciamento de Permissões

**Desafio**: Controle de acesso granular baseado em perfil de usuário.

**Solução**: Implementamos um sistema de permissões em múltiplas camadas:
- Middleware de rota para controle de acesso principal
- Verificação de permissão em componentes para UI adaptativa
- Validação na API para segurança do backend
- Feedback contextual para o usuário sobre limitações de acesso

### 5.3 Estado Consistente

**Desafio**: Manter o estado consistente entre componentes e após operações CRUD.

**Solução**: Utilizamos:
- Contextos React para estado compartilhado
- Invalidação de cache após operações de modificação
- Sistema de toast para feedback visual
- Revalidação automática após operações críticas

### 5.4 Responsividade e UX

**Desafio**: Garantir experiência consistente em diferentes dispositivos.

**Solução**: Implementamos:
- Design responsivo com media queries
- Componentes adaptáveis a diferentes tamanhos de tela
- Estados de loading e error handling em todos os componentes
- Feedback visual imediato para ações do usuário
- Validação em tempo real de formulários

## 6. Conclusão

O desenvolvimento do Sistema de Manutenção da Antártica foi guiado por boas práticas de engenharia de software, padrões de design consagrados e foco na experiência do usuário. As decisões técnicas visaram criar uma base sólida, extensível e fácil de manter, permitindo futuras evoluções do sistema.

Principais diferenciais técnicos:
- Arquitetura modular e escalável
- Componentes reutilizáveis com Atomic Design
- Sistema de cache sofisticado para otimização
- Gerenciamento de estado em múltiplas camadas
- Validações robustas e feedback contextual
- Design responsivo e acessível
- Documentação completa com Storybook

Estas escolhas resultaram em um sistema que atende completamente os requisitos do desafio, oferecendo uma experiência fluida para todos os perfis de usuário e estabelecendo uma base sólida para futuras expansões.
