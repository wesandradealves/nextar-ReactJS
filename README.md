# 🐧 NextAR - Sistema de Manutenção da Antártica

Sistema de gestão de manutenção para estação científica da Antártica, desenvolvido com Next.js, TypeScript, styled-components e Tailwind CSS.

[![Versão atual: 3.2.0](https://img.shields.io/badge/vers%C3%A3o-3.2.0-blue)](https://github.com/wesandradealves/nextar-ReactJS/releases)

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
- [Visualização de Dados](#visualização-de-dados)
- [Histórico de Manutenções](#histórico-de-manutenções)
- [Funcionalidades](#funcionalidades)
- [Sistema de Notificações (Toasts)](#sistema-de-notificações-toasts)
- [Sistema de Criptografia de Senhas](#sistema-de-criptografia-de-senhas)
- [Fluxo de Autenticação Implementado](#fluxo-de-autenticação-implementado)
- [API Endpoints](#api-endpoints)
- [Desenvolvimento](#desenvolvimento)
- [Deploy](#deploy)

---

## 🎯 Sobre o Projeto

O **NextAR** é um sistema de manutenção completo projetado para gerenciar equipamentos, chamados de manutenção e recursos humanos em uma estação científica da Antártica. O sistema oferece:

- **CRUD completo** para usuários, setores, equipamentos e chamados
- **Gestão avançada de setores científicos** com 10 categorias especializadas
- **Sistema de autenticação** baseado em perfis (Pesquisador, Agente, Gestão)
- **Gestão avançada de usuários** com alteração de senhas por administradores
- **Dashboard analítico** com estatísticas, métricas e gráficos interativos
- **Histórico de manutenções** com filtros avançados e visualização completa
- **APIs RESTful completas** com paginação, filtros e busca
- **Cache multicamadas** para otimização de performance
- **Dados mockados** em JSON para desenvolvimento
- **Tipagem forte** com TypeScript e ENUMs
- **Interface moderna** com componentes reutilizáveis e Atomic Design
- **Visualização de dados** com gráficos Chart.js integrados

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
- [Chart.js](https://www.chartjs.org/) - Biblioteca de visualização de dados
- [React-ChartJS-2](https://react-chartjs-2.js.org/) - Componentes React para Chart.js

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
- **DateInput**: Campo de data nativo com formato brasileiro e validação 
- **Badge**: Tags/etiquetas para status, categorias e indicadores
- **Select**: Dropdown padronizado com placeholder e validação 
- **Textarea**: Campo de texto multilinha com contador e validação 

```tsx
// Exemplo de uso dos atoms
import { Logo, Button, Spinner, Input, DateInput, Badge, Select, Textarea } from '@/components/atoms';

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
<DateInput
  placeholder="Data de manutenção"
  value="2025-07-15"
  min="2025-01-01"
  max="2025-12-31"
  required
/>
<Badge variant="success" size="small">Concluído</Badge>
<Select placeholder="Selecione uma opção" required>
  <option value="1">Opção 1</option>
  <option value="2">Opção 2</option>
</Select>
<Textarea
  placeholder="Descreva o problema..."
  rows={4}
  maxLength={500}
  helperText="Seja específico sobre o problema"
  required
/>
```

#### **2. Molecules (Moléculas)**
Combinação de atoms que formam componentes mais complexos.

**Implementados:**
- **FormField**: Label + Input + ErrorMessage + HelpText
- **FormSelection**: Seleção visual com cards, ícones e descrições 
- **FormList**: Lista dinâmica para formulários com add/remove 
- **FormModal**: Modal base para formulários com seções e validação 
- **SearchBox**: Input + Button + Icons (busca e limpar)
- **UserCard**: Avatar + Nome + Perfil + Status online
- **DataTable**: Tabela reutilizável com paginação, ordenação e filtros
- **Modal**: Modal base com portal, backdrop e animações
- **UserModal**: Modal específico para CRUD de usuários
- **SetorModal**: Modal para CRUD de setores com categorias científicas 
- **ChamadoModal**: Modal para CRUD de chamados com diferentes modos 
- **EquipamentoModal**: Modal para CRUD de equipamentos com dados técnicos 
- **Charts**: Componentes de visualização com gráficos de pizza e barras
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
- ✅ **Select.stories**: 8 variações (estados, placeholder, validação) 

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
- ✅ **Select.stories**: 8 variações (estados, placeholder, validação) 

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
- ✅ **Select.stories**: 8 variações (estados, placeholder, validação) 

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
- ✅ **Select.stories**: 8 variações (estados, placeholder, validação) 

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
- ✅ **Select.stories**: 8 variações (estados, placeholder, validação) 

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
- ✅ **Select.stories**: 8 variações (estados, placeholder, validação) 

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
- ✅ **Select.stories**: 8 variações (estados, placeholder, validação) 

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
- ✅ **Select.stories**: 8 variações (estados, placeholder, validação) 

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
- ✅ **Select.stories**: 8 variações (estados, placeholder, validação) 

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
- ✅ **Select.stories**: 8 variações (estados, placeholder, validação) 

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

## 📊 Visualização de Dados

O sistema implementa **gráficos interativos** usando Chart.js e react-chartjs-2 para visualização de dados no dashboard.

### 📈 **Componentes de Gráficos**

O sistema implementa dois tipos principais de gráficos:

```
src/components/molecules/Charts/
├── index.tsx           # Componente principal e subcomponentes
├── styles.tsx          # Styled components
└── Charts.stories.tsx  # Stories do Storybook
```

#### **1. Gráfico de Pizza (Distribuição por Tipo)**

Visualiza a distribuição de manutenções por tipo (Corretiva/Preventiva):

```tsx
import { MaintenanceTypeChart } from '@/components/molecules/Charts';

// Dados para o gráfico
const distribucaoTipo = {
  [TipoManutencao.CORRETIVA]: 42,   // 42 manutenções corretivas
  [TipoManutencao.PREVENTIVA]: 58    // 58 manutenções preventivas
};

// Renderizando o gráfico
<MaintenanceTypeChart distribucaoTipo={distribucaoTipo} />
```

**Características:**
- **Interativo**: Tooltip com valores e percentuais
- **Legendas personalizadas**: Indicadores de cores e valores
- **Responsivo**: Adaptação a diferentes tamanhos de tela
- **Estado vazio**: Tratamento adequado para ausência de dados

#### **2. Gráfico de Barras (Distribuição por Agente)**

Visualiza a distribuição de chamados por agente de manutenção:

```tsx
import { MaintenanceAgentChart } from '@/components/molecules/Charts';

// Dados para o gráfico
const distribucaoAgente = [
  { 
    agenteId: '1', 
    nomeAgente: 'Carlos Silva', 
    quantidade: 25,              // Total de chamados
    quantidadeConcluidos: 20     // Chamados concluídos
  },
  // ... outros agentes
];

// Renderizando o gráfico
<MaintenanceAgentChart distribucaoAgente={distribucaoAgente} />
```

**Características:**
- **Duas séries**: Total de chamados e chamados concluídos
- **Limitado a 6 agentes**: Visualização otimizada dos principais agentes
- **Formatação de eixos**: Valores inteiros no eixo Y
- **Responsivo**: Adaptação a diferentes tamanhos de tela

#### **3. Componente Agregador (DashboardCharts)**

Componente principal que agrupa os gráficos no dashboard:

```tsx
import { DashboardCharts } from '@/components/molecules/Charts';

// Uso na página de dashboard
<DashboardCharts 
  distribucaoTipo={dashboardData.distribucaoTipo}
  distribucaoAgente={dashboardData.distribucaoAgente}
/>
```

### 🔄 **Integração com API**

Os dados para os gráficos são fornecidos pela API do dashboard:

```typescript
// src/pages/api/dashboard.ts
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // ...
  res.status(200).json({ 
    stats,
    distribucaoTipo: stats.distribucaoTipo,
    distribucaoAgente: stats.distribucaoAgente
  });
}
```

### 📱 **Responsividade e Acessibilidade**

- **Layout responsivo**: Adaptação para mobile e desktop
- **Estados de carregamento**: Indicação visual durante loading
- **Mensagem de ausência de dados**: Feedback quando não há dados
- **Alto contraste**: Cores com boa diferenciação
- **Tooltips informativos**: Dados detalhados ao passar o mouse

### 🔍 **Stories no Storybook**

Os componentes de gráficos possuem stories completos no Storybook:

```typescript
// src/components/molecules/Charts/Charts.stories.tsx
export const Default: Story = {
  args: {
    distribucaoTipo: mockDistribuicaoTipo,
    distribucaoAgente: mockDistribuicaoAgente
  }
};

export const EmptyData: Story = {
  args: {
    distribucaoTipo: { [TipoManutencao.CORRETIVA]: 0, [TipoManutencao.PREVENTIVA]: 0 },
    distribucaoAgente: []
  }
};

export const TypeChart: StoryObj<typeof MaintenanceTypeChart> = {
  // ...configuração para o gráfico de pizza isolado
};

export const AgentChart: StoryObj<typeof MaintenanceAgentChart> = {
  // ...configuração para o gráfico de barras isolado
};
```

---

## 📋 Histórico de Manutenções

O sistema implementa um módulo completo de histórico de manutenções, permitindo visualização, filtragem e exportação de dados.

### 📑 **Página de Histórico**

A página `/dashboard/historico` permite consulta avançada de manutenções:

```
src/app/dashboard/historico/
├── layout.tsx       # Layout específico
├── page.tsx         # Componente principal
└── styles.tsx       # Styled components
```

**Características:**
- **Filtros avançados**: Tipo, status, agente, equipamento, setor e período
- **Estatísticas em tempo real**: Cards por status e tipo
- **Paginação inteligente**: Para grandes volumes de dados
- **Exportação de dados**: Download do histórico filtrado
- **Validação de filtros**: Especialmente para datas início/fim

### 🔍 **Visualização por Equipamento**

Cada equipamento possui seu histórico completo de manutenções:

```tsx
// No modal de equipamento
<EquipamentoModal
  equipamento={selectedEquipamento}
  mode="view"      // Modo visualização
  onClose={closeModal}
/>
```

**Características do histórico no modal:**
- **Lista completa**: Todas as manutenções do equipamento
- **Badges coloridos**: Indicação visual de status e tipo
- **Dados do agente**: Informações de quem realizou a manutenção
- **Datas formatadas**: Data de abertura e execução em formato BR
- **Ordenação cronológica**: Manutenções mais recentes primeiro

### 🔄 **Hook Customizado**

O hook `useHistorico` gerencia todos os dados e operações:

```typescript
// Uso do hook
const { 
  data,                // Dados paginados
  loading,             // Estado de carregamento
  filters,             // Filtros ativos
  stats,               // Estatísticas globais
  pagination,          // Controle de paginação
  setFilters,          // Atualiza filtros
  setPagination,       // Controle de página/limite
  exportHistorico,     // Função de exportação
  fetchHistoricoByEquipamento // Filtra por equipamento
} = useHistorico();
```

### 🔐 **Controle de Acesso Granular**

- **Acesso restrito**: Apenas perfil GESTÃO pode acessar a página completa
- **Visualização universal**: Todos os perfis podem ver histórico de equipamentos
- **Middleware automático**: Proteção de rotas e redirecionamento
- **Validação na API**: Verificação de permissões nos endpoints

### 🗃️ **API Dedicada**

O endpoint `/api/historico` fornece todos os dados necessários:

```typescript
// GET /api/historico
// Parâmetros:
// - tipo: TipoManutencao
// - status: ChamadoStatus
// - agenteId: string
// - equipamentoId: string
// - setorId: string
// - dataInicio: string (YYYY-MM-DD)
// - dataFim: string (YYYY-MM-DD)
// - page: number
// - limit: number
```

**Resposta:**
```json
{
  "data": [...],         // Chamados filtrados e paginados
  "pagination": {        // Informações de paginação
    "page": 1,
    "limit": 10,
    "total": 128,
    "totalPages": 13
  },
  "stats": {             // Estatísticas globais
    "totalChamados": 128,
    "porStatus": {...},
    "porTipo": {...}
  }
}
```

---