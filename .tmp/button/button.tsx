"use client";

import { useState } from 'react';
import { Container } from './styles';
import { Props } from './typo';
import classNames from 'classnames';

export default function Button({ href, radius, className, effect, tag: Tag = 'button', children }: Props) {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <Container 
      radius={radius} 
      href={href} 
      className={classNames('button font-bold text-center text-base px-8 py-3', className, {
        'animate__animated': hovered,
        [`animate__${effect}`]: hovered && effect
      })} 
      as={Tag}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Container>
  );
}