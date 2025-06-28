"use client";

import { useState } from 'react';
import { Container, FaqItem, Question, Answer } from './styles';
import classNames from 'classnames';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { ContentItem } from '@/services/ContentService';
import FaqSkeleton from './FaqSkeleton';

const Faq = ({ data, classname }: { data: ContentItem[]; classname?: string }) => {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!data) return <FaqSkeleton />;

  return (
    <Container className={classNames(
      'w-full grid grid-cols-1 md:grid-cols-2 gap-6 auto-cols-auto items-start',
      classname
    )}>
      {data.map((item, index) => (
        <FaqItem
          key={item.id}
          className={classNames('p-6 rounded-[12px] transition-all duration-300 bg-white shadow', {
            'active': expandedItems[index],
          })}
          onClick={() => toggleItem(index)}
        >
          {<Question className="flex text-lg xl:text-xl font-bold justify-between items-center gap-4 text-stone-900">
            <span  dangerouslySetInnerHTML={{ __html: item.title?.rendered }} />

            {expandedItems[index] ? (
              <FaAngleUp className="icon text-xl text-stone-500" />
            ) : (
              <FaAngleDown className="icon text-xl text-stone-500" />
            )}
          </Question>}

          <Answer
            dangerouslySetInnerHTML={{ __html: item.content?.rendered }}
            className={classNames(
              'mt-4 text-base xl:text-lg transition-all duration-300',
              {
                'block': expandedItems[index],
                'hidden': !expandedItems[index],
              }
            )}
          />
        </FaqItem>
      ))}
    </Container>
  );
};

Faq.expectsArrayData = true;
export default Faq;
