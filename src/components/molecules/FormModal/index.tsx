import React from 'react';
import Modal from '../Modal';
import { FormSection, ModalFooter } from './styles';
import { Button } from '../../atoms/Button';
import { FormModalProps } from './types';

// Re-exportar componentes de estilo para uso em modais que estendem FormModal
export {
  FieldGroup,
  SectionTitle,
  ToggleContainer,
  ToggleSwitch,
  ToggleInput,
  ToggleSlider,
  ToggleInfo,
  ToggleTitle,
  ToggleText
} from '../Modal/formStyles';

/**
 * Modal genérico para formulários de CRUD
 * 
 * @version 2.0.1
 * @description
 * Componente padronizado para todas as modais de formulário.
 * Garante consistência visual e de comportamento em todos os CRUDs.
 * 
 * Funcionalidades:
 * - Layout padronizado com estilos consistentes
 * - Footer configurável com botões de ação
 * - Estados de loading e disabled
 * - Responsividade automática
 * - Acessibilidade (ESC para fechar, foco, etc.)
 * 
 * @example
 * ```tsx
 * <FormModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   title="Novo Usuário"
 *   subtitle="Preencha os dados do usuário"
 *   confirmText="Criar Usuário"
 *   onConfirm={handleCreateUser}
 *   isLoading={isCreating}
 * >
 *   <FormSection>
 *     <Input placeholder="Nome completo" />
 *     <Select options={profileOptions} />
 *   </FormSection>
 * </FormModal>
 * ```
 */
export const FormModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  confirmText = 'Salvar',
  cancelText = 'Cancelar',
  onConfirm,
  isLoading = false,
  isConfirmDisabled = false,
  confirmVariant = 'primary',
  size = 'medium',
  showFooter = true,
  customFooter,
  closeOnOverlayClick = true,
  className
}: FormModalProps) => {
  const handleConfirm = () => {
    if (onConfirm && !isLoading && !isConfirmDisabled) {
      onConfirm();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && onConfirm) {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      closeOnOverlayClick={closeOnOverlayClick}
      className={className}
    >
      <div onKeyDown={handleKeyDown} className="w-full">
        {subtitle && (
          <div className="mb-6 text-sm text-gray-500">
            {subtitle}
          </div>
        )}
        
        <FormSection className="space-y-6">
          {children}
        </FormSection>

        {showFooter && (
          <ModalFooter className="flex justify-end items-center gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 sm:flex-row flex-col sm:gap-3 gap-2 [&>button]:w-full sm:[&>button]:w-auto">
            {customFooter || (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="sm:flex-shrink-0"
                >
                  {cancelText}
                </Button>
                
                {onConfirm && (
                  <Button
                    variant={confirmVariant}
                    onClick={handleConfirm}
                    disabled={isLoading || isConfirmDisabled}
                    loading={isLoading}
                    className="sm:flex-shrink-0"
                  >
                    {confirmText}
                  </Button>
                )}
              </>
            )}
          </ModalFooter>
        )}
      </div>
    </Modal>
  );
};

export default FormModal;
