"use client";

import { BoxContainer } from './styles';
import { Props } from './typo';
import classNames from 'classnames';

export default function Box(Props: Props) {
  return (
    <BoxContainer 
      className={classNames(`box gap-${Props.gap ?? 3} flex-col lg:flex-row flex justify-${Props.justify ?? 'between'} items-${Props.alignment ?? 'center'} ${Props.classname}`, {
        'flex-wrap': Props.wrap
      })}>
      {Props.children}
    </BoxContainer>
  );
}