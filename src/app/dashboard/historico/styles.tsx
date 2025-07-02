import styled from 'styled-components';

export const Header = styled.div``;
export const Container = styled.div``;
export const StatsContainer = styled.div``;
export const StatCard = styled.div``;
export const FiltersContainer = styled.div``;
export const FiltersRow = styled.div``;
export const FilterGroup = styled.div``;
export const ExportContainer = styled.div``;
export const PaginationContainer = styled.div``;
export const PageInfo = styled.span``;
export const ErrorMessage = styled.div`
  color: #dc2626;
`;
export const StatValue = styled.div``;
export const StatLabel = styled.div``;
export const ExportInfo = styled.span``;
export const TimelineContainer = styled.div``;
export const TimelineItem = styled.div<{ $isFirstItem?: boolean }>`
  &:before {
    content: '';
    background: ${({ $isFirstItem }) => $isFirstItem ? 'linear-gradient(to bottom, transparent, #e2e8f0)' : '#e2e8f0'};
  }
`;
export const TimelineDot = styled.div<{ $color?: string }>`
  background: ${({ $color }) => $color || '#3b82f6'};
`;
export const TimelineContent = styled.div``;
export const TimelineHeader = styled.div``;
export const TimelineTitle = styled.h3``;
export const TimelineDate = styled.span``;
export const TimelineBody = styled.div``;
export const TimelineFooter = styled.div``;
export const NoResults = styled.div``;
