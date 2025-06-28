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
- [Funcionalidades](#funcionalidades)
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
- [Framer Motion](https://www.framer.com/motion/) - Animações

### **Backend**
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - API interna
- [Axios](https://axios-http.com/) - Cliente HTTP
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

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Execute o projeto em desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

### 4. Acesse a aplicação
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
│   │   └── index.ts
│   └── middleware.ts           # Middleware do Next.js
├── eslint.config.mjs           # Configuração ESLint
├── next.config.js              # Configuração Next.js
├── tailwind.config.ts          # Configuração Tailwind
└── tsconfig.json               # Configuração TypeScript
```

---

## ✨ Funcionalidades

### **🔐 Autenticação**
- Login com email/senha
- 3 perfis de usuário: Pesquisador, Agente, Gestão
- Sistema de permissões granular
- Persistência no localStorage

### **👥 Gestão de Usuários**
- CRUD completo
- Perfis com permissões específicas
- Validação de dados

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
- Estatísticas em tempo real
- Distribuição por status/tipo
- Métricas por agente
- Visualizações gráficas

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
POST   /api/users
Body: { nome: string, email: string, perfil: PerfilUsuario }
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

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

**Desenvolvido para desafio técnico**
- Sistema de manutenção científica da Antártica
- Stack: Next.js, TypeScript, Styled Components, Tailwind
- Arquitetura moderna com contextos e APIs internas

---

## 🧊 Sobre a Antártica

Este sistema foi projetado considerando as condições únicas de uma estação científica antártica:
- **Ambientes extremos** exigem manutenção rigorosa
- **Isolamento** requer sistemas autônomos
- **Recursos limitados** demandam gestão eficiente
- **Missão científica** não pode ser comprometida

---

*🐧 "Na Antártica, cada equipamento é vital para a sobrevivência e para a ciência!"*
