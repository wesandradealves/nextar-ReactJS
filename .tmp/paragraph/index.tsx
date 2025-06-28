"use client";

import { Container } from './styles';
import { Props } from './typo';
import { Text } from '../section/styles';

const Paragraph = ({ data }: Props) => {
  const item = Array.isArray(data) ? data[0] : data;

  return (
    <Container>
      <div className='container mx-auto px-4 py-8'>
        {item.innerContent && (<Text dangerouslySetInnerHTML={{ __html: item.innerContent.join('') }} />)}
      </div>
    </Container>
  );
};

Paragraph.expectsArrayData = true;
export default Paragraph;
