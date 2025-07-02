import styled from 'styled-components';

/**
 * Estilos para o ChamadoModal
 * 
 * @version 1.0.0
 * @description
 * Migrado para o padrão híbrido Tailwind + styled-components.
 * Mantido apenas o essencial como styled-components para
 * comportamentos dinâmicos, o resto migrado para Tailwind.
 */

// Mantido por ter lógica dinâmica de cor
export const HistoryItem = styled.div<{ $status?: string }>`
  border-left-color: ${({ $status }) => {
    switch ($status) {
      case 'aberto': return '#3b82f6';
      case 'em_andamento': return '#f59e0b';
      case 'concluido': return '#10b981';
      case 'cancelado': return '#ef4444';
      default: return '#6b7280';
    }
  }};
`;

// Os componentes abaixo foram convertidos para Tailwind
// e não são mais necessários como styled-components
// export const EquipmentItemContainer = styled.div``;
// export const UserSelectionContainer = styled.div``;
// export const SectorSelectionContainer = styled.div``;
// export const AdditionalInfoContainer = styled.div``;
// export const ObservationsContainer = styled.div``;
// export const TechnicalDataContainer = styled.div``;
// export const PartsContainer = styled.div``;
// export const ActionContainer = styled.div``;
// export const HistoryContainer = styled.div``;
// export const AttachmentsContainer = styled.div``;
// export const AttachmentItem = styled.div``;
