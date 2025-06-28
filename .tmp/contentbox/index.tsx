"use client";

import { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { Container, Title, Text } from './styles';
import Button from "../button/button";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { MediaService } from '@/services/mediaService';
import { Props, CTA } from './typo';

const Contentbox = (props: Props) => {
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined);
  const [cta, setCtaList] = useState<CTA[]>([]);

  const fetchMediaUrl = useCallback(async () => {
    if (props.media) {
      const mediaId = typeof props.media === 'string' ? parseInt(props.media, 10) : props.media;
      try {
        const mediaItem = await MediaService(mediaId);
        if (mediaItem && mediaItem.source_url) {
          setMediaUrl(mediaItem.source_url);
        }
      } catch (error) {
        console.error("Error fetching media URL:", error);
      }
    }
  }, [props]);

  const remapProps = useCallback(() => {
    const cta: CTA[] = [];

    for (let i = 0; i < (props.cta || 0); i++) {
      cta.push({
        btnLabel: props[`cta_${i}_btnLabel`] || '',
        link: props[`cta_${i}_link`] || '',
        classname: props[`cta_${i}_classname`] || '',
        effect: props[`cta_${i}_effect`] || '',
      });
    }

    setCtaList(cta);
  }, [props]);

  useEffect(() => {
    fetchMediaUrl();
    remapProps();
  }, [fetchMediaUrl, remapProps]);

  return (
    <Container className={classNames(props.classname)}>
      <div
        className={classNames(
          `contentBox container m-auto pb-[6rem] pt-[6rem] gap-10 flex flex-col lg:gap-20 justify-${props.justify ?? 'between'} items-${props.alignment ?? 'start'}`,
          {
            'flex-wrap': true,
            'lg:flex-row': props.reverse == "0",
            'lg:flex-row-reverse': props.reverse == "1",
          }
        )}
      >
        {mediaUrl && (
          <div className="flex-1">
            <LazyLoadImage className="min-w-[100%] object-cover" src={mediaUrl} />
          </div>
        )}

        <div className="flex-1 flex flex-col gap-10 leading-none">
          {props.title && (
            <Title
              className="text-4xl xl:text-6xl"
              dangerouslySetInnerHTML={{ __html: props.title }}
            />
          )}
          {props.text && (
            <Text className="text-base xl:text-xl" dangerouslySetInnerHTML={{ __html: props.text }} />
          )}
          {cta.length > 0 && (
            <div className="flex gap-4 flex-wrap">
              {cta.map((cta, index) => (
                <Button
                  key={index}
                  className={cta.classname}
                  effect={cta.effect}
                  href={cta.link}
                  data-effect={cta.effect}
                >
                  {cta.btnLabel}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Contentbox;
