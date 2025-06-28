"use client";

import classNames from 'classnames';
import { useEffect, useState, useCallback } from 'react';
import { Container, SectionHeader, Title, Text } from '../section/styles';
import { Props } from '../section/typo';
import { MediaService } from '@/services/mediaService';
import Bubbles from '../bubbles/bubbles';

type TimelineItem = {
  title: string;
  text: string;
  image?: string;
};

const Timeline = (props: Props) => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | undefined>(undefined);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  const fetchBackgroundImage = useCallback(async () => {
    if (props.backgroundimage) {
      try {
        const bgImage = await MediaService(Number(props.backgroundimage));
        setBackgroundImageUrl(bgImage?.source_url);
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    }
  }, [props.backgroundimage]);

  const processTimeline = useCallback(async () => {
    const indexes = Array.from(
      new Set(
        Object.keys(props)
          .map(key => {
            const match = key.match(/^timeline_(\d+)_/);
            return match ? Number(match[1]) : null;
          })
          .filter((v): v is number => v !== null)
      )
    ).sort((a, b) => a - b);

    const items = await Promise.all(indexes.map(async i => {
      let image = props[`timeline_${i}_image`];
      if (image && typeof image === 'number') {
        try {
          const media = await MediaService(Number(image));
          image = media?.source_url || '';
        } catch (e) {
          console.error(e)
        }
      }
      return {
        title: props[`timeline_${i}_title`] || '',
        text: props[`timeline_${i}_text`] || '',
        image,
      };
    }));
    setTimeline(items);
  }, [props]);

  useEffect(() => {
    fetchBackgroundImage();
    processTimeline();
  }, [fetchBackgroundImage, processTimeline]);

  return (
    <Container
      id={props?.id}
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

        {props?.title && (
          <SectionHeader className="flex flex-col justify-center items-center text-center w-full gap-7"><Title
            barstitle={props?.barstitle}
            className={classNames(`text-center relative text-2xl lg:text-5xl`, {
              'pt-2 pb-2 lg:ps-[150px] lg:pe-[150px]': !!props?.barstitle
            })}
            dangerouslySetInnerHTML={{ __html: props.title }}
          /></SectionHeader>
        )}

        {props?.text && (
          <Text
            className="text-center relative text-md lg:text-lg xl:text-xl"
            dangerouslySetInnerHTML={{ __html: props.text }}
          />
        )}


        {timeline && timeline.length && (
          <Bubbles data={timeline} />
        )}
      </div>
    </Container>
  );
};

export default Timeline;
