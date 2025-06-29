# 🐧 NextAR - Sistema de Manutenção da Antártica

Sistema de gestão de manutenção para estação científica da Antártica, desenvolvido com Next.js, TypeScript, styled-components e Tailwind CSS.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Sistema de Cache Multicamadas](#sistema-de-cache-multicamadas)
- [Atomic Design Pattern](#atomic-design-pattern)
- [Funcionalidades](#funcionalidades)
- [Sistema de Criptografia de Senhas](#sistema-de-criptografia-de-senhas)
- [Fluxo de Autenticação Implementado](#fluxo-de-autenticação-implementado)
- [API Endpoints](#api-endpoints)
- [Desenvolvimento](#desenvolvimento)
- [Deploy](#deploy)

---

## 🎯 Sobre o Projeto

O **NextAR** é um sistema de manutenção completo projetado para gerenciar equipamentos, chamados de manutenção e recursos humanos em uma estação científica da Antártica. O sistema oferece:

- **CRUD completo** para usuários, setores, equipamentos e chamados
- **Sistema de autenticação** baseado em perfis (Pesquisador, Agente, Gestão)
- **Dashboard analítico** com estatísticas e métricas
- **Dados mockados** em JSON para desenvolvimento
- **APIs internas** do Next.js
- **Tipagem forte** com TypeScript e ENUMs

---

## 🚀 Tecnologias

### **Frontend**
- [Next.js 15](https://nextjs.org/) - Framework React full-stack
- [React 19](https://react.dev/) - Biblioteca de interface
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Styled Components](https://styled-components.com/) - CSS-in-JS
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [React Hook Form](https://react-hook-form.com/) - Formulários performáticos
- [js-cookie](https://github.com/js-cookie/js-cookie) - Gestão de cookies

### **Backend**
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - API interna
- [Axios](https://axios-http.com/) - Cliente HTTP
- [Crypto-JS](https://cryptojs.gitbook.io/docs/) - Criptografia MD5
- Dados em JSON (mockados para desenvolvimento)

### **Desenvolvimento**
- [ESLint](https://eslint.org/) - Linting
- [Sass](https://sass-lang.com/) - Pré-processador CSS
- [Storybook](https://storybook.js.org/) - Componentes isolados
- [Husky](https://typicode.github.io/husky/) - Git hooks

---

## 🏗️ Arquitetura

### **Padrão de Contextos**
```
AuthProvider (autenticação)
├── EntitiesProvider (dados CRUD)
│   ├── LoaderProvider (spinner global)
│   └── Componentes da aplicação
```

### **Estrutura de Dados**
- **ENUMs** centralizados em `src/utils/enums.ts`
- **Tipos** TypeScript em `src/types/index.ts`
- **Permissões** baseadas em perfil de usuário
- **Storage** local em JSON para desenvolvimento

### **APIs Internas**
```
/api/users        - Gestão de usuários
/api/setores      - Gestão de setores
/api/equipamentos - Gestão de equipamentos
/api/chamados     - Gestão de chamados
/api/dashboard    - Estatísticas e métricas
/api/auth/login   - Autenticação
```

---

## ⚙️ Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- **Git**

---

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd nextar
```

### 2. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite as configurações conforme necessário
```

**Variáveis disponíveis:**
```bash
# Ambiente
NEXT_PUBLIC_ENVIRONMENT=development
CHOKIDAR_USEPOLLING=true

# Configurações de desenvolvimento
CACHE_DEBUG=true

# Next.js
NEXT_PUBLIC_APP_NAME=Nextar
NEXT_PUBLIC_APP_VERSION=0.1.0

# Cache settings
CACHE_DEFAULT_TTL=300000    # TTL padrão em ms (5 minutos)
CACHE_MAX_ENTRIES=1000      # Máximo de entradas no cache
```

**Descrição das Variáveis:**

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `NEXT_PUBLIC_ENVIRONMENT` | Ambiente de execução | `development` |
| `CHOKIDAR_USEPOLLING` | Habilita polling para file watching | `true` |
| `CACHE_DEBUG` | Ativa componente de debug do cache | `true` |
| `NEXT_PUBLIC_APP_NAME` | Nome da aplicação | `Nextar` |
| `NEXT_PUBLIC_APP_VERSION` | Versão da aplicação | `0.1.0` |
| `CACHE_DEFAULT_TTL` | TTL padrão do cache (ms) | `300000` (5 min) |
| `CACHE_MAX_ENTRIES` | Máximo de entradas no cache | `1000` |

### 3. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 4. Execute o projeto em desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

### 5. Acesse a aplicação
```
http://localhost:3000
```

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build de produção
npm run start            # Inicia servidor de produção
npm run lint             # Executa linting
npm run lint:watch       # Linting em modo watch

# Storybook
npm run storybook        # Inicia Storybook (http://localhost:6006)
npm run build-storybook  # Build do Storybook

# Testes
npm test                 # Executa testes (placeholder)

# Git Hooks
npm run prepare          # Configura Husky
```

---

## 📁 Estrutura do Projeto

```
nextar/
├── public/
│   ├── api/resources/          # Dados mockados em JSON
│   │   ├── users.json
│   │   ├── setores.json
│   │   ├── equipamentos.json
│   └── └── chamados.json
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── layout.tsx
│   │   ├── client.tsx          # Providers lado cliente
│   │   └── login/page.tsx
│   ├── assets/
│   │   └── scss/               # Estilos SCSS globais
│   ├── components/
│   │   └── spinner/            # Componente de loading
│   ├── context/                # Contextos React
│   │   ├── auth.tsx            # Autenticação
│   │   ├── entities.tsx        # CRUD entidades
│   │   └── spinner.tsx         # Loading global
│   ├── hooks/                  # Custom hooks
│   ├── pages/api/              # API Routes do Next.js
│   │   ├── auth/login.ts
│   │   ├── users.ts
│   │   ├── setores.ts
│   │   ├── equipamentos.ts
│   │   ├── chamados.ts
│   │   └── dashboard.ts
│   ├── services/
│   │   ├── api.ts              # Configuração Axios
│   │   └── resources.ts        # Serviços da API
│   ├── types/
│   │   └── index.ts            # Tipos TypeScript centralizados
│   ├── utils/
│   │   ├── enums.ts            # ENUMs e constantes
│   │   ├── storage.ts          # Utilitários de dados
│   │   ├── crypto.ts           # Criptografia MD5
│   │   └── index.ts
│   └── middleware.ts           # Middleware do Next.js
├── eslint.config.mjs           # Configuração ESLint
├── next.config.js              # Configuração Next.js
├── tailwind.config.ts          # Configuração Tailwind
└── tsconfig.json               # Configuração TypeScript
```

---

## 🚀 Sistema de Cache Multicamadas

O sistema implementa uma estratégia de cache inteligente para otimizar performance, reduzir rebuilds desnecessários e melhorar a experiência do usuário.

### **Arquitetura do Cache**

```
CacheProvider (contexto global)
├── AuthProvider (integração com login/logout)
├── Middleware (cache de rotas)
├── API Hooks (cache de dados)
└── Debug Component (desenvolvimento)
```

### **Funcionalidades**

#### **1. Context Provider (`CacheProvider`)**
Cache em memória com TTL (Time To Live) e sistema de tags:

```tsx
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  tags: string[];
}

// Uso no contexto
const cache = useCache();
cache.set('users', userData, 300000, ['users', 'auth']); // 5 min
const users = cache.get('users');
cache.invalidateByTag('auth'); // Limpa todos com tag 'auth'
```

#### **2. Hook de API (`useApi`)**
Hook reutilizável para requests com cache automático:

```tsx
const { data, loading, error, refetch, clearCache } = useApi(
  async () => {
    const response = await fetch('/api/users');
    return response.json();
  },
  {
    cacheKey: 'users',
    ttl: 10 * 60 * 1000, // 10 minutos
    tags: ['users', 'auth']
  }
);
```

#### **3. Hooks Especializados**
Hooks pré-configurados para diferentes entidades:

```tsx
// Hook para dashboard com cache de 2 minutos
const { data: dashboardData, loading } = useDashboard();

// Hook para usuários com cache de 15 minutos
const { data: users } = useUsuarios();

// Hook para equipamentos com cache de 30 minutos
const { data: equipamentos } = useEquipamentos();

// Hook para setores com cache de 1 hora
const { data: setores } = useSetores();
```

#### **4. Integração com Autenticação**
O sistema se integra automaticamente com login/logout:

```tsx
// No login: cache user data por 1 hora
cache.set('current_user', response.user, 60 * 60 * 1000, ['auth', 'user']);

// No logout: limpa todos os caches relacionados
cache.invalidateByTag('auth');
cache.invalidateByTag('user');
cache.invalidateByTag('dashboard');
```

#### **5. Cache de Rotas no Middleware**
Middleware otimizado com cache de decisões de rota:

```typescript
// Cache decisions para evitar re-computação
const cacheKey = `${pathname}:${isAuthenticated}`;
const cachedResult = getCachedRoute(cacheKey);

if (cachedResult) {
  return cachedResult === 'next' 
    ? NextResponse.next() 
    : NextResponse.redirect(new URL(cachedResult, request.url));
}
```

#### **6. Debug de Cache (Desenvolvimento)**
Componente visual para monitorar cache em tempo real:

```tsx
<CacheDebug enabled={process.env.CACHE_DEBUG === 'true'} />
```

**Configuração via Variáveis de Ambiente:**
```bash
# Ativar/desativar debug do cache
CACHE_DEBUG=true              # true/false

# Configurações de performance
CACHE_DEFAULT_TTL=300000      # TTL padrão (5 min)
CACHE_MAX_ENTRIES=1000        # Máximo de entradas
```

**Features do Debug:**
- Estatísticas em tempo real (hits, misses, hit rate)
- Tamanho do cache e limite máximo
- Botão para limpar cache
- Interface minimizável
- Ativação condicional via .env
- Log de configurações no console

### **Estratégias de TTL**

| Tipo de Dado | TTL | Motivo |
|--------------|-----|---------|
| Dashboard | 2 min | Dados dinâmicos, atualizações frequentes |
| Usuários | 15 min | Dados relativamente estáveis |
| Equipamentos | 30 min | Dados pouco voláteis |
| Setores | 1 hora | Dados raramente alterados |
| User Session | 1 hora | Segurança vs. performance |
| Rotas | 1 min | Balance entre performance e flexibilidade |

### **Benefícios**

1. **Performance**: Reduz requests desnecessários
2. **UX**: Dados instantâneos em cache hits
3. **Servidor**: Menos carga na API
4. **Desenvolvimento**: Debug visual para monitoramento
5. **Flexibilidade**: TTL e tags customizáveis
6. **Automático**: Integração transparente com auth

### **Invalidação Inteligente**

```tsx
// Por key específica
cache.remove('users');

// Por tag (limpa múltiplos relacionados)
cache.invalidateByTag('auth'); // Remove user, dashboard, etc.

// Limpeza completa
cache.clear();

// Automática no logout
// Limpa auth, user, dashboard automaticamente
```

---

## 🚀 Sistema de Cache Multicamadas

O sistema implementa um **cache inteligente multicamadas** para otimizar performance, reduzir rebuilds desnecessários e melhorar a experiência do usuário.

### 🧠 **Arquitetura do Cache**

#### **1. Cache Context (`CacheProvider`)**
- **TTL configurável** por entrada
- **Tags de invalidação** para limpeza seletiva
- **Estatísticas de hit/miss** para monitoramento
- **Limpeza automática** de entradas expiradas

```typescript
// Configuração automática no layout
<CacheProvider defaultTTL={5 * 60 * 1000}> {/* 5 minutos */}
  <AuthProvider>
    <App />
  </AuthProvider>
</CacheProvider>
```

#### **2. Hooks de API com Cache (`useApi`)**
Hooks especializados que integram cache automaticamente:

```typescript
import { useChamados, useUsuarios, useDashboard } from '@/hooks/useApi';

// Hook com cache automático
const { data, loading, error, refetch } = useChamados();
// Cache key: 'chamados', TTL: 10min, Tags: ['chamados', 'tickets']

const { data: users } = useUsuarios();
// Cache key: 'users', TTL: 15min, Tags: ['users', 'auth']
```

#### **3. Cache de Rotas no Middleware**
- **Cache de decisões de roteamento** (1 minuto)
- **Otimização de redirects** login/logout
- **Redução de processamento** em requisições repetidas

#### **4. Integração com Autenticação**
- **Cache de dados do usuário** (1 hora)
- **Invalidação automática** no logout
- **Tags organizadas** por contexto

### 📊 **Estratégias de Cache por Contexto**

| **Contexto** | **TTL** | **Tags** | **Uso** |
|--------------|---------|----------|---------|
| **Auth** | 1 hora | `auth`, `user` | Dados de autenticação |
| **Dashboard** | 2 min | `dashboard`, `stats` | Métricas em tempo real |
| **Chamados** | 10 min | `chamados`, `tickets` | Lista de tickets |
| **Usuários** | 15 min | `users`, `auth` | Dados de usuários |
| **Equipamentos** | 30 min | `equipamentos`, `assets` | Inventário de ativos |
| **Setores** | 1 hora | `setores`, `departments` | Estrutura organizacional |

### 🛠️ **Uso Manual do Cache**

```typescript
import { useCache } from '@/context/cache';

const cache = useCache();

// Armazenar dados
cache.set('user_preferences', preferences, 60 * 60 * 1000, ['user', 'settings']);

// Recuperar dados
const preferences = cache.get('user_preferences');

// Invalidar por tag
cache.invalidateByTag('auth'); // Remove todos os dados de auth

// Limpar tudo
cache.clear();
```

### 🐛 **Debug de Cache (Desenvolvimento)**

O componente `CacheDebug` exibe estatísticas em tempo real:
- **Número de entradas** ativas no cache
- **Hit rate** e miss rate
- **Controles** para limpeza manual
- **Auto-esconde** em produção

### 🔄 **Invalidação Inteligente**

#### **Por Ação do Usuário:**
```typescript
// No logout - limpa dados sensíveis
cache.invalidateByTag('auth');
cache.invalidateByTag('user');
cache.invalidateByTag('dashboard');

// Na edição de usuário - atualiza listas relacionadas
cache.invalidateByTag('users');
```

## ⚛️ Atomic Design Pattern

O projeto utiliza o **Atomic Design Pattern** para organização dos componentes, criando uma arquitetura escalável e reutilizável.

### 🔬 **Estrutura dos Componentes**

```
src/components/
├── atoms/                      # Componentes básicos (indivisíveis)
│   ├── Logo/
│   │   ├── index.tsx          # Componente principal
│   │   ├── styles.tsx         # Styled components
│   │   ├── types.ts           # Interfaces TypeScript
│   │   └── Logo.stories.tsx   # Stories do Storybook
│   ├── Button/
│   │   ├── index.tsx
│   │   ├── styles.tsx
│   │   ├── types.ts
│   │   └── Button.stories.tsx
│   ├── Spinner/
│   │   ├── index.tsx
│   │   ├── styles.tsx
│   │   ├── types.ts
│   │   └── Spinner.stories.tsx
│   └── index.ts               # Barrel exports
├── molecules/                  # Combinação de atoms
├── organisms/                  # Seções da interface
├── templates/                  # Layout de páginas
└── pages/                      # Páginas completas
```

### 🧬 **Níveis do Atomic Design**

#### **1. Atoms (Átomos)**
Componentes básicos e indivisíveis que não podem ser quebrados em partes menores.

**Implementados:**
- **Logo**: Logotipo com variações (header, login) e tamanhos
- **Button**: Botões com 4 variantes e estados (loading, disabled, ícone)
- **Spinner**: Indicador de carregamento com cores e tamanhos
- **Input**: Campo de formulário reutilizável com validação e estados
- **Badge**: Tags/etiquetas para status, categorias e indicadores

```tsx
// Exemplo de uso dos atoms
import { Logo, Button, Spinner, Input, Badge } from '@/components/atoms';

<Logo variant="header" size="small" />
<Button variant="primary" loading={isSubmitting}>
  Salvar
</Button>
<Spinner size="large" color="#ff0000" />
<Input 
  type="email" 
  placeholder="seu@email.com" 
  hasError={hasError}
/>
<Badge variant="success" size="small">Concluído</Badge>
```

#### **2. Molecules (Moléculas)**
Combinação de atoms que formam componentes mais complexos.

**Implementados:**
- **FormField**: Label + Input + ErrorMessage + HelpText
- **SearchBox**: Input + Button + Icons (busca e limpar)
- **UserCard**: Avatar + Nome + Perfil + Status online
- **DataTable**: Tabela reutilizável com paginação, ordenação e filtros
- **Modal**: Modal base com portal, backdrop e animações
- **UserModal**: Modal específico para CRUD de usuários
- **FormContainer**: Container de formulário com validação integrada

```tsx
// Exemplo de uso das molecules
import { FormField, SearchBox, UserCard } from '@/components/molecules';

<FormField
  id="email"
  label="Email"
  type="email"
  placeholder="seu@email.com"
  required
  error={errors.email}
  helpText="Digite um email válido"
/>

<SearchBox
  placeholder="Buscar equipamentos..."
  onSearch={handleSearch}
  onClear={handleClear}
/>

<UserCard
  name="João Silva"
  email="joao@antartica.gov.br"
  profile={PerfilUsuario.PESQUISADOR}
  isOnline={true}
  clickable
  onClick={handleUserClick}
/>

<DataTable
  data={users}
  columns={userColumns}
  pagination={{
    page: 1,
    limit: 10,
    total: 50,
    totalPages: 5
  }}
  onPageChange={handlePageChange}
  onSort={handleSort}
  selectedRows={selectedUsers}
  onSelectionChange={setSelectedUsers}
  actions={[
    { label: 'Editar', onClick: handleEdit },
    { label: 'Excluir', onClick: handleDelete, variant: 'danger' }
  ]}
/>

<Modal 
  isOpen={isModalOpen} 
  onClose={closeModal}
  title="Confirmar Exclusão"
>
  <p>Tem certeza que deseja excluir este item?</p>
</Modal>

<UserModal
  isOpen={isUserModalOpen}
  onClose={closeUserModal}
  user={selectedUser}
  onSubmit={handleUserSubmit}
  mode="edit"
/>
```

#### **3. Organisms (Organismos)**
Seções distintas da interface que combinam molecules e atoms.

**Implementados:**
- **Header**: Logo + Navigation + SearchBox + UserMenu dropdown

```tsx
// Exemplo de uso dos organisms
import { Header } from '@/components/organisms';

<Header
  userName={user.nome}
  userEmail={user.email}
  userProfile={user.perfil}
  isOnline={true}
  onLogout={handleLogout}
  onProfileClick={handleProfileClick}
/>
```

**Planejados:**
- **Sidebar**: Navigation + QuickActions
- **DataTable**: SearchBox + Table + Pagination
- **FormContainer**: Múltiplos FormFields com validação

#### **4. Templates (Templates)**
Layout de páginas sem conteúdo específico.

**Planejados:**
- **AuthTemplate**: Layout para login/registro
- **DashboardTemplate**: Layout para área logada
- **FormTemplate**: Layout para formulários

#### **5. Pages (Páginas)**
Instâncias específicas de templates com conteúdo real.

**Implementadas:**
- **LoginPage**: Formulário de autenticação
- **DashboardPage**: Painel principal

### �📖 **Convenções de Desenvolvimento**

#### **Estrutura de Arquivo Padrão**
```
ComponentName/
├── index.tsx           # Componente principal
├── styles.tsx          # Styled components
├── types.ts            # Interfaces TypeScript
└── Component.stories.tsx # Stories do Storybook
```

#### **Nomenclatura**
- **Componentes**: PascalCase (`Button`, `Logo`)
- **Props**: camelCase com `$` para styled-components (`$variant`, `$size`)
- **Arquivos**: camelCase (`types.ts`, `styles.tsx`)
- **Stories**: ComponentName.stories.tsx

#### **Padrões de Props**
```tsx
interface ComponentProps {
  /** Descrição da prop */
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}
```

### 🎨 **Storybook Integration**

Cada componente atômico possui stories completas:

```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
    </div>
  )
};
```

## 🧩 Componentes Implementados

### **🔬 Atoms (Componentes Básicos)**

#### **Input**
Campo de formulário reutilizável com múltiplos tipos e estados.

```tsx
<Input
  type="email"
  placeholder="seu@email.com"
  hasError={!!error}
  disabled={loading}
  required
/>
```

**Características:**
- ✅ Tipos: text, email, password, number, tel, url, search
- ✅ Estados: normal, error, disabled, readonly
- ✅ Ícones integrados (ex: lupa para search)
- ✅ Validação visual automática

#### **Badge**
Tags/etiquetas para status, categorias e indicadores.

```tsx
<Badge variant="success" size="small">Concluído</Badge>
<Badge variant="warning" dot />
<Badge variant="danger" onClick={handleClick}>Urgente</Badge>
```

**Características:**
- ✅ Variantes: default, primary, secondary, success, warning, danger
- ✅ Tamanhos: small, medium, large
- ✅ Modo dot (apenas indicador)
- ✅ Estados clicáveis

### **🧬 Molecules (Componentes Compostos)**

#### **FormField**
Combinação completa de Label + Input + validação.

```tsx
<FormField
  id="email"
  label="Email"
  type="email"
  placeholder="Digite seu email"
  required
  error={errors.email}
  helpText="Será usado para notificações"
/>
```

**Características:**
- ✅ Label com indicador de obrigatório (*)
- ✅ Input integrado com estados
- ✅ Mensagens de erro estilizadas
- ✅ Texto de ajuda opcional
- ✅ Validação visual automática

#### **SearchBox**
Campo de busca com funcionalidades avançadas.

```tsx
<SearchBox
  placeholder="Buscar equipamentos..."
  onSearch={handleSearch}
  onClear={handleClear}
  loading={isSearching}
/>
```

**Características:**
- ✅ Input de busca estilizado
- ✅ Botão de busca integrado
- ✅ Botão de limpeza (quando tem conteúdo)
- ✅ Estado de loading
- ✅ Busca ao pressionar Enter

#### **UserCard**
Card de usuário com avatar, informações e status.

```tsx
<UserCard
  name="João Silva"
  email="joao@antartica.gov.br"
  profile={PerfilUsuario.PESQUISADOR}
  isOnline={true}
  clickable
  onClick={handleUserClick}
/>
```

**Características:**
- ✅ Avatar com iniciais geradas automaticamente
- ✅ Indicador de status online/offline
- ✅ Badge de perfil colorido
- ✅ Tamanhos: small, medium, large
- ✅ Estados clicáveis com hover

### **🏗️ Organisms (Seções Complexas)**

#### **Header**
Cabeçalho completo com navegação e funcionalidades.

```tsx
<Header
  userName={user.nome}
  userProfile={user.perfil}
  isOnline={true}
  onLogout={handleLogout}
  onProfileClick={handleProfileClick}
/>
```

**Características:**
- ✅ Logo clicável
- ✅ Menu de navegação principal
- ✅ SearchBox integrado
- ✅ UserCard no menu dropdown
- ✅ Menu mobile responsivo
- ✅ Logout integrado

### **📱 Responsividade**

Todos os componentes são totalmente responsivos:

```scss
// Breakpoints integrados
@media (max-width: 768px) {
  // Adaptações mobile
}

@media (max-width: 1024px) {
  // Adaptações tablet  
}
```

**Comportamentos:**
- ✅ Header: Menu collapse em mobile
- ✅ SearchBox: Esconde em telas menores
- ✅ UserCard: Adapta tamanhos automaticamente
- ✅ FormField: Layout vertical em mobile

### **🎨 Tematização**

Sistema de cores consistente:

```tsx
const colors = {
  primary: '#667eea',
  secondary: '#6b7280', 
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  default: '#f3f4f6'
};
```

**Aplicação:**
- ✅ Badges com cores semânticas
- ✅ Estados de erro padronizados
- ✅ Hover states consistentes
- ✅ Focus rings para acessibilidade

### **📚 Storybook - Documentação Interativa**

O projeto inclui Storybook completo com todas as variações dos componentes.

#### **Executar o Storybook**
```bash
npm run storybook
# Acesse: http://localhost:6006
```

#### **Stories Implementadas**

**Atoms:**
- ✅ **Logo.stories**: 5 variações (tamanhos, contextos)
- ✅ **Button.stories**: 12 variações (tipos, estados, tamanhos)
- ✅ **Spinner.stories**: 8 variações (cores, tamanhos, overlay)
- ✅ **Input.stories**: 10 variações (tipos, estados, validação)
- ✅ **Badge.stories**: 15 variações (cores, tamanhos, dot mode)

**Molecules:**
- ✅ **FormField.stories**: 8 variações (validação, ajuda, estados)
- ✅ **SearchBox.stories**: 6 variações + exemplo interativo
- ✅ **UserCard.stories**: 10 variações (perfis, tamanhos, online)

**Organisms:**
- ✅ **Header.stories**: 5 variações + exemplo de página completa

#### **Recursos do Storybook**

```tsx
// Exemplo de story com controles
export const Interactive: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
  },
};
```

**Funcionalidades:**
- ✅ **Controles interativos** para todas as props
- ✅ **Actions logger** para eventos
- ✅ **Documentação automática** com JSDoc
- ✅ **Testes visuais** com múltiplos cenários
- ✅ **Responsividade** testável
- ✅ **Casos extremos** (nomes longos, sem dados)

#### **Navegação no Storybook**

```
📚 Storybook Structure
├── 🔬 Atoms/
│   ├── Badge
│   ├── Button  
│   ├── Input
│   ├── Logo
│   └── Spinner
├── 🧬 Molecules/
│   ├── FormField
│   ├── SearchBox
│   └── UserCard  
└── 🏗️ Organisms/
    └── Header
```

## ✨ Funcionalidades

### **🔐 Autenticação**
- Login com email/senha
- 3 perfis de usuário: Pesquisador, Agente, Gestão
- Sistema de permissões granular
- Persistência segura com cookies
- Middleware de proteção de rotas

### **🏗️ Sistema de Template Dashboard**
- Layout unificado com header persistente
- Navegação hierárquica `/dashboard/*`
- Otimização de performance com cache integrado
- Experiência de usuário consistente

### **👤 Gestão de Perfil do Usuário**
- **Página `/dashboard/profile`** - Edição de perfil do usuário autenticado
- **Formulário inteligente** - Pré-preenchimento automático de dados
- **Validação robusta** - Nome (mín. 2 caracteres) e email (formato válido)
- **API dedicada** - Endpoints GET/PUT `/api/profile` com validação de email único
- **UX otimizada** - Mensagens de sucesso/erro e reset de formulário

### **👥 Gestão de Usuários**
- **Página `/dashboard/usuarios`** - Interface completa para gestão de usuários
- **CRUD Completo** - Criar, listar, editar e excluir usuários
- **Permissões** - Acesso restrito ao perfil GESTÃO
- **DataTable Avançado** - Paginação (10/25/50/100), ordenação e filtros
- **Busca em Tempo Real** - Por nome, email, perfil e status
- **Modais Modernos** - Interface com FormContainer para criação/edição
- **Validação Robusta** - Email único, campos obrigatórios e formatos
- **Cache Otimizado** - TTL de 5 minutos com invalidação inteligente
- **Seleção Múltipla** - Ações em lote (ativar/desativar)
- **Estatísticas** - Contadores por perfil em tempo real
- **Proteções** - Não pode excluir a si mesmo ou último GESTÃO

### **🏢 Gestão de Setores**
- Cadastro por categoria científica
- 10 categorias pré-definidas (Biologia, Meteorologia, etc.)

### **🔧 Gestão de Equipamentos**
- Vinculação a setores
- Controle de manutenção preventiva
- Códigos únicos hexadecimais

### **📋 Gestão de Chamados**
- Tipos: Corretiva e Preventiva
- Status: Aberto, Em Progresso, Concluído
- Prioridades: Baixa, Média, Alta
- Atribuição a agentes
- Histórico completo

### **📊 Dashboard Analítico**
- Estatísticas em tempo real com cache otimizado
- Distribuição por status/tipo
- Métricas por agente
- Visualizações gráficas com animações (react-countup)
- Sistema de cache multicamadas para performance

---

## 🧩 Componentes Avançados

### **📊 DataTable Reutilizável**
Componente molecule altamente configurável para listagem de dados:

**Funcionalidades:**
- **Paginação dinâmica** - 10, 25, 50, 100 itens por página
- **Ordenação** - Clique nos headers para ordenar crescente/decrescente
- **Filtros integrados** - Busca em tempo real por qualquer campo
- **Seleção múltipla** - Checkboxes para ações em lote
- **Ações por linha** - Botões de editar, excluir, visualizar
- **Responsivo** - Adapta colunas para mobile
- **Loading states** - Skeleton e spinners integrados
- **Cache inteligente** - Otimização automática de performance

**Exemplo de uso:**
```tsx
<DataTable
  data={users}
  columns={[
    { key: 'nome', label: 'Nome', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'perfil', label: 'Perfil', filterable: true }
  ]}
  pagination={{ page: 1, limit: 10, total: 50, totalPages: 5 }}
  onPageChange={handlePageChange}
  onSort={handleSort}
  selectedRows={selectedItems}
  onSelectionChange={setSelectedItems}
  actions={[
    { label: 'Editar', onClick: handleEdit, icon: '✏️' },
    { label: 'Excluir', onClick: handleDelete, variant: 'danger' }
  ]}
/>
```

### **🎭 Sistema de Modais**
Sistema de modais moderno com portal e animações:

**Componentes:**
- **Modal** - Componente base reutilizável
- **UserModal** - Modal específico para CRUD de usuários
- **ConfirmModal** - Modal de confirmação para ações críticas

**Funcionalidades:**
- **Portal rendering** - Renderização fora da árvore DOM
- **Backdrop blur** - Fundo desfocado com transparência
- **Animações CSS** - Transições suaves de entrada/saída
- **Escape key** - Fechamento com tecla ESC
- **Click outside** - Fechamento ao clicar fora
- **Focus trap** - Navegação por teclado restrita ao modal
- **Scroll lock** - Previne scroll da página de fundo

**Exemplo de uso:**
```tsx
<UserModal
  isOpen={isModalOpen}
  onClose={closeModal}
  user={selectedUser}
  onSubmit={handleSubmit}
  mode="create" // ou "edit"
  title="Criar Usuário"
/>
```

---

## 🔐 Sistema de Criptografia de Senhas

### **Implementação MD5**
O sistema utiliza criptografia MD5 para armazenamento seguro de senhas:

- **Hash MD5** - Senhas nunca armazenadas em texto plano
- **Verificação segura** - Comparação de hashes para autenticação
- **Fluxos protegidos** - Login, registro e alteração de senha criptografados

### **Credenciais de Teste**
| Email | Senha | Perfil |
|-------|-------|---------|
| admin@nextar.com | admin123 | Gestão |
| ana.silva@antartica.br | admin123 | Gestão |
| carlos.oliveira@antartica.br | agente123 | Agente |
| maria.santos@antartica.br | pesq123 | Pesquisador |

### **Fluxos de Segurança**

#### **Login Seguro**
1. Usuário envia email + senha em texto plano
2. Sistema gera hash MD5 da senha enviada
3. Compara com hash armazenado
4. Retorna usuário (sem senha) + token se válido

#### **Criação de Usuário**
1. Senha recebida em texto plano via API
2. Sistema gera hash MD5 antes de salvar
3. Usuário retornado sem campo senha

#### **Alteração de Senha**
1. Usuário fornece senha atual + nova senha
2. Sistema verifica senha atual (hash)
3. Nova senha é criptografada e salva
4. Processo com validação de segurança

### **Endpoints de Segurança**
```
POST /api/auth/login
Body: { email: string, password: string }
Response: { user: User (sem senha), token: string }

PUT /api/users/change-password
Body: { userId: string, currentPassword: string, newPassword: string }
Response: { success: boolean, message: string }
```

### **Implementação Técnica**
```typescript
// src/utils/crypto.ts
import CryptoJS from 'crypto-js';

export function hashPassword(password: string): string {
  return CryptoJS.MD5(password).toString();
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const inputHash = hashPassword(password);
  return inputHash === hashedPassword;
}
```

### **Arquivos de Criptografia**
- `src/utils/crypto.ts` - Funções de hash e verificação
- `public/api/resources/users.json` - Senhas em hash MD5
- `src/pages/api/auth/login.ts` - Login com verificação MD5
- `src/pages/api/users.ts` - CRUD com criptografia
- `src/pages/api/users/change-password.ts` - Alteração segura

---

## 🔐 Fluxo de Autenticação Implementado

> **📝 Documentação Centralizada**: Esta seção consolida toda a documentação do sistema de autenticação implementado, incluindo fluxos, middleware, cookies e testes.

### ✅ **Sistema Completo de Login/Logout/Redirecionamento**

#### **🚀 Fluxo Implementado:**

##### **1. Login Bem-sucedido:**
```
Usuario envia email/senha 
    ↓
Validação MD5 no backend 
    ↓
Context Auth salva user em:
    • localStorage
    • Cookie 'nextar_user' (7 dias)
    ↓
Middleware detecta cookie
    ↓
Redirecionamento automático para /dashboard
```

##### **2. Acesso Direto a Rotas:**
```
Usuário acessa qualquer rota
    ↓
Middleware verifica cookie 'nextar_user'
    ↓
Se AUTENTICADO:
    • /login → redireciona para /dashboard
    • Outras rotas → permite acesso
    ↓
Se NÃO AUTENTICADO:
    • Qualquer rota protegida → redireciona para /login
    • /login → permite acesso
```

##### **3. Logout:**
```
Usuário clica em "Sair"
    ↓
Context Auth remove:
    • localStorage
    • Cookie 'nextar_user'
    ↓
Middleware detecta ausência do cookie
    ↓
Redirecionamento automático para /login
```

### 📁 **Arquivos do Sistema de Autenticação e Dashboard:**

1. **`src/middleware.ts`** - Controle de rotas e redirecionamento
2. **`src/context/auth.tsx`** - Gestão de cookies + localStorage
3. **`src/app/dashboard/layout.tsx`** - Template unificado com header persistente
4. **`src/app/dashboard/page.tsx`** - Página principal do dashboard
5. **`src/app/dashboard/profile/page.tsx`** - Edição de perfil do usuário
6. **`src/app/login/page.tsx`** - Formulário com React Hook Form
7. **`src/hooks/useProfile.ts`** - Hook especializado para operações de perfil
8. **`src/pages/api/profile.ts`** - API endpoints para gestão de perfil

### 🔧 **Funcionalidades Implementadas:**

#### **Template Dashboard (`src/app/dashboard/layout.tsx`):**
- ✅ Header persistente em todas as subpáginas do dashboard
- ✅ Navegação centralizada e otimizada
- ✅ Gestão de logout com redirecionamento
- ✅ Link funcional para perfil do usuário

#### **Módulo de Perfil (`src/app/dashboard/profile/`):**
- ✅ Formulário pré-preenchido com dados do usuário
- ✅ Validação robusta (nome mín. 2 chars, email válido)
- ✅ Integração com FormContainer para UX consistente
- ✅ Mensagens de sucesso/erro integradas
- ✅ API dedicada com validação de email único

#### **Middleware (`src/middleware.ts`):**
- ✅ Detecta autenticação via cookie `nextar_user`
- ✅ Protege rotas: `/dashboard`, `/users`, `/chamados`, etc.
- ✅ Redireciona `/` baseado na autenticação
- ✅ Bloqueia acesso a `/login` se já autenticado
- ✅ Redireciona para `/login` se não autenticado

#### **Auth Context (`src/context/auth.tsx`):**
- ✅ Login salva em localStorage + cookies
- ✅ Logout remove localStorage + cookies  
- ✅ Recuperação automática de sessão
- ✅ Sincronização localStorage ↔ cookies

#### **Dashboard (`src/app/dashboard/page.tsx`):**
- ✅ Página inicial pós-login com estatísticas animadas
- ✅ Exibe dados do usuário logado
- ✅ Interface moderna com métricas em tempo real
- ✅ Sistema de cache otimizado integrado

### 🍪 **Gestão de Cookies:**

```typescript
// Login - salva cookie com 7 dias de expiração
Cookies.set('nextar_user', JSON.stringify(user), { 
  expires: 7,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
});

// Logout - remove cookie
Cookies.remove('nextar_user');

// Middleware - verifica cookie
const userCookie = request.cookies.get('nextar_user');
const isAuthenticated = !!userCookie?.value;
```

### 🛡️ **Rotas Protegidas:**

```typescript
export const config = {
  matcher: [
    '/',           // Redireciona baseado na auth
    '/login',      // Bloqueia se autenticado
    '/dashboard/:path*',
    '/users/:path*',
    '/chamados/:path*',
    '/equipamentos/:path*',
    '/setores/:path*'
  ]
};
```

### 🎯 **Credenciais de Teste Completas:**

| Email | Senha | Perfil | Redirecionamento |
|-------|-------|---------|------------------|
| admin@nextar.com | admin123 | Gestão | /login → /dashboard |
| carlos.oliveira@antartica.br | agente123 | Agente | /login → /dashboard |
| maria.santos@antartica.br | pesq123 | Pesquisador | /login → /dashboard |

### 🔄 **Como Testar o Fluxo:**

1. **Acesse `http://localhost:3000`**
   - Deve redirecionar para `/login`

2. **Faça login com credenciais de teste**
   - Deve redirecionar automaticamente para `/dashboard`

3. **Tente acessar `/login` logado**
   - Deve redirecionar para `/dashboard`

4. **Clique em "Sair" no dashboard**
   - Deve redirecionar para `/login`

5. **Tente acessar `/dashboard` sem login**
   - Deve redirecionar para `/login`

---

## 🌐 API Endpoints

### **Autenticação**
```
POST /api/auth/login
Body: { email: string, password: string }
Response: { user: User, token: string }
```

### **Usuários**
```
GET    /api/users
Query: page?, limit?, search?, perfil?, sortBy?, sortOrder?
Response: { 
  data: User[], 
  pagination: { page, limit, total, totalPages },
  sorting: { sortBy, sortOrder }
}

POST   /api/users
Body: { nome: string, email: string, senha: string, perfil: PerfilUsuario, telefone?, setor?, observacoes? }
Response: { user: User }

GET    /api/users/[id]
Response: { user: User }

PUT    /api/users/[id]
Body: { nome?, email?, senha?, perfil?, telefone?, setor?, observacoes?, ativo? }
Response: { user: User }

DELETE /api/users/[id]
Response: { message: string }

PUT    /api/users/change-password
Body: { userId: string, currentPassword: string, newPassword: string }
Response: { message: string }
```

### **Perfil do Usuário**
```
GET    /api/profile
Response: { user: User }

PUT    /api/profile
Body: { nome?: string, email?: string, telefone?: string, observacoes? }
Response: { user: User }
```

### **Setores**
```
GET    /api/setores
POST   /api/setores
Body: { nome: string, categoria: string }
```

### **Equipamentos**
```
GET    /api/equipamentos?setorId=string
POST   /api/equipamentos
Body: { nome: string, codigo: string, modelo: string, setorId: string, proximaManutencao: string }
```

### **Chamados**
```
GET    /api/chamados?status=string&agenteId=string&tipo=string
POST   /api/chamados
PUT    /api/chamados?id=string
Body: { tipo: TipoManutencao, prioridade: Prioridade, descricao: string, setorId: string }
```

### **Dashboard**
```
GET    /api/dashboard
Response: { totalChamados: number, distribucaoStatus: object, distribucaoTipo: object }
```

---

## 💻 Desenvolvimento

### **ENUMs e Tipos**
```typescript
// src/utils/enums.ts
export enum ChamadoStatus {
  ABERTO = 'aberto',
  EM_PROGRESSO = 'em_progresso',
  CONCLUIDO = 'concluido'
}

// src/types/index.ts
export interface Chamado {
  id: string;
  tipo: TipoManutencao;
  status: ChamadoStatus;
  prioridade: Prioridade;
  // ...
}
```

### **Context Pattern**
```typescript
// Usando contextos
const { user, login, logout } = useAuth();
const { chamados, createChamado } = useEntities();
const { setLoading } = useLoader();
```

### **Styled Components + Tailwind**
```tsx
// Combinando as duas abordagens
const StyledButton = styled.button`
  background: ${props => props.theme.colors.primary};
`;

<StyledButton className="px-4 py-2 rounded-lg hover:shadow-lg transition-shadow">
  Botão Híbrido
</StyledButton>
```

### **Linting e Formatação**
```bash
# Executar linting
npm run lint

# Corrigir automaticamente
npm run lint -- --fix

# Modo watch para desenvolvimento
npm run lint:watch
```

### **Storybook**
```bash
# Executar Storybook
npm run storybook

# Acesse em: http://localhost:6006
```

O Storybook está configurado para:
- **Componentes isolados** para desenvolvimento
- **Documentação automática** com addon-docs
- **Temas** pré-configurados (light, dark, antarctic)
- **Styled Components** + **LoaderProvider** integrados
- **Story exemplo** do componente Spinner funcionando

---

## 🚀 Deploy

### **Build de Produção**
```bash
npm run build
npm start
```

### **Variáveis de Ambiente**
```env
# .env.local
NEXT_PUBLIC_API_URL=https://your-api.com
NODE_ENV=production
```

### **Docker (opcional)**
```dockerfile
# Dockerfile já configurado
docker build -t nextar .
docker run -p 3000:3000 nextar
```

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'feat: adicionar nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### **Padrão de Commits**
```
feat: nova funcionalidade
fix: correção de bug
refactor: refatoração de código
docs: atualização de documentação
style: formatação/estilo
test: adição de testes
```

## 👨‍💻 Autor: Wesley Alves 
[http://github.com/wesandradealves] http://github.com/wesandradealves

**Desenvolvido para desafio técnico**
- Sistema de manutenção científica da Antártica
- Stack: Next.js, TypeScript, Styled Components, Tailwind
- Arquitetura moderna com contextos e APIs internas