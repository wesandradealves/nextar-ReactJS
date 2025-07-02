# Guia de Implementação do Tailwind CSS com Styled Components

Este guia define a abordagem para implementar o Tailwind CSS junto com Styled Components em toda a aplicação.

## Princípios Básicos

1. **Manter os componentes styled-components** para estrutura básica e lógica de estilo
2. **Usar classes Tailwind via className** para:
   - Layout (grid, flex)
   - Espaçamento (margins, padding, gaps)
   - Cores (background, texto, bordas)
   - Tipografia (tamanhos, pesos, cores)
   - Responsividade (breakpoints)
   - Estados (hover, focus, active)

## Padrão de Implementação

### Estrutura de Componentes

```tsx
// Manter os styled-components
import { StyledComponent } from './styles';

// Adicionar classes Tailwind via className
<StyledComponent 
  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 text-gray-800 dark:text-gray-200"
>
  {/* Conteúdo */}
</StyledComponent>
```

### Sistema de Cores

Padronizar o uso de cores com as classes do Tailwind:

- **Cores Principais:**
  - Azul: `text-blue-600`, `bg-blue-500`, `border-blue-400`
  - Roxo: `text-purple-600`, `bg-purple-500`
  - Cinza: `text-gray-700`, `bg-gray-100`

- **Estados:**
  - Sucesso: `text-green-600`, `bg-green-100`
  - Erro: `text-red-600`, `bg-red-50`
  - Alerta: `text-amber-600`, `bg-amber-50`
  - Info: `text-blue-600`, `bg-blue-50`

- **Modo Escuro:**
  - Sempre adicionar classes dark: para suporte ao modo escuro
  - Ex: `bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200`

### Espaçamento

Usar o sistema de espaçamento do Tailwind para manter consistência:

- **Margens e Padding:**
  - `m-4`, `mt-6`, `mb-8`, `mx-auto`
  - `p-4`, `pt-6`, `pb-8`, `px-4`

- **Gap em Grids e Flex:**
  - `gap-2`, `gap-4`, `gap-x-2`, `gap-y-4`

### Responsividade

Organizar as classes do menor para o maior breakpoint:

```tsx
<Container className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
```

Breakpoints padrão do Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Tipografia

Padronizar tamanhos de fonte e cores:

- **Tamanhos:**
  - Títulos: `text-2xl`, `text-3xl`, `text-4xl`
  - Corpo: `text-base`, `text-lg`
  - Pequeno: `text-sm`, `text-xs`

- **Pesos:**
  - `font-normal`, `font-medium`, `font-semibold`, `font-bold`

### Exemplo de Componente Completo

```tsx
<Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-5 m-3">
  <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
    <Title className="text-xl font-semibold text-gray-800 dark:text-gray-200">
      Título do Card
    </Title>
  </CardHeader>
  <CardBody className="space-y-4">
    <Text className="text-gray-600 dark:text-gray-300">
      Conteúdo do card aqui
    </Text>
    <Stats className="grid grid-cols-2 gap-4 mt-4">
      <StatItem className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
        <StatValue className="text-2xl font-bold text-blue-600 dark:text-blue-300">42</StatValue>
        <StatLabel className="text-sm text-blue-500 dark:text-blue-400">Total</StatLabel>
      </StatItem>
    </Stats>
  </CardBody>
</Card>
```

## Componentes Comuns

### Botões

```tsx
<Button 
  className="transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-300"
  // ...demais props
/>
```

### Inputs

```tsx
<Input
  className="focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-300 transition-all duration-200 shadow-sm"
  // ...demais props
/>
```

### Cards e Containers

```tsx
<Container className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 m-3">
  {/* Conteúdo */}
</Container>
```

## Conversão Gradual

A implementação será feita gradualmente:

1. Componentes atômicos (Button, Input, Select, etc.)
2. Componentes moleculares (Navigation, DataTable, etc.)
3. Páginas e layouts (Dashboard, Chamados, etc.)

Durante a conversão, manter a compatibilidade com os styled-components existentes para evitar quebrar a aplicação.
