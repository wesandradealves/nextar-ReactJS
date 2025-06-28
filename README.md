# BDM Digital - Frontend (Next.js)

Este projeto é o frontend da aplicação web do BDM Digital, desenvolvido em ReactJS com Next.js, consumindo uma API REST headless do WordPress/ACF.

- [Backend](https://github.com/wesandradealves/WEB3-api)

## Sumário
- [Visão Geral](#visão-geral)
- [Requisitos](#requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Rodando com Docker](#rodando-com-docker)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Serviços Disponíveis](#serviços-disponíveis)
- [Context API](#context-api)
- [Hooks Úteis](#hooks-úteis)
- [Renderização Dinâmica de Páginas e Blocks](#renderização-dinâmica-de-páginas-e-blocks)
- [Criando Novos Componentes](#criando-novos-componentes)
- [Padrões de Código](#padrões-de-código)

---

## Visão Geral

- **Framework:** Next.js (React)
- **Estilização:** TailwindCSS, StyledComponents
- **Integração:** Consome API REST do WordPress (headless, ACF)
- **Renderização Dinâmica:** Páginas e blocos são renderizados dinamicamente a partir dos dados vindos do backend.

## Requisitos
- Node.js >= 18.x
- npm, yarn, pnpm ou bun
- Docker (opcional, para rodar em container)

## Instalação e Execução

```bash
# Instale as dependências
npm install
# ou
yarn install
# ou
pnpm install

# Execute em modo desenvolvimento
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Rodando com Docker

```bash
docker build -t bdm-web3 .
docker compose up
```

> O Dockerfile e o docker-compose.yml já estão configurados para rodar a aplicação em ambiente containerizado.

## Estrutura de Pastas

```
src/
  app/                # Páginas e rotas Next.js
    [...slug]/page.tsx    # Página dinâmica que renderiza blocks vindos da API
    media/[...slug]/      # Rota para notícias (single), também renderiza blocks
  components/         # Componentes reutilizáveis (cards, boxes, timeline, etc)
  context/            # Context API (auth, media, settings, spinner)
  hooks/              # Hooks customizados (ex: useMetadata)
  services/           # Serviços para consumo da API REST
  utils/              # Funções utilitárias
  middleware.ts       # Middleware para redirecionamento
```

## Serviços Disponíveis

Todos os serviços estão em `src/services/` e usam Axios para consumir a API REST do WordPress.

- **api.ts**: Instância Axios configurada, com interceptors para loading e autenticação.
- **ContentService.ts**: Busca posts, páginas, conteúdos customizados.
- **mediaService.ts**: Busca dados de mídia (imagens, vídeos) por ID.
- **navigationService.ts**: Busca menus de navegação customizados.
- **pageService.ts**: Busca páginas por slug, incluindo blocks ACF.
- **settingsService.ts**: Busca configurações globais do site.
- **TaxonomyService.ts**: Busca taxonomias (categorias, tags, etc).

### Exemplo de Consumo de Serviço
```ts
import { ContentService } from '@/services/ContentService';
const posts = await ContentService('posts');
```

## Context API

Os contextos ficam em `src/context/` e centralizam estados globais, como autenticação, mídia, configurações e spinner de loading.
- **auth.tsx**: Autenticação de usuário
- **media.tsx**: Estado de mídia global
- **settings.tsx**: Configurações globais
- **spinner.tsx**: Controle de loading global

## Hooks Úteis

- **useMetadata.ts**: Hook para atualizar dinamicamente as tags de metadata da página (SEO, OpenGraph, favicon, etc).

## Renderização Dinâmica de Páginas e Blocks

- A página `src/app/[...slug]/page.tsx` é responsável por buscar e renderizar dinamicamente os blocks definidos no backend WordPress/ACF.
- A rota `src/app/media/[...slug]/page.tsx` faz o mesmo para o content type POST (notícias/single).
- Os blocks são renderizados como componentes React, de acordo com o tipo e dados vindos da API. Note que o id/machine_name do block **deve** ser o mesmo
do componente que você deseja renderizar em `src/components/`.

## Como criar um Block

```
    git clone git@github.com:wesandradealves/WEB3-api.git
```

- Acesse o tema `bdm-digital-website-api-theme`.
- Edite `bdm-digital-website-api-theme\functions.php`

Nesse snippet, registre um novo block onde `name`, deve ser o mesmo nome do componente criado em `\src\components` (Note que para ser um **bloco** vindo da api crie a pasta com o seguinte formato: `\src\components\{{name}}\index.tsx`).

- A lógica para renderizaçao dinamica desses blocos pode ser encontrada em `src\components\DynamicComponent`

```
    function my_acf_blocks_init() {
        if( function_exists('acf_register_block_type') ) {
            $blocks = [
                ... (demais objetos de block)

                (object) [
                    'name'        => 'hero',
                    'title'       => __('Hero'),
                    'description' => __('Hero Component'),
                    'category'    => 'rest-api',
                    'icon'        => '',
                    'keywords'    => ['hero', 'acf', 'rest'],
                    'supports'    => [
                        'align' => true,
                        'jsx'   => true, 
                    ],
                ],

                ... (demais objetos de block)
            ];

            foreach ($blocks as $block) {
                acf_register_block_type(array(
                    'name'              => $block->name,
                    'title'             => $block->title,
                    'description'       => $block->description,
                    'render_template'   => get_template_directory() . '/templates/blocks.php',
                    'category'          => $block->category,
                    'icon'              => $block->icon,
                    'keywords'          => $block->keywords,
                    'supports'          => $block->supports,
                ));
            }
        }
    }
```

- Os campos customizados devem ser registrados em ([http://localhost:8000/wp-admin/edit.php?post_type=acf-field-group])
- Adicionar novo
- Regras - `contexto` mostrar este grupo de campos se `condicao` `valor`.

Escolha o contexto se for aparecer em Bloco, Menu, Pages, Etc.
Para adicionar a um novo componente `(block)`, escolha Bloco.

**De preferencia ao tipo de campo `clone`, e em Campos, escolha fields já criados, para reutilizar campos já criados e nao criar novas nomenclaturas sem necessidade.**

Crie somente campos novos se houver necessidade.

## Criando Novos Componentes

1. Crie uma nova pasta em `src/components/` com o nome do componente.
2. Siga o padrão dos componentes existentes: arquivo principal (index.tsx), arquivo de estilos (styles.tsx), tipagem (typo.ts) se necessário.
3. Use props tipadas e, se necessário, integre com os serviços ou contextos.
4. Exporte o componente por padrão.

### Exemplo de Estrutura
```
components/
  meucomponente/
    index.tsx
    styles.tsx
    typo.ts
```

## Padrões de Código

- Utilize sempre tipagem TypeScript (evite `any`)
- Siga o padrão de componentes funcionais
- Use hooks para lógica de estado e efeitos
- Utilize Context API para estados globais
- Estilize com TailwindCSS e styled-components quando necessário
- Siga o padrão de importação absoluta (`@/services/`, `@/components/`, etc)
- Use ESLint e Prettier para manter o código limpo

**Esse projeto usa `Husk` para testar os commits antes de serem enviados. Certifique-se que todo commit esteja corrigido com os erros do LINT, afim de evitar quebra de build nos ambientes de produçao.**

---

## Observações
- O projeto está preparado para integração contínua e deploy em ambiente Docker.
- O consumo da API REST do WordPress é feito de forma desacoplada, permitindo flexibilidade para evoluções futuras.
- Para dúvidas sobre blocks ou integração com o backend, consulte a equipe de backend ou o README do projeto WordPress.
