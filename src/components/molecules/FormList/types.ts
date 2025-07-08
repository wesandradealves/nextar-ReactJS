import React from 'react';

/**
 * Item da lista
 */
export interface ListFormItem {
  /** ID único do item */
  id: string;
  /** Título/nome principal */
  title: string;
  /** Subtítulo/descrição */
  subtitle?: string;
  /** Dados adicionais */
  data?: Record<string, unknown>;
}

/**
 * Campo para adicionar novo item
 */
export interface NewItemField {
  /** Chave do campo */
  key: string;
  /** Label do campo */
  label: string;
  /** Placeholder */
  placeholder: string;
  /** Tipo do campo */
  type?: 'text' | 'number' | 'email';
  /** Se é obrigatório */
  required?: boolean;
  /** Validação customizada */
  validate?: (value: string) => string | null;
}

/**
 * Props do FormList
 */
export interface FormListProps {
  /** Título da lista */
  title?: string;
  /** Lista de itens */
  items: ListFormItem[];
  /** Callback para atualizar items */
  onChange: (items: ListFormItem[]) => void;
  /** Campos para adicionar novo item */
  newItemFields: NewItemField[];
  /** Texto do botão de adicionar */
  addButtonText?: string;
  /** Texto quando a lista está vazia */
  emptyText?: string;
  /** Ícone quando a lista está vazia */
  emptyIcon?: string;
  /** Se deve mostrar números dos itens */
  showNumbers?: boolean;
  /** Se permite reordenar itens */
  allowReorder?: boolean;
  /** Se permite editar itens inline */
  allowEdit?: boolean;
  /** Máximo de itens permitidos */
  maxItems?: number;
  /** Classes CSS adicionais */
  className?: string;
  /** Função para renderizar ações customizadas */
  renderActions?: (item: ListFormItem, index: number) => React.ReactNode;
  /** Função para renderizar conteúdo customizado */
  renderContent?: (item: ListFormItem, index: number) => React.ReactNode;
}
