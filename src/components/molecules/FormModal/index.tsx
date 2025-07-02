import React, { ReactNode } from 'react';
import Modal from '../Modal';
import { FormSection, ModalFooter } from '../Modal/formStyles';
import { Button } from '../../atoms/Button';

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
 * Props para o FormModal genérico
 */
export interface FormModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Função para fechar o modal */
  onClose: () => void;
  /** Título do modal */
  title: string;
  /** Subtítulo opcional */
  subtitle?: string;
  /** Conteúdo do formulário */
  children: ReactNode;
  /** Texto do botão de confirmação */
  confirmText?: string;
  /** Texto do botão de cancelar */
  cancelText?: string;
  /** Função chamada ao confirmar */
  onConfirm?: () => void;
  /** Se está carregando/salvando */
  isLoading?: boolean;
  /** Se o botão de confirmar está desabilitado */
  isConfirmDisabled?: boolean;
  /** Variante do botão de confirmação */
  confirmVariant?: 'primary' | 'secondary' | 'danger' | 'outline';
  /** Tamanho do modal */
  size?: 'small' | 'medium' | 'large';
  /** Se deve mostrar o footer com botões */
  showFooter?: boolean;
  /** Footer customizado (substitui os botões padrão) */
  customFooter?: ReactNode;
  /** Se deve fechar ao clicar fora */
  closeOnOverlayClick?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

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
export const FormModal: React.FC<FormModalProps> = ({
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
}) => {
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
      <div onKeyDown={handleKeyDown}>
        {subtitle && (
          <div style={{ 
            marginBottom: '24px', 
            fontSize: '14px', 
            color: '#6b7280' 
          }}>
            {subtitle}
          </div>
        )}
        
        <FormSection>
          {children}
        </FormSection>

        {showFooter && (
          <ModalFooter>
            {customFooter || (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {cancelText}
                </Button>
                
                {onConfirm && (
                  <Button
                    variant={confirmVariant}
                    onClick={handleConfirm}
                    disabled={isLoading || isConfirmDisabled}
                    loading={isLoading}
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
