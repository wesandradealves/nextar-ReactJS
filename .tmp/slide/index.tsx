"use client";

import classNames from 'classnames';
import { Container } from './styles';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { MediaService } from '@/services/mediaService';
import { Props, SLIDE } from './typo';
import Slider from "react-slick";
import { Item, ItemInner, Title, Subtitle, SlideWrapper } from "./styles";
import { useCallback, useEffect, useState } from 'react';

const Slide = (props: Props) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    centerMode: false,
    arrows: false,
    initialSlide: 0,
    slidesToScroll: 1
  };

  const [slider, setSlides] = useState<SLIDE[]>([]);

  const remapProps = useCallback(async () => {
    const slider: SLIDE[] = [];
  
    for (let i = 0; i < (props.slider || 0); i++) {
      const mediaRaw = props[`slider_${i}_media`];
      let mediaUrl = '';
  
      if (mediaRaw) {
        const mediaId = typeof mediaRaw === 'string' ? parseInt(mediaRaw, 10) : mediaRaw;
        try {
          const mediaItem = await MediaService(mediaId);
          mediaUrl = mediaItem?.source_url || '';
        } catch (error) {
          console.error(`Erro ao buscar a mídia do slide ${i}:`, error);
        }
      }
  
      slider.push({
        title: props[`slider_${i}_title`] || '',
        subtitle: props[`slider_${i}_subtitle`] || '',
        text: props[`slider_${i}_text`] || '',
        media: mediaUrl,
      });
    }
  
    setSlides(slider);
  }, [props]);
  
  useEffect(() => {
    remapProps();
  }, [remapProps]);

  return (
    <Container className={classNames(props.classname)}>
      <div
        className={classNames(
          `container m-auto pb-[6rem] pt-[6rem]`
        )}
      >
      {slider && slider.length && (<SlideWrapper className='relative'><Slider {...settings}>
        {slider.map((item, index) => {
          return (
            <Item
              key={index}
              className='pt-5'
            >
              <ItemInner className='flex flex-col gap-20 lg:gap-[6rem]'>
                {(item.title || item.subtitle || item.text) && (<div className='flex flex-col items-center uppercase gap-4'>
                  {(item.title || item.subtitle) && (<Title data-backtext={item.subtitle} className='text-4xl xl:text-6xl font-normal leading-none text-center relative flex flex-col-reverse'>{item.title}</Title>)}
                  {item.text && (<Subtitle className='font-bold text-center p-2 pt-1 pb-1 text-xl lg:text-2xl'>{item.text}</Subtitle>)}
                </div>)}

                {item.media && (<LazyLoadImage className='w-full object-fit' src={String(item.media)} alt={item.title} />)}
              </ItemInner>
            </Item>
          );
        })}
      </Slider></SlideWrapper>)}
      </div>
    </Container>
  );
};

export default Slide;
