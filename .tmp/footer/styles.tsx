import styled from 'styled-components';
import { Submenu, List } from '../navigation/styles';

export const Container = styled.footer`
  ${Submenu} {
    ${List} {
      gap: .75rem;
      margin-top: 1.75rem
    }
  }
`;