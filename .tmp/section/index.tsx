"use client";

import classNames from 'classnames';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Container, SectionHeader, Subtitle, Title, Text } from './styles';
import { Props } from './typo';
import { MediaService, MediaItem } from '@/services/mediaService';

const Section = (props: Props) => {
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | undefined>(undefined);

  const mediaKeys = useMemo(() => {
    return Object.keys(props)
      .filter(key => key.startsWith("media_") && key.endsWith("_media"))
      .sort((a, b) => {
        const indexA = parseInt(a.split("_")[1], 10);
        const indexB = parseInt(b.split("_")[1], 10);
        return indexA - indexB;
      });
  }, [props]);

  const mediaIds = useMemo(() => mediaKeys.map(key => props[key] as number), [mediaKeys, props]);

  const fetchMediaUrls = useCallback(async () => {
    try {
      const mediaItems = (await Promise.all(
        mediaIds.map(id => MediaService(id))
      )).filter((item): item is MediaItem => item !== undefined);
      setMediaUrls(mediaItems.map(item => item.source_url));
    } catch (error) {
      console.error("Error fetching media URLs:", error);
    }
  }, [mediaIds]);

  const fetchBackgroundImage = useCallback(async () => {
    if (props.backgroundimage) {
      try {
        const bgImage = await MediaService(Number(props.backgroundimage));
        if(bgImage) setBackgroundImageUrl(bgImage?.source_url);
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    }
  }, [props.backgroundimage]);

  useEffect(() => {
    fetchMediaUrls();
    fetchBackgroundImage();
  }, [fetchMediaUrls, fetchBackgroundImage]);

  return (
    <Container
      id={props?.id}
      background={props?.background}
      backgroundcolor={props?.backgroundcolor}
      backgroundimage={backgroundImageUrl || ''}
      backgroundposition={props?.backgroundposition}
      backgroundsize={props?.backgroundsize}
      backgroundattachment={props?.backgroundattachment}
      className={classNames(`w-full m-auto relative ${props?.classname}`, {
        'overflow-hidden': props?.opacity
      })}
    >
      <div className={classNames(
        `container flex-wrap text-lg lg:text-3xl leading-none relative z-10 m-auto flex`,
        `flex-${props?.direction ?? 'col'}`,
        `pt-[6rem] pb-[6rem]`,
          props?.gap?.toString().includes('px') 
            ? `gap-[${props.gap}]` 
            : `gap-${props.gap || 7}`, 
        )}>
        {(props?.helper || props?.title || props?.subtitle) && (
          <SectionHeader className="flex flex-col justify-center items-center text-center w-full gap-7">
            {props?.title && (
              <span>
                {props?.title && (
                  <Title
                    barstitle={props?.barstitle?.toString()}
                    className={classNames(`text-center relative text-2xl lg:text-5xl`, {
                      'pt-2 pb-2 lg:ps-[150px] lg:pe-[150px]': !!props?.barstitle
                    })}
                    dangerouslySetInnerHTML={{ __html: props.title }}
                  />
                )}
              </span>
            )}
            {props?.subtitle && (
              <Subtitle
                className="text-center"
                dangerouslySetInnerHTML={{ __html: props.subtitle }}
              />
            )}
          </SectionHeader>
        )}

        {props.children ? props.children : <>
          {mediaUrls.length > 0 && (
            <div className="flex flex-wrap justify-between">
              {mediaUrls.map((url, index) => (
                <div key={index} className="flex-1 flex justify-center items-center flex-wrap">
                  <LazyLoadImage src={url} alt={`Media ${index + 1}`} />
                </div>
              ))}
            </div>
          )}

          {props?.text && (
            <Text
              className="text-center relative text-md lg:text-lg xl:text-xl"
              dangerouslySetInnerHTML={{ __html: props.text }}
            />
          )}
        </>}
      </div>

      {props?.opacity && (
        <div className={classNames(
          `absolute z-1 bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed bg-black`,
          `opacity-${props.opacity}`
        )} />
      )}
    </Container>
  );
};

export default Section;
