import styled from 'styled-components';

// =================================
// CONTAINER PRINCIPAL
// =================================

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 24px;
  min-height: 100vh;
`;

export const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: #F9FAFB;
  border-radius: 8px;
  border: 1px solid #E5E7EB;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }
`;
