"use client";

import { Container } from './styles';
import { Props } from './typo';
import { SectionHeader } from '../section/styles';
import classNames from 'classnames';
import { Title } from './styles';

const Heading = ({ data }: Props) => {
  const item = Array.isArray(data) ? data[0] : data;

  return (
    <Container>
      {item?.innerContent && (
        <SectionHeader className="flex flex-col justify-center items-center text-center w-full gap-7 pt-[100px] mt-[6rem] mb-[3rem]">
          <span>
            <Title
              barstitle={1}
              className={classNames(`relative text-2xl lg:text-5xl pt-2 pb-2 lg:ps-[150px] lg:pe-[150px]`)}
              dangerouslySetInnerHTML={{ __html: item.innerContent.join('') }}
            />
          </span>
        </SectionHeader>
      )}
    </Container>
  );
};

Heading.expectsArrayData = true;
export default Heading;
