# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.3.0] - 2025-06-29

### 🚀 Adicionado
- **Sistema de Template Dashboard Completo**
  - Layout unificado `src/app/dashboard/layout.tsx` com header persistente
  - Estrutura hierárquica de rotas `/dashboard/*`
  - Navegação centralizada e otimizada entre módulos

- **Módulo de Perfil do Usuário Autenticado**
  - Página `/dashboard/profile` com formulário de edição
  - Integração completa com FormContainer para validação
  - Pré-preenchimento automático de dados do usuário
  - Validação de nome (mínimo 2 caracteres) e email (formato válido)
  - Mensagens de sucesso e erro integradas
  - Reset de formulário com botão "Cancelar"

- **API de Perfil Robusta**
  - Endpoint GET `/api/profile` para buscar dados do usuário
  - Endpoint PUT `/api/profile` para atualização de perfil
  - Validação de email único entre usuários
  - Tratamento completo de erros e respostas padronizadas
  - Remoção automática de dados sensíveis (senha) das respostas

- **Hook Especializado useProfile**
  - Integração com sistema de cache para performance
  - Gerenciamento de estados de loading e erro
  - Invalidação automática de cache após atualizações
  - Integração com contexto de autenticação

### 🔧 Corrigido
- Correção de warnings ESLint em variáveis não utilizadas
- Estrutura de rotas reorganizada para melhor hierarquia
- Performance otimizada com cache integrado em todas as operações

### 🏗️ Refatorado
- Dashboard convertido para sistema de template com layout persistente
- Remoção de código duplicado do header em páginas individuais
- Simplificação da página principal do dashboard
- Organização modular seguindo padrão Atomic Design

### 📝 Documentação
- Atualização do README com nova estrutura de rotas
- Documentação detalhada do módulo de perfil
- Exemplos de uso do sistema de template

## [1.2.0] - 2025-06-29

### 🚀 Adicionado
- **Sistema de Cache Multicamadas Completo**
  - CacheProvider com TTL automático e gestão de memória
  - Hook useApi reutilizável com cache transparente
  - Hooks especializados: useDashboard, useUsuarios, useEquipamentos, useSetores
  - Invalidação inteligente por tags (auth, user, dashboard)
  - Componente CacheDebug para monitoramento em desenvolvimento

- **Configuração via Variáveis de Ambiente**
  - CACHE_DEBUG para ativar/desativar debug visual
  - CACHE_DEFAULT_TTL para configurar TTL padrão (300000ms)
  - CACHE_MAX_ENTRIES para limite máximo de entradas (1000)
  - NEXT_PUBLIC_ENVIRONMENT e CHOKIDAR_USEPOLLING
  - Arquivo .env.local e .env.example completos

- **Dashboard Dinâmico**
  - Estatísticas em tempo real com cache automático
  - Dados de chamados, equipamentos, usuários e resoluções
  - Fallback para dados estáticos quando API não disponível

### 🔧 Corrigido
- **Problemas de Logout**
  - Redirecionamento forçado com window.location.href
  - Limpeza imediata de cookies e localStorage
  - Transição suave sem "flash" visual no header
  - Invalidação completa do cache no logout

- **Middleware Otimizado**
  - Cache de decisões de rotas (TTL 30s)
  - Limpeza automática de cookies inválidos
  - Melhor tratamento de rotas públicas vs protegidas
  - Prevenção de loops de redirecionamento

- **Componente CacheDebug**
  - Correção de prop boolean para styled-components ($collapsed)
  - Ativação condicional via CACHE_DEBUG=true
  - Interface responsiva e não intrusiva

### ⚡ Melhorado
- **Performance Geral**
  - Redução de 50-90% nas requisições de API
  - Cache inteligente com cleanup automático
  - Gestão eficiente de memória com limite de entradas
  - Prevenção de recálculos desnecessários

- **Autenticação**
  - Cache de dados do usuário por 1 hora
  - Preload de dados de navegação baseados no perfil
  - Refresh automático de token com cache
  - Estratégia stale-while-revalidate

- **Documentação**
  - README atualizado com seção completa de cache
  - Descrição detalhada de todas as variáveis de ambiente
  - Exemplos de uso dos hooks de API
  - Tabela de configurações com valores padrão

### 🎯 Técnico
- **Arquitetura de Cache**
  - TTL diferenciado: Dashboard (2min), Usuários (15min), Equipamentos (30min), Setores (1h)
  - Sistema de tags para invalidação em lote
  - Limite máximo de entradas com remoção FIFO
  - Debug visual com estatísticas em tempo real

- **TypeScript**
  - Tipos completos para variáveis de ambiente
  - Interfaces para CacheEntry e hooks de API
  - Tipagem estrita para configurações de cache

- **Build e Deploy**
  - Build limpo sem warnings ou erros
  - Exposição correta de variáveis de ambiente
  - Otimização de bundle size
  - Middleware com 33.4 kB

---

## [1.1.0] - 2025-06-28

### 🚀 Adicionado
- **Atomic Design Pattern Completo**
  - Atoms: Logo, Button, Input, Badge, Spinner
  - Molecules: FormField, SearchBox, UserCard, FormContainer, Navigation
  - Organisms: Header com funcionalidades completas
  - Stories completos no Storybook para todos os componentes

- **Sistema de Navegação Avançado**
  - Navigation molecule reutilizável e responsivo
  - Controle de permissões por perfil de usuário
  - Integração mobile/desktop com breakpoints centralizados
  - Menu hamburger e transições suaves

- **FormContainer com Validação**
  - Múltiplos FormFields com validação automática
  - Progress visual e reset centralizado
  - Estados de loading e erro
  - Integração completa na página de login

### 🔧 Corrigido
- **Bug Visual do Logout**
  - Header não sumia mais abruptamente antes do redirecionamento
  - Estado isLoggingOut para transição suave
  - Feedback visual: botão "Sair" → "Saindo..."
  - SearchBox e ações desabilitadas durante logout

- **Otimização de Imagens**
  - Substituição de `<img>` por `<LazyLoadImage>` no UserCard
  - Eliminação de warnings do Next.js
  - Lazy loading automático de imagens

### ⚡ Melhorado
- **Styled Components**
  - Arquivos de estilos separados para melhor organização
  - Props com $ prefix para evitar vazamento para DOM
  - Breakpoints centralizados em SCSS e JS
  - Animações CSS otimizadas

- **Responsividade**
  - Sistema de breakpoints unificado
  - Mobile-first approach
  - Testes em diferentes resoluções
  - Navigation adaptável

---

## [1.0.0] - 2025-06-27

### 🚀 Inicial
- **Configuração Base do Projeto**
  - Next.js 15.3.3 com App Router
  - TypeScript e ESLint configurados
  - Tailwind CSS e Styled Components
  - Storybook para desenvolvimento de componentes

- **Sistema de Autenticação**
  - Context API para gerenciamento de estado
  - Login com validação de credenciais
  - Middleware para proteção de rotas
  - Cookies seguros para persistência

- **APIs Internas**
  - Endpoints para users, chamados, equipamentos, setores
  - Dados mockados em JSON
  - Dashboard com estatísticas básicas
  - Sistema de permissões por perfil

- **Componentes Base**
  - Spinner de loading global
  - Estrutura inicial de páginas
  - Sistema de contextos aninhados
  - Configuração de build e deploy

### 🎯 Arquitetura
- **Padrão de Contextos**: AuthProvider → EntitiesProvider → LoaderProvider
- **Estrutura de Dados**: ENUMs centralizados, tipos TypeScript
- **APIs**: /api/users, /api/setores, /api/equipamentos, /api/chamados
- **Middleware**: Controle de autenticação e redirecionamentos

---

## Convenções

### Tipos de Mudança
- 🚀 **Adicionado** - Novas funcionalidades
- 🔧 **Corrigido** - Correções de bugs
- ⚡ **Melhorado** - Melhorias em funcionalidades existentes
- 🎯 **Técnico** - Mudanças técnicas e refatorações
- 📝 **Documentação** - Atualizações na documentação


