"use client";

import { Container } from './styles';
import 'hamburgers/dist/hamburgers.css';
import classNames from 'classnames';
import Props from './typo';

const Header = ({ scrollPosition }: Props) => {
  return (
    <Container
      id="header"
      className={classNames("w-full top-0 left-0 z-50", {
        'scrolled': scrollPosition > 0,
      })}
    >
      <>Header</>
    </Container>
  );
};

export default Header;
