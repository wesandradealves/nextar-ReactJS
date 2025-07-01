# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.9.3] - 2025-07-01

### Adicionado
- **Formulário Inline para Peças Utilizadas**
  - Interface moderna para gerenciar peças utilizadas no modal de chamados
  - Substituição do prompt/alert nativo por formulário inline usando componentes atoms
  - Campos de nome da peça e quantidade com validação robusta
  - Botões para adicionar, editar, salvar e cancelar peças
  - Lista dinâmica de peças com ações individuais (editar/remover)
  - Integração completa com o design system usando Input e Button atoms

- **Sistema de Permissões para Peças Utilizadas**
  - Controle granular de edição baseado no perfil do usuário e status do chamado
  - Gestores podem editar/remover peças em chamados concluídos
  - Agentes só podem editar/adicionar peças enquanto o chamado não está concluído
  - Toast informativo quando tentativa de edição é bloqueada por permissões
  - Mensagem clara orientando sobre limitações por perfil

### Melhorado
- **Experiência do Usuário (UX)**
  - Remoção completa de alert/prompt nativos em favor de interface moderna
  - Formulário responsivo e intuitivo para gestão de peças
  - Feedback visual imediato para ações de adicionar, editar e remover
  - Validação em tempo real com mensagens de erro específicas
  - Interface consistente com o resto da aplicação

- **Validação de Formulário de Peças**
  - Campo nome da peça obrigatório (mínimo 2 caracteres)
  - Quantidade deve ser um número positivo maior que zero
  - Prevenção de submissão com dados inválidos
  - Feedback visual para campos com erro
  - Limpeza automática do formulário após operações bem-sucedidas

- **Gestão de Estado de Peças**
  - Estado local otimizado para adicionar, editar e remover peças
  - Sincronização adequada com dados do chamado
  - Prevenção de estados inconsistentes durante edição
  - Limpeza de formulário ao abrir/fechar modal ou trocar chamado
  - Cancelamento de edição retorna ao estado anterior

### Corrigido
- **Componente Input Types**
  - Correção de propriedades TypeScript para evitar erros de lint
  - Remoção de props não suportadas que causavam warnings
  - Tipagem adequada para componentes atoms
  - Compatibilidade com validação de formulários

- **Fluxo de Edição de Peças**
  - Resolução de bugs na alternância entre modo visualização e edição
  - Correção de estado de formulário ao cancelar edição
  - Sincronização adequada entre lista de peças e formulário
  - Prevenção de perda de dados durante operações

### Técnico
- **Arquitetura de Componentes**
  - Uso exclusivo de componentes atoms (Input, Button) para consistência
  - Separação clara entre lógica de negócio e apresentação
  - Estados de formulário bem definidos e controlados
  - Funções de manipulação de peças organizadas e reutilizáveis

- **Manutenibilidade**
  - Código limpo e bem documentado para gestão de peças
  - Padrões consistentes com o resto da aplicação
  - Facilidade de manutenção e extensão futura
  - Remoção de código legacy (prompt/alert nativos)

## [1.9.2] - 2025-06-30

### Adicionado
- **Data de Execução Obrigatória ao Finalizar Chamados**
  - Campo "Data de Execução" obrigatório quando o status do chamado é alterado para "Concluído"
  - Interface de seleção de data com validações robustas:
    - Data não pode ser no futuro
    - Data não pode ser anterior à data de abertura do chamado
    - Campo obrigatório durante finalização
  - Exibição da data de execução na visualização de detalhes do chamado
  - Integração completa com o fluxo de finalização existente

### Melhorado
- **Validação de Finalização de Chamados**
  - Validação aprimorada para campos obrigatórios ao concluir um chamado
  - Mensagens de erro específicas e claras para cada tipo de validação
  - Experiência do usuário melhorada com feedback imediato
  - Prevenção de dados inconsistentes (datas inválidas, execução sem data)

- **Controle de Edição por Perfil de Usuário**
  - Gestores agora podem editar chamados concluídos para correções administrativas
  - Agentes são bloqueados de editar chamados finalizados com toast informativo
  - Mensagem clara orientando agentes a contactar gestão para ajustes
  - Flexibilidade administrativa mantendo controle de qualidade
  - **Toast informativo para chamados finalizados**: Aviso claro quando usuário tenta editar chamado já concluído

- **Interface de Finalização**
  - Campo de data estilizado de forma consistente com o design system
  - Texto de ajuda contextual para orientar o usuário
  - Ordenação lógica dos campos: Data de Execução → Observações → Peças
  - Validação em tempo real com feedback visual
  - **Remoção de avisos visuais estáticos** em favor de feedback dinâmico via toast

### Corrigido
- **Fluxo de Dados na Finalização**
  - Propagação correta da data de execução através das camadas da aplicação
  - Sincronização adequada entre estado local e dados de formulário
  - Atualização das interfaces TypeScript para incluir `dataExecucao`
  - Preservação da data de execução ao visualizar chamados finalizados
  - **Correção crítica**: Campo `dataExecucao` agora é corretamente incluído no payload de atualização
  - **Bug fix**: Resolvido problema onde alterações na data de execução não eram salvas na API

### Técnico
- **Atualização de Tipos TypeScript**
  - Interface `UpdateChamadoData` expandida com campo `dataExecucao`
  - Interface `ChamadoFormData` atualizada para suportar data de execução
  - Validação de tipos consistente em todo o fluxo de dados
  - Compatibilidade com dados legados (chamados sem data de execução)

- **Validação de Business Rules**
  - Implementação de regras de negócio para datas de execução
  - Prevenção de inconsistências temporais nos dados
  - Integração com sistema de toast para feedback de erro
  - Manutenção da experiência do usuário durante validação

### Quebras de Compatibilidade
- **Campo Obrigatório na Finalização**
  - Data de execução agora é obrigatória ao finalizar chamados (status "concluído")
  - Chamados não podem mais ser finalizados sem informar quando foram executados
  - Interfaces de API atualizadas para incluir validação da data de execução
  - Fluxo de finalização requer campo adicional obrigatório

## [1.9.1] - 2025-06-30

### Adicionado
- **Coluna "Criado em" na Tabela de Chamados**
  - Nova coluna exibindo a data de criação dos chamados (`dataAbertura`)
  - Formatação inteligente com tempo relativo para datas recentes:
    - "Agora" ou "Xmin atrás" para criações muito recentes
    - "Xh atrás" para criações do dia atual
    - "Ontem" para criações do dia anterior
    - "X dias atrás" para última semana
    - Formato brasileiro padrão (DD/MM/AA ou DD/MM/AAAA) para datas mais antigas
  - Largura otimizada (120px) para exibição consistente

### Melhorado
- **Ordenação Automática por Data de Criação**
  - Chamados agora são automaticamente ordenados por data de criação (mais recentes primeiro)
  - Ordenação aplicada localmente na interface após aplicação de filtros
  - Performance otimizada com ordenação em memória e memoização
  - Experiência de usuário aprimorada: chamados mais urgentes/recentes aparecem primeiro

- **Sistema de Ordenação Clicável na Tabela**
  - Coluna "Criado em" agora é ordenável com clique no cabeçalho
  - Indicadores visuais de direção da ordenação (crescente/decrescente)
  - Colunas "Tipo", "Status" e "Prioridade" também ordenáveis
  - Estado de ordenação persistente durante navegação
  - Ordenação inteligente por data (timestamp) para precisão temporal

- **Experiência Visual na Listagem**
  - Melhor percepção temporal dos chamados com coluna de data ordenável
  - Facilitação da identificação de chamados recentes vs antigos
  - Layout da tabela otimizado com nova coluna posicionada estrategicamente
  - Controles de ordenação intuitivos e responsivos

### Corrigido
- **Campo de Busca na Tabela de Chamados**
  - Correção do problema onde não era possível digitar no campo de busca
  - Adicionada prop `onChange` faltante no SearchBox para permitir entrada de texto
  - Campo de busca agora funciona corretamente para filtrar por descrição, título e tipo
  - Evento de teclado corrigido para permitir busca com Enter

## [1.9.0] - 2025-06-30

### Adicionado
- **Separação de Campos Título e Descrição nos Chamados**
  - Implementação de campo `titulo` separado da `descricao` na modal de chamados
  - Suporte completo para chamados legados (usando descrição como título)
  - FormContainer atualizado com dois campos distintos: "Título do Chamado" e "Descrição Detalhada"
  - Validação específica para cada campo (título: 5-100 chars, descrição: 10-500 chars)
  - Exibição de ambos os campos na tabela de chamados com truncamento inteligente

- **Sistema de Toast Notifications**
  - Feedback visual aprimorado com toast notifications para todas as ações
  - Mensagens específicas para validação de campos obrigatórios
  - Notificações de sucesso para criação/edição de chamados
  - Tratamento de erros com mensagens claras e acionáveis

- **Validações Avançadas com Feedback Visual**
  - Validação de campos obrigatórios antes do envio (tipo, prioridade, setor)
  - Validação específica para observações de finalização (mínimo 10 caracteres)
  - Prevenção de fechamento da modal em caso de erro para correção
  - Mensagens de erro contextuais com orientações para o usuário

### Melhorado
- **Performance e Sincronização**
  - Key dinâmica no FormContainer para forçar re-render quando necessário
  - Otimização do cache com invalidação inteligente após operações
  - Sincronização aprimorada entre estados locais e FormContainer
  - Redução de re-renders desnecessários com dependências otimizadas

- **Busca e Filtros**
  - Filtro de busca atualizado para incluir campo `titulo` além de descrição e tipo
  - Performance melhorada na busca com indexação de múltiplos campos
  - Cache otimizado para filtros com invalidação por tags

- **Tratamento de Dados Legados**
  - Compatibilidade total com chamados antigos (sem campo título)
  - Migração automática: descrição vira título, campo descrição fica vazio
  - Lógica robusta para evitar duplicação de conteúdo
  - Exibição inteligente na tabela baseada na presença do campo título

### Corrigido
- **Problemas de Cache e Estado**
  - Correção de problemas de sincronização entre FormContainer e estados da modal
  - Resolução de conflitos de cache ao alternar rapidamente entre chamados
  - Invalidação adequada do cache após submissão bem-sucedida
  - Prevenção de dados obsoletos na interface

- **Fluxo de Validação**
  - Correção do fluxo onde título voltava ao valor antigo após edição
  - Resolução de problemas de validação não exibidos ao usuário
  - Correção de dependências em hooks para evitar warnings do ESLint
  - Tratamento adequado de erros com feedback visual

### Quebras de Compatibilidade
- **Estrutura de Dados de Chamados**
  - Adição do campo `titulo` na interface de chamados
  - Tipos TypeScript atualizados: `Chamado`, `CreateChamadoData`, `UpdateChamadoData`, `ChamadoFormData`
  - Modal de chamados agora requer ambos os campos título e descrição
  - API endpoints atualizados para suportar o novo campo

## [1.8.3] - 2025-06-30

### Adicionado
- **Workflow de Status Completo para Chamados**
  - Implementação do sistema de transições controladas: Aberto → Em Progresso → Concluído
  - ENUMs centralizados para status com workflow de validação (`STATUS_WORKFLOW`, `STATUS_LABELS`)
  - Funções utilitárias para validação de transições e requisitos de finalização
  - Opções de status dinâmicas baseadas no estado atual do chamado
  - Permissões granulares: Gestão pode alterar qualquer status, Agente apenas dos seus chamados
  - Campos obrigatórios para finalização (observações com mínimo 10 caracteres)
  - Interface inteligente com mensagens contextuais por status

### Melhorado
- **Validações de Formulário**
  - Validação rigorosa para status "CONCLUÍDO" com campos obrigatórios
  - Prevenção de edição em chamados finalizados (estado imutável)
  - Interface específica por status com campos condicionais
  - Feedback visual aprimorado para transições de status
  
- **Permissões e Segurança**
  - Controle granular de quem pode alterar status (Gestão + Agente atribuído)
  - Proteção contra pulo de etapas no workflow
  - Chamados finalizados completamente protegidos contra edição
  - Mensagens informativas sobre permissões por perfil

- **Experience do Usuário**
  - Labels padronizados usando ENUMs para consistência
  - Aviso visual destacado para chamados finalizados
  - Mensagens contextuais sobre próximas ações possíveis
  - Interface responsiva e intuitiva para gestão de status

## [1.8.2] - 2025-06-30

### Corrigido
- **Loop Infinito no Hook useChamados**
  - Correção definitiva do erro "Maximum update depth exceeded" no hook `useChamados`
  - Estabilização da função `fetchChamados` removendo dependência desnecessária de `filters`
  - Separação de effects para carregamento inicial e reação a mudanças de filtros
  - Prevenção de recriação desnecessária de funções a cada mudança de estado
  - Otimização do gerenciamento de cache e invalidação de dados

### Melhorado
- **Performance e Estabilidade**
  - Hook `useChamados` agora é completamente estável sem loops infinitos
  - Filtros funcionam corretamente sem causar re-renders desnecessários
  - Gestão de cache mais eficiente e otimizada
  - Funcionalidade completa de CRUD mantida com melhor performance
  - Interface mais responsiva durante operações de filtragem

## [1.8.1] - 2025-06-30

### Corrigido
- **Conflito Visual de Loading nas DataTables**
  - Remoção do spinner visual das DataTables que conflitava com o spinner central da aplicação
  - Mantido apenas o skeleton loading para melhor experiência do usuário durante carregamento
  - Loading visual agora é consistente em toda a aplicação
  - Eliminação de elementos visuais redundantes que causavam confusão na interface

### Melhorado
- **Consistência Visual**
  - Interface de loading unificada usando apenas o spinner central global
  - Skeleton loading preservado nas DataTables para feedback visual durante fetch de dados
  - Experiência do usuário mais limpa e profissional

## [1.8.0] - 2025-06-30

### Corrigido
- **Arquitetura CRUD de Chamados Padronizada**
  - Refatoração completa do hook `useChamados` seguindo o padrão do `useUsers`
  - Implementação de operações CRUD via API direta com gerenciamento de toast/exceções
  - Criação de rotas API RESTful: `/api/chamados/[id]` para operações individuais
  - Correção do fluxo de loading e fechamento do modal de chamados
  - Modal de chamados agora fecha apenas após sucesso da operação
  - Botão "Atualizar" exibe loading corretamente durante a operação
  - Toast de feedback automático integrado no hook (sucesso e erro)
  - Atualização automática da lista após operações CRUD

- **APIs de Chamados Reestruturadas**
  - Nova rota `/api/chamados/[id]` para operações PUT/DELETE individuais
  - Separação de responsabilidades: `/api/chamados` para GET/POST
  - Validação adequada de dados de entrada nas APIs
  - Tratamento de erros consistente com respostas JSON estruturadas
  - Suporte completo a operações CRUD via fetch API

- **Tipos TypeScript Centralizados**
  - Adição de `CreateChamadoData` e `UpdateChamadoData` em `/types/index.ts`
  - Remoção de definições duplicadas de tipos no hook
  - Importações consistentes em todo o projeto
  - Tipagem forte para operações CRUD

### Melhorado
- **Consistência de Arquitetura**
  - Alinhamento da arquitetura de chamados com a de usuários
  - Hook unificado gerenciando tanto dados quanto operações CRUD
  - Padrão consistente de tratamento de exceções e feedback
  - Eliminação do uso misto de contexto de entidades + hook

- **Experiência do Usuário**
  - Modal não fecha mais prematuramente durante operações
  - Loading visual claro durante atualizações
  - Feedback imediato de sucesso/erro via toast
  - Prevenção de fechamento acidental durante operações (closeOnOverlayClick/Esc)

## [1.7.0] - 2025-06-29

### Adicionado
- **Sistema CRUD de Chamados Completo**
  - Implementação da listagem, criação, edição e exclusão de chamados
  - Modal unificado para visualização, edição e criação de chamados
  - Filtros avançados por status, prioridade, setor e agente responsável
  - Filtro especial "sem agente" para chamados não atribuídos
  - Modal responsivo com transição entre modos (view → edit)
  - Integração com dados de equipamentos, setores e usuários
  - Operações CRUD completas com feedback visual (toast)

- **Componente Select Atômico**
  - Novo componente Select padronizado no design system
  - Estilo consistente com outros componentes atômicos
  - Stories para Storybook com documentação completa
  - TypeScript interfaces e tipos bem definidos

### Melhorado
- **Hook useChamados Refatorado**
  - Eliminação de loops infinitos em filtros e dependências
  - Dependências estáveis nos useEffect e useCallback
  - Performance otimizada para atualizações de estado
  - Lógica robusta para filtro "sem agente" reconhecendo casos: undefined, null, "", "n/a", "não atribuído", "sem agente"

- **Feedback Visual e UX**
  - Toast notifications em todas as operações CRUD
  - Atualização imediata da interface após operações
  - Loading states e spinners para operações assíncronas
  - Validação de formulários com mensagens de erro claras
  - Transição suave entre modos do modal (visualização → edição)

- **Edição de Chamados Implementada**
  - Botão "Editar" funcional no modo de visualização do modal
  - Função `onModeChange` para transição entre modos (view → edit)
  - Validação de permissões para edição baseada no perfil do usuário
  - Interface unificada para criação, edição e visualização
  - Manutenção do estado do chamado durante transições de modo

- **Padronização de Componentes**
  - Substituição de selects HTML nativos por componente atômico Select
  - Consistência visual em todos os filtros e formulários
  - Estilo unificado seguindo o design system do projeto

### Técnico
- **Arquitetura de Dados**
  - Dados de teste atualizados para cobrir todos os cenários de filtro
  - Estrutura JSON melhorada para chamados, equipamentos e setores
  - Relacionamentos consistentes entre entidades

- **Context e Estado**
  - Integração com EntityContext para operações CRUD assíncronas
  - Gerenciamento de estado otimizado com React hooks
  - Cache inteligente para evitar requisições desnecessárias
  - Implementação da função `onModeChange` no ChamadoModal
  - Estados de modal unificados (create, edit, view) com transições suaves

## [1.6.5] - 2025-06-29

### Melhorado
- **Animações CountUp na Página de Usuários**
  - Implementação do react-countup nas estatísticas da página de usuários
  - Animações suaves com durações escalonadas (1.0s a 1.8s) para cada métrica
  - Separador de milhares configurado para melhor legibilidade
  - Consistência visual com animações do dashboard principal
  - Experiência do usuário aprimorada com feedback visual atrativo

### Técnico
- **Otimização Visual**
  - Import do CountUp adicionado na página de usuários
  - Configuração individual de duration para cada estatística
  - Manutenção das cores específicas para status (ativos/inativos)
  - Integração seamless com componentes styled existentes

## [1.6.3] - 2025-06-29log

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.6.4] - 2025-06-29

### Melhorado
- **Animações nas Estatísticas da Página de Usuários**
  - Implementação do CountUp nas estatísticas da página de gestão de usuários
  - Animações suaves com durações variadas para cada métrica (1.0s a 1.8s)
  - Separador de milhares (.) consistente com o padrão brasileiro
  - Experiência visual aprimorada similar ao dashboard principal
  - Feedback visual mais atrativo para estatísticas de total, ativos, inativos e perfis

### Técnico
- **Integração com react-countup**
  - Import do CountUp adicionado na página de usuários
  - Configuração de durações otimizadas para cada tipo de estatística
  - Mantidas as cores específicas para estatísticas de ativos (verde) e inativos (vermelho)
  - Compatibilidade total com sistema existente de estatísticas

## [1.6.3] - 2025-06-29log

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.6.4] - 2025-06-29

### Corrigido
- **Bug de Estatísticas Zeradas - Navegação Entre Páginas**
  - Estatísticas não apareciam zeradas ao navegar da tela inicial para usuários
  - Hook `useUsers` agora carrega `allUsers` independentemente na inicialização
  - `useEffect` separado para `fetchAllUsers` garante dados sempre disponíveis
  - Cache de `allUsers` com TTL de 10 minutos para melhor persistência
  - Função `refresh` atualizada para recarregar tanto dados filtrados quanto totais

### Melhorado
- **Hook useUsers - Gestão de Estado Aprimorada**
  - Função `fetchAllUsers` separada da `fetchUsers` para melhor controle
  - Dois `useEffect` independentes: um para dados totais, outro para filtrados
  - Cache mais robusto com chaves separadas (`users_all` vs dados filtrados)
  - Estatísticas sempre consistentes independente do ciclo de vida do componente
  - Melhor tratamento de erro para busca de dados completos

### Técnico
- **Arquitetura de Cache Otimizada**
  - Separação clara entre cache de estatísticas e cache de dados filtrados
  - `fetchAllUsers` executado na montagem do componente via `useEffect`
  - `refresh` invalidada ambos os caches e recarrega dados completos
  - TTL aumentado para 10 minutos nos dados de estatísticas
  - Tratamento de erro melhorado para requisições de dados completos

## [1.6.3] - 2025-06-29

### Corrigido
- **SearchBox Component - Busca Vazia**
  - Removido `type="search"` do input para eliminar o "X" nativo do browser
  - Permitir execução de busca mesmo com campo vazio para retornar todos os resultados
  - Botão de busca não fica mais desabilitado quando campo está vazio
  - Função `handleClear` agora executa busca vazia automaticamente
  - CSS adicionado para remover controles nativos de busca em todos os browsers

- **Estatísticas de Usuários - Dados Corretos**
  - Estatísticas agora mostram dados do banco completo, não dos usuários filtrados
  - Hook `useUsers` separou dados filtrados (`users`) dos dados totais (`allUsers`)
  - Nova função `userStats` calculada com base em todos os usuários do sistema
  - Cache otimizado para dados completos (5 minutos) separado do cache de filtros
  - Estatísticas permanecem constantes independente de busca ou filtros aplicados

### Melhorado
- **Hook useUsers Aprimorado**
  - Estado `allUsers` adicionado para armazenar todos os usuários do sistema
  - Busca inicial de todos os usuários para cálculo de estatísticas precisas
  - Cache inteligente com chaves separadas para dados completos e filtrados
  - Função `userStats` retornada diretamente do hook para reuso
  - Invalidação de cache otimizada para busca vazia

- **UX do Sistema de Busca**
  - Busca vazia agora funciona corretamente em todos os cenários
  - Botão "limpar" executa busca automaticamente para mostrar todos os dados
  - Remoção de comportamentos confusos com campo de busca bloqueado
  - Interface mais intuitiva e previsível para usuários finais

### Técnico
- **Refatoração de Componentes**
  - Página de usuários usa `userStats` do hook em vez de cálculo local
  - Remoção de código duplicado para cálculo de estatísticas
  - Melhor separação de responsabilidades entre hook e componente
  - Otimização de renders com dados já calculados no hook

## [1.6.2] - 2025-06-29

### Corrigido
- **Filtro de Busca no DataTable de Usuários**
  - Correção do comportamento de busca: ao limpar o campo, agora retorna todos os usuários
  - Filtro funcionava corretamente ao pesquisar, mas não retornava dados ao limpar
  - Implementação de lógica condicional no hook `useUsers` para busca vazia
  - Melhoria na UX: usuários podem ver todos os dados novamente após limpar busca
  - Cache adequadamente invalidado durante operações de busca e limpeza

### Técnico
- **Hook useUsers Aprimorado**
  - Condição `if (searchTerm && searchTerm.trim())` para aplicar filtros apenas quando necessário
  - Quando `searchTerm` é vazio, todos os usuários são retornados da API
  - Sincronização entre estado local `searchTerm` e parâmetros de query
  - Comportamento consistente entre busca via API e filtros locais

## [1.6.1] - 2025-06-29

### Adicionado
- **Logout Automático Após Alteração de Senha**
  - Logout automático por segurança quando usuário altera sua própria senha
  - Toast de aviso com contador regressivo de 5 segundos
  - Mensagem explicativa sobre desconexão por motivos de segurança
  - Redirecionamento automático para página de login após logout
  - Prevenção de sessões comprometidas após mudança de credenciais

### Melhorado
- **Hook useChangePassword**
  - Função `executeAutoLogout()` com contador visual
  - Integração com contexto de autenticação para logout seguro
  - Toasts informativos durante o processo de desconexão
  - UX aprimorada com feedback claro sobre ações de segurança

### Técnico
- **Segurança Aprimorada**
  - Implementação de best practice: logout após alteração de senha
  - Contador regressivo não-bloqueante com setTimeout
  - Feedback visual contínuo durante processo de logout
  - Integração seamless com sistema de toasts existente

## [1.6.0] - 2025-06-29

### Adicionado
- **Alteração de Senha na Página de Perfil**
  - Seção "Segurança" integrada na página de perfil existente
  - Formulário dedicado para alteração de senha com 3 campos
  - Hook `useChangePassword` com validação robusta e feedback via toasts
  - Integração com endpoint existente `/api/users/change-password`
  - Validação de senha atual obrigatória para segurança
  - Nova senha com mínimo de 6 caracteres e confirmação
  - Mensagens de erro específicas para diferentes cenários

### Melhorado
- **Página de Perfil Reorganizada**
  - Estrutura em seções: "Informações da Conta", "Dados Pessoais" e "Segurança"
  - Novos componentes de estilo: `ProfileSection`, `SectionTitle`, `SectionDescription`
  - Interface mais organizada e intuitiva
  - Formulários separados para diferentes tipos de operação
  - Feedback visual aprimorado com mensagens de sucesso específicas

### Técnico
- **Validação Avançada de Senha**
  - Verificação de senha atual obrigatória
  - Validação de força da nova senha (mínimo 6 caracteres)
  - Confirmação de senha com verificação de igualdade
  - Prevenção de reutilização da senha atual
  - Tratamento de erros da API com mensagens específicas

- **UX e Interface**
  - Toasts integrados com react-toastify para feedback
  - Estilos responsivos e consistentes
  - Campos de senha com type="password" para segurança
  - Reset de formulário após alteração bem-sucedida
  - Mantém compatibilidade com estrutura existente

## [1.5.1] - 2025-06-29

### Migrado
- **Sistema de Notificações para react-toastify**
  - Remoção completa do sistema de toast customizado
  - Integração com `react-toastify` para notificações padronizadas
  - Novo hook `useToast` simplificado com helpers pré-configurados
  - Configuração automática do `ToastContainer` no layout global
  - CSS do react-toastify incluído automaticamente

### Removido
- **Sistema de Toast Customizado**
  - Componente `Toast` customizado removido
  - Contexto `ToastProvider` e `useToastHelpers` removidos
  - Arquivos de estilo e tipos do toast customizado excluídos
  - Limpeza de importações e exports desnecessários

### Melhorado
- **Hook useUsers**: Mantém todas as funcionalidades de feedback
- **Performance**: Redução do bundle size com remoção de código desnecessário
- **Consistência**: Notificações padronizadas em todo o sistema
- **Manutenibilidade**: Menos código customizado para manter

### Técnico
- Atualização das importações em todos os módulos afetados
- Configuração do react-toastify no layout principal
- Testes de build e lint passando com sucesso
- Funcionalidades de toast mantidas nos fluxos CRUD de usuários

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


