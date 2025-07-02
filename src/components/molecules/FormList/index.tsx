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
} from './styles';
import { FormListProps, ListFormItem } from './types';

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
export const FormList = ({
  title,
  items,
  onChange,
  newItemFields,
  addButtonText = 'Adicionar',
  emptyText = 'Nenhum item adicionado',
  emptyIcon = '📝',
  showNumbers = false,
  allowReorder = false,
  allowEdit = false,
  maxItems,
  className,
  renderActions,
  renderContent
}: FormListProps) => {
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

  // Validação de campos
  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    newItemFields.forEach(field => {
      const value = newItemData[field.key] || '';
      
      // Validação de campo obrigatório
      if (field.required && !value.trim()) {
        newErrors[field.key] = `${field.label} é obrigatório`;
        hasErrors = true;
      } 
      // Validação customizada
      else if (field.validate && value.trim()) {
        const error = field.validate(value);
        if (error) {
          newErrors[field.key] = error;
          hasErrors = true;
        }
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  // Handler para campos de texto
  const handleInputChange = (key: string, value: string) => {
    setNewItemData(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Limpar erro quando usuário começa a digitar
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: ''
      }));
    }
  };

  // Adicionar novo item
  const handleAddItem = () => {
    if (!validateFields()) return;
    
    // Verificar limite máximo
    if (maxItems && items.length >= maxItems) {
      return;
    }
    
    // Construir título e subtítulo do item
    const mainField = newItemFields[0];
    const secondaryField = newItemFields[1];
    
    const newItem: ListFormItem = {
      id: `item-${Date.now()}`,
      title: newItemData[mainField.key],
      subtitle: secondaryField ? newItemData[secondaryField.key] : undefined,
      data: { ...newItemData }
    };
    
    onChange([...items, newItem]);
    
    // Resetar formulário
    const initialData: Record<string, string> = {};
    newItemFields.forEach(field => {
      initialData[field.key] = '';
    });
    setNewItemData(initialData);
    setErrors({});
  };

  // Remover item
  const handleRemoveItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  // Reordenar item para cima
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    onChange(newItems);
  };

  // Reordenar item para baixo
  const handleMoveDown = (index: number) => {
    if (index >= items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    onChange(newItems);
  };

  return (
    <div className={`flex flex-col gap-4 ${className || ''}`}>
      {title && (
        <SectionTitle className="text-lg font-semibold text-gray-800 mb-2">
          {title}
        </SectionTitle>
      )}
      
      <ItemListContainer className="flex flex-col gap-2">
        {items.length === 0 ? (
          <EmptyContainer className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="text-4xl mb-3">{emptyIcon}</div>
            <EmptyTitle className="text-lg font-medium text-gray-700">
              Nenhum Item
            </EmptyTitle>
            <EmptyText className="text-sm text-gray-500 text-center">
              {emptyText}
            </EmptyText>
          </EmptyContainer>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((item, index) => (
              <ListItem 
                key={item.id}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {renderContent ? (
                  renderContent(item, index)
                ) : (
                  <ListItemContent className="flex flex-col">
                    <ListItemTitle className="font-medium">
                      {showNumbers && <span className="mr-1 opacity-70">{index + 1}.</span>}
                      {item.title}
                    </ListItemTitle>
                    {item.subtitle && (
                      <ListItemSubtitle className="text-sm text-gray-500">
                        {item.subtitle}
                      </ListItemSubtitle>
                    )}
                  </ListItemContent>
                )}
                
                <ListItemActions className="flex items-center gap-2">
                  {renderActions ? (
                    renderActions(item, index)
                  ) : (
                    <>
                      {allowReorder && (
                        <>
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 min-w-[28px]"
                          >
                            ↑
                          </Button>
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === items.length - 1}
                            className="p-1 min-w-[28px]"
                          >
                            ↓
                          </Button>
                        </>
                      )}
                      {allowEdit && (
                        <Button
                          variant="outline"
                          size="small"
                          className="p-1 min-w-[28px]"
                        >
                          ✏️
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 min-w-[28px] text-red-600 hover:bg-red-50"
                      >
                        ✕
                      </Button>
                    </>
                  )}
                </ListItemActions>
              </ListItem>
            ))}
          </div>
        )}
        
        {(!maxItems || items.length < maxItems) && (
          <InlineFormContainer className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <InlineFieldGrid className="grid gap-3 mb-3 sm:grid-cols-2 xs:grid-cols-1">
              {newItemFields.map(field => (
                <div key={field.key} className="flex flex-col">
                  <div className="text-sm font-medium text-gray-700 mb-1">{field.label}</div>
                  <Input
                    placeholder={field.placeholder}
                    value={newItemData[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    type={field.type || 'text'}
                    hasError={!!errors[field.key]}
                    className={errors[field.key] ? 'border-red-500' : ''}
                  />
                  {errors[field.key] && (
                    <div className="text-xs text-red-500 mt-1">{errors[field.key]}</div>
                  )}
                </div>
              ))}
            </InlineFieldGrid>
            
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="small"
                onClick={handleAddItem}
              >
                {addButtonText}
              </Button>
            </div>
          </InlineFormContainer>
        )}
      </ItemListContainer>
    </div>
  );
};

export default FormList;
