import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ModalProps } from './types';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalContent,
  ModalFooter
} from './styles';

/**
 * Modal Component
 * Componente de modal reutilizável com overlay e animações
 * 
 * @description
 * Modal responsivo e acessível que:
 * - Bloqueia scroll do body quando aberto
 * - Fecha com ESC ou clique no overlay
 * - Suporta conteúdo customizado e ações
 * - Funciona com React Portal para renderização
 * - Focável e acessível
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Gerenciar scroll do body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focar no modal quando abrir
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Listener para tecla ESC
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // Prevenir scroll quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <ModalOverlay onClick={handleOverlayClick} className="fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-6">
      <ModalContainer
        ref={modalRef}
        $size={size}
        className={`${className || ''} bg-white dark:bg-gray-800 rounded-xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden 
          animate-modalSlide transform transition-all duration-200 ease-out
          ${size === 'small' ? 'max-w-md' : size === 'medium' ? 'max-w-2xl' : size === 'large' ? 'max-w-4xl' : 'max-w-6xl'}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <ModalHeader className="flex items-center justify-between p-5 pb-0 md:p-6 md:pb-0">
            <ModalTitle id="modal-title" className="text-xl font-semibold text-gray-800 dark:text-gray-200 m-0">
              {title}
            </ModalTitle>
            {showCloseButton && (
              <ModalCloseButton
                onClick={onClose}
                aria-label="Fechar modal"
                type="button"
                className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 
                  hover:text-gray-700 dark:hover:text-gray-200 rounded-md p-2 flex items-center justify-center focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                ×
              </ModalCloseButton>
            )}
          </ModalHeader>
        )}

        <ModalContent className="p-5 md:p-6 overflow-y-auto flex-1">
          {children}
        </ModalContent>

        {footer && (
          <ModalFooter className="p-5 pb-5 md:p-6 md:pb-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end flex-shrink-0 
            md:flex-row flex-col-reverse">
            {footer}
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>
  );

  // Usar portal para renderizar fora da árvore de componentes
  return createPortal(modalContent, document.body);
}
