# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.5.0] - 2025-06-29

### Adicionado
- **Gestão Avançada de Senhas por Administradores**
  - Usuários com perfil GESTAO podem agora alterar senhas de outros usuários
  - Campo de senha opcional no modal de edição de usuários (apenas para gestores)
  - Endpoint `/api/users/change-password` expandido para suportar alterações administrativas
  - Nova função `changeUserPasswordAsAdmin` no hook `useUsers`
  - Validação de permissões para operações administrativas
  - Interface intuitiva com placeholder explicativo para gestores

### Melhorado
- **UserModal**: Campo de senha agora aparece na edição quando usuário é gestor
- **API de alteração de senha**: Suporte tanto para alteração própria quanto administrativa
- **Hook useUsers**: Funções específicas para diferentes tipos de alteração de senha
- **Segurança**: Validação rigorosa de permissões em operações administrativas
- **UX**: Textos explicativos e placeholders mais claros para gestores

### Técnico
- Remoção do componente `Counter` não utilizado no projeto
- Limpeza de exports desnecessários no índice dos atoms
- Melhoria na organização do código e redução do bundle size
- Testes de build e lint passando com sucesso

## [1.4.3] - 2025-06-29

### Refatorado
- **Padronização de Componentes React**
  - Remoção completa do uso de `React.FC` em todos os componentes
  - Migração para padrão `export default function` para melhor consistência
  - Atualização de todas as importações e exportações nos arquivos de índice
  - Correção de tipagem TypeScript em componentes afetados
  - Padronização da estrutura de declaração de componentes

- **Limpeza de Código**
  - Remoção de arquivos temporários desnecessários (.tmp)
  - Melhoria na legibilidade e manutenibilidade do código
  - Garantia de consistência em todo o codebase
  - Build e lint funcionando perfeitamente após refatoração

### Componentes Atualizados
- `Counter`, `Modal`, `UserModal`, `FormContainer`
- `CacheDebug` e todos os componentes de contexto
- Páginas de `login`, `profile` e componentes relacionados
- Arquivos de índice para exportações corretas

## [1.4.2] - 2025-06-29

### Corrigido
- **Sistema de Ativação/Desativação de Usuários**
  - Correção da API PUT `/api/users/[id]` para permitir atualizações parciais
  - Remoção da validação excessivamente restritiva que exigia todos os campos
  - Implementação de validações condicionais para campos específicos
  - Correção do tipo de retorno do hook `updateUser` para boolean consistente
  - Melhoria no tratamento de erros com mensagens específicas da API

- **Componentes Styled Components**
  - Correção de props customizadas passadas para DOM (`isActive`, `isClickable`)
  - Implementação de `shouldForwardProp` para filtrar props não-DOM
  - Eliminação de warnings do React sobre propriedades não reconhecidas

### Melhorado
- **UX da Funcionalidade de Status**
  - Toggle de status agora funciona corretamente via checkbox
  - Span clicável (bolinha + texto) responsivo e funcional
  - Atualizações em tempo real no cache e estatísticas
  - Feedback visual imediato para mudanças de status
  - Cache multicamadas sincronizado após operações

- **Validação de API**
  - Validação inteligente que permite atualizações parciais de campos
  - Verificação de email duplicado apenas quando email está sendo atualizado
  - Mensagens de erro mais específicas e informativas

## [1.4.1] - 2025-06-29

### Corrigido
- **Sistema de Paginação**
  - Correção do cálculo de páginas no hook useUsers
  - Paginação agora usa dados corretos da API
  - Eliminação de erro "nenhum usuário cadastrado" na página 2
  - Integração adequada entre API paginada e interface

## [1.4.0] - 2025-06-29

### Adicionado
- **Módulo Completo de Gestão de Usuários**
  - Página `/dashboard/usuarios` com CRUD completo de usuários
  - Sistema de paginação, busca e filtros avançados
  - Estatísticas em tempo real (total, pesquisadores, agentes, gestão)
  - Seleção múltipla para ações em lote
  - Permissões baseadas em perfil (apenas GESTAO acessa)

- **Componente DataTable Reutilizável**
  - Molecule `DataTable` com paginação, ordenação e busca
  - Suporte a ações por linha e seleção múltipla
  - Responsivo com colunas que se adaptam ao mobile
  - Integração com cache para performance otimizada
  - Storybook completo com exemplos de uso

- **Sistema de Modais Modernos**
  - Componente `Modal` reutilizável com portal e animações
  - `UserModal` para criação/edição de usuários
  - Integração com `FormContainer` para validação robusta
  - Seleção visual de perfis de usuário
  - Tratamento de loading states e fechamento seguro

- **Hook useUsers Avançado**
  - Hook customizado com cache multicamadas
  - Suporte a paginação, busca, filtros e ordenação
  - Operações CRUD completas (criar, atualizar, excluir)
  - Estatísticas automáticas por perfil
  - Integração com API otimizada

- **APIs Robustas de Usuários**
  - Endpoint `/api/users` com GET paginado e POST para criação
  - Endpoint `/api/users/[id]` para operações individuais (GET, PUT, DELETE)
  - Filtros por perfil, status e busca textual
  - Ordenação por qualquer campo
  - Validação de dados e criptografia de senhas
  - Remoção automática de senhas das respostas

### Melhorado
- **Tipos TypeScript Expandidos**
  - Interfaces `CreateUserData` e `UpdateUserData` para operações
  - Tipos de paginação, filtros e configuração de tabelas
  - Interface `User` expandida com novos campos obrigatórios
  - Compatibilidade com componentes genéricos

- **Componente Button Aprimorado**
  - Suporte ao atributo `form` para submit externos
  - Melhor integração com formulários em modals

- **Sistema de Navegação**
  - Rota "Usuários" adicionada ao menu lateral
  - Visibilidade condicionada ao perfil GESTAO
  - Ícones e labels otimizados

- **Cache e Performance**
  - Integração completa com sistema de cache multicamadas
  - Invalidação inteligente após operações CRUD
  - Redução significativa de chamadas à API
  - Loading states otimizados

### Corrigido
- **Compatibilidade de Tipos**
  - Resolução de conflitos de interface User
  - Correção de imports e exports de molecules
  - Ajustes em Storybook para novos tipos
  - Lint e TypeScript errors eliminados

### Documentação
- **Storybook Atualizado**
  - Stories completas para DataTable com casos de uso reais
  - Exemplos de Modal e UserModal
  - Documentação de props e comportamentos

- **Comentários JSDoc**
  - Documentação completa dos hooks e componentes
  - Exemplos de uso e descrições detalhadas
  - Tipos bem documentados com descrições

## [1.3.0] - 2025-06-29

### Adicionado
- **Template Dashboard Unificado**
  - Layout `src/app/dashboard/layout.tsx` com header persistente
  - Estrutura hierárquica `/dashboard/*` para todos os módulos
  - Header fixo compartilhado entre todas as subpáginas
  - Navegação otimizada e experiência de usuário consistente

- **Módulo de Perfil Completo**
  - Página `/dashboard/profile` para edição de perfil do usuário autenticado
  - Formulário inteligente com pré-preenchimento automático dos dados
  - Integração com FormContainer para validação robusta
  - Validação de nome (mínimo 2 caracteres) e email válido
  - Mensagens de sucesso/erro com timeout automático
  - Reset de formulário funcional

- **API de Perfil Dedicada**
  - Endpoint GET `/api/profile` para buscar dados do usuário
  - Endpoint PUT `/api/profile` para atualização de perfil
  - Validação de email único entre usuários
  - Tratamento de erros e respostas padronizadas
  - Remoção automática de dados sensíveis das respostas

- **Hook useProfile Especializado**
  - Hook customizado para operações de perfil
  - Integração com sistema de cache
  - Tratamento de loading e error states

### Melhorado
- **Dashboard Principal Simplificado**
  - Removido header duplicado da página principal
  - Foco apenas no conteúdo (estatísticas e ações rápidas)
  - Melhor performance sem componentes redundantes

- **Sistema de Navegação**
  - Link "Meu Perfil" funcional no menu do usuário
  - Redirecionamento otimizado para `/dashboard/profile`
  - Experiência de navegação fluida entre módulos

- **Organização de Código**
  - Reestruturação de componentes para template pattern
  - Separação clara entre layout e conteúdo
  - Remoção de código duplicado

### Corrigido
- **Warnings de Build**
  - Removidas variáveis não utilizadas (`isLoggingOut`, `formData`)
  - Adicionados comentários ESLint para suppressão de warnings válidos
  - Build limpo sem erros ou warnings

- **Pré-preenchimento de Formulário**
  - Formulário aguarda dados do usuário antes de renderizar
  - Valores iniciais corretamente aplicados no FormContainer
  - Sincronização entre dados do contexto e formulário

### Documentação
- **README Atualizado**
  - Documentação da nova estrutura de template dashboard
  - Instruções de navegação entre módulos
  - Exemplos de uso do sistema de perfil

## [1.2.0] - 2025-06-29

### Adicionado
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

### Corrigido
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

### Melhorado
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

### Técnico
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

### Adicionado
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

### Corrigido
- **Bug Visual do Logout**
  - Header não sumia mais abruptamente antes do redirecionamento
  - Estado isLoggingOut para transição suave
  - Feedback visual: botão "Sair" → "Saindo..."
  - SearchBox e ações desabilitadas durante logout

- **Otimização de Imagens**
  - Substituição de `<img>` por `<LazyLoadImage>` no UserCard
  - Eliminação de warnings do Next.js
  - Lazy loading automático de imagens

### Melhorado
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

### Inicial
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

### Técnico
- **Padrão de Contextos**: AuthProvider → EntitiesProvider → LoaderProvider
- **Estrutura de Dados**: ENUMs centralizados, tipos TypeScript
- **APIs**: /api/users, /api/setores, /api/equipamentos, /api/chamados
- **Middleware**: Controle de autenticação e redirecionamentos

---

## Convenções

### Tipos de Mudança
- **Adicionado** - Novas funcionalidades
- **Corrigido** - Correções de bugs
- **Melhorado** - Melhorias em funcionalidades existentes
- **Técnico** - Mudanças técnicas e refatorações
- **Documentação** - Atualizações na documentação


