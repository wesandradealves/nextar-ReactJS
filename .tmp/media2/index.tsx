"use client";

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Container, Meta, Title, Text, Item, ItemInner, CategoryTag } from './styles';
import React, { useCallback, useEffect, useState } from "react";
import Slider from "react-slick";
import { useRouter } from 'next/navigation';
import { FiClock, FiUser } from 'react-icons/fi';
import { ContentItem } from '@/services/ContentService';
import { getUser } from '@/services/userService';
import { MediaService } from '@/services/mediaService';
import { TaxonomyService } from '@/services/TaxonomyService';
import { formatDate } from '@/utils/index';
import MediaSkeleton from './MediaSkeleton';
import { useLanguage } from '@/context/language';
import { useTranslate } from '@/hooks/useTranslate';

const truncateText = (text: string, limit: number) =>
  text.length <= limit ? text : `${text.substring(0, limit)}...`;

const Media = ({ data, classname }: { data: ContentItem[]; classname?: string }) => {
  const { language } = useLanguage();
  const { translate } = useTranslate(language);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [_data, setData] = useState<Array<
    ContentItem & {
      thumbnail?: string;
      author_name?: string;
      _categories?: { id: number; name: string }[];
    }
  >>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const mapped = await Promise.all(
      data.map(async (item) => {
        try {
          const [thumbnail, author, categories] = await Promise.all([
            item.featured_media ? MediaService(Number(item.featured_media)) : null,
            item.author ? getUser(Number(item.author)) : null,
            item.categories?.length
              ? Promise.all(item.categories.map(async (id: number) => {
                const cat = await TaxonomyService(id);
                return { ...cat, name: await translate(cat.name) };
              }))
              : [],
          ]);

          return {
            ...item,
            thumbnail: thumbnail?.source_url,
            author_name: author?.name,
            _categories: categories ?? [],
          };
        } catch {
          return {
            ...item,
            _categories: [],
          };
        }
      })
    );

    setData(mapped);
    setLoading(false);
  }, [data, translate]);

  useEffect(() => {
    if (data?.length) fetchData();
  }, [data, fetchData]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    arrows: false,
    initialSlide: 0,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1536,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  if (loading) return <MediaSkeleton />;
  if (!_data.length) return null;

  return (
    <Container className={classname}>
      <Slider {...settings}>
        {_data.map((item) => (
          <Item
            key={item.id}
            className="h-full cursor-pointer group text-base"
            onClick={() => router.push(`media/${item.id}`)}
          >
            <ItemInner className="flex flex-col gap-4 rounded-[48px] h-full overflow-hidden">
              {item.thumbnail ? (
                <div className="lg:h-[190px] overflow-hidden relative">
                  <LazyLoadImage
                    className="w-full object-cover transition-transform duration-300 lg:group-hover:scale-105"
                    src={item.thumbnail}
                    alt={item.title.rendered}
                  />
                  {(item._categories ?? []).length > 0 && (
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      {item._categories!.map((category) => (
                        <CategoryTag key={category.id} className="rounded-full px-4 py-2">
                          {category.name}
                        </CategoryTag>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
              <div className="flex flex-col gap-4 p-6 flex-1 pt-0">
                <Meta className="flex items-center gap-1 text-base">
                  <span className="flex items-center gap-1">
                    <FiUser size={14} />
                    {item.author_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock size={14} />
                    {`${formatDate(item.date, language)} ${item.acf?.readTime ? `• ${item.acf.readTime}` : ''}`}
                  </span>
                </Meta>
                <Title
                  dangerouslySetInnerHTML={{ __html: item.title.rendered }}
                  className="font-bold lg:text-xl"
                />
                {item.content?.rendered && (
                  <Text dangerouslySetInnerHTML={{ __html: truncateText(item.content.rendered, 120) }} />
                )}
              </div>
            </ItemInner>
          </Item>
        ))}
      </Slider>
    </Container>
  );
};

Media.expectsArrayData = true;
export default Media;
