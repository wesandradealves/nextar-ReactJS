import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import {
  ItemListContainer,
  ListItem,
  ListItemContent,
  ListItemTitle,
  ListItemSubtitle,
  ListItemActions,
  InlineFormContainer,
  InlineFieldGrid,
  EmptyContainer,
  EmptyTitle,
  EmptyText,
  SectionTitle
} from '../Modal/formStyles';

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

/**
 * Componente de lista para formulários
 * 
 * @version 2.0.1
 * @description
 * Lista reutilizável para formulários que permite:
 * - Adicionar/remover itens dinamicamente
 * - Validação de campos
 * - Estados de vazio
 * - Ações customizáveis
 * - Layout responsivo
 * 
 * @example
 * ```tsx
 * <FormList
 *   title="Peças Utilizadas"
 *   items={pecas}
 *   onChange={setPecas}
 *   newItemFields={[
 *     { key: 'nome', label: 'Nome', placeholder: 'Nome da peça', required: true },
 *     { key: 'quantidade', label: 'Quantidade', placeholder: 'Ex: 2 unidades', required: true }
 *   ]}
 * />
 * ```
 */
export const FormList: React.FC<FormListProps> = ({
  title,
  items,
  onChange,
  newItemFields,
  addButtonText = 'Adicionar',
  emptyText = 'Nenhum item adicionado',
  emptyIcon = '📝',
  showNumbers = false,
  allowReorder = false,
  maxItems,
  className,
  renderActions,
  renderContent
}) => {
  const [newItemData, setNewItemData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inicializa dados do novo item
  React.useEffect(() => {
    const initialData: Record<string, string> = {};
    newItemFields.forEach(field => {
      initialData[field.key] = '';
    });
    setNewItemData(initialData);
  }, [newItemFields]);

  const validateField = (field: NewItemField, value: string): string | null => {
    if (field.required && !value.trim()) {
      return `${field.label} é obrigatório`;
    }
    
    if (field.validate) {
      return field.validate(value);
    }
    
    return null;
  };

  const validateAllFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    newItemFields.forEach(field => {
      const error = validateField(field, newItemData[field.key]);
      if (error) {
        newErrors[field.key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFieldChange = (key: string, value: string) => {
    setNewItemData(prev => ({ ...prev, [key]: value }));
    
    // Remove erro quando usuário começa a digitar
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const addItem = () => {
    if (!validateAllFields()) return;
    
    if (maxItems && items.length >= maxItems) {
      alert(`Máximo de ${maxItems} itens permitidos`);
      return;
    }

    const newItem: ListFormItem = {
      id: Date.now().toString(),
      title: newItemData[newItemFields[0]?.key] || 'Novo Item',
      subtitle: newItemFields[1] ? newItemData[newItemFields[1].key] : undefined,
      data: { ...newItemData }
    };

    onChange([...items, newItem]);
    
    // Reset form
    const resetData: Record<string, string> = {};
    newItemFields.forEach(field => {
      resetData[field.key] = '';
    });
    setNewItemData(resetData);
    setErrors({});
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (!allowReorder) return;
    
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    onChange(newItems);
  };

  const canAddItems = !maxItems || items.length < maxItems;

  return (
    <div className={className}>
      {title && <SectionTitle>{title}</SectionTitle>}
      
      <ItemListContainer>
        {items.length === 0 ? (
          <EmptyContainer>
            <div style={{ fontSize: '32px' }}>{emptyIcon}</div>
            <EmptyTitle>Lista Vazia</EmptyTitle>
            <EmptyText>{emptyText}</EmptyText>
          </EmptyContainer>
        ) : (
          items.map((item, index) => (
            <ListItem key={item.id}>
              {renderContent ? renderContent(item, index) : (
                <ListItemContent>
                  <ListItemTitle>
                    {showNumbers && `${index + 1}. `}
                    {item.title}
                  </ListItemTitle>
                  {item.subtitle && (
                    <ListItemSubtitle>{item.subtitle}</ListItemSubtitle>
                  )}
                </ListItemContent>
              )}
              
              <ListItemActions>
                {renderActions ? renderActions(item, index) : (
                  <>
                    {allowReorder && index > 0 && (
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => moveItem(index, index - 1)}
                      >
                        ↑
                      </Button>
                    )}
                    
                    {allowReorder && index < items.length - 1 && (
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => moveItem(index, index + 1)}
                      >
                        ↓
                      </Button>
                    )}
                    
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => removeItem(item.id)}
                    >
                      Remover
                    </Button>
                  </>
                )}
              </ListItemActions>
            </ListItem>
          ))
        )}

        {canAddItems && (
          <InlineFormContainer>
            <InlineFieldGrid>
              {newItemFields.map((field) => (
                <div key={field.key}>
                  <Input
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    value={newItemData[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  />
                  {errors[field.key] && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#ef4444', 
                      marginTop: '4px' 
                    }}>
                      {errors[field.key]}
                    </div>
                  )}
                </div>
              ))}
            </InlineFieldGrid>
            
            <Button
              variant="outline"
              size="small"
              onClick={addItem}
              disabled={!newItemFields.every(field => 
                field.required ? newItemData[field.key]?.trim() : true
              )}
            >
              {addButtonText}
            </Button>
          </InlineFormContainer>
        )}
        
        {maxItems && (
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280', 
            textAlign: 'center',
            marginTop: '8px'
          }}>
            {items.length}/{maxItems} itens
          </div>
        )}
      </ItemListContainer>
    </div>
  );
};

export default FormList;
