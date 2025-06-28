"use client";

import { Container, Title, Text, Rating, Rate, Item, ItemInner } from './styles';
import { FaStar, FaRegStar } from 'react-icons/fa';
import Slider from "react-slick";
import { ContentItem } from '@/services/ContentService';
import OpnioesSkeleton from './OpnioesSkeleton';

export const truncateText = (text: string, limit: number) => {
  if (!text) return '';
  return text.length <= limit ? text : text.substring(0, limit) + '...';
};

const Opnioes = ({ data, classname }: { data: ContentItem[]; classname?: string }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    arrows: false,
    initialSlide: 0,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 2 } },
      { breakpoint: 500, settings: { slidesToShow: 1 } }
    ]
  };

  if (!data) return <OpnioesSkeleton />;

  return (
    <Container className={classname}>
      <Slider {...settings}>
        {data.map((item) => (
          <Item
            key={item.id}
            title={item.title?.rendered}
            className="h-full cursor-pointer"
          >
            <ItemInner className="flex text-base text-stone-900 p-9 flex-col gap-4 bg-white rounded-[48px] h-full">
              {item.acf?.rating && (
                <Rating className="flex items-center gap-2 list-style-none list-none">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Rate key={i} className="text-base lg:text-xl">
                      {i < (item.acf?.rating ?? 0) ? <FaStar /> : <FaRegStar />}
                    </Rate>
                  ))}
                </Rating>
              )}

              {item.content?.rendered && (
                <Text
                  dangerouslySetInnerHTML={{
                    __html: truncateText(item.content.rendered, 140)
                  }}
                  className="flex-1 pe-8 overflow-auto max-h-[140px] lg:max-h-[100px]
                    [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-yellow-500
                    [&::-webkit-scrollbar-thumb]:rounded-full"
                />
              )}

              <Title className="mt-auto font-bold">
                {item.title?.rendered || 'Sem título'}
              </Title>
            </ItemInner>
          </Item>
        ))}
      </Slider>
    </Container>
  );
};

Opnioes.expectsArrayData = true;
export default Opnioes;