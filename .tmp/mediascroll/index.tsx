"use client";

import classNames from 'classnames';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Container, SectionHeader, Subtitle, Title } from '../section/styles';
import { Props } from '../section/typo';
import { MediaService, MediaItem } from '@/services/mediaService';
import { BoxContainer } from '../box/styles';

const Mediascroll = (props: Props) => {
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);

    const mediaKeys = useMemo(() => {
        return Object.keys(props)
            .filter(key => key.startsWith("media_") && key.endsWith("_media"))
            .sort((a, b) => {
                const indexA = parseInt(a.split("_")[1], 10);
                const indexB = parseInt(b.split("_")[1], 10);
                return indexA - indexB;
            });
    }, [props]);

    const media = useMemo(() => mediaKeys.map(key => props[key] as number), [mediaKeys, props]);

    const fetchMediaUrls = useCallback(async () => {
        try {
            const mediaItems = (await Promise.all(media.map(id => MediaService(id)))).filter((item): item is MediaItem => !!item);
            setMediaUrls(mediaItems.filter(item => item.source_url).map(item => item.source_url));
        } catch (error) {
            console.error("Error fetching media URLs:", error);
        }
    }, [media]);

    useEffect(() => {
        fetchMediaUrls();
    }, [fetchMediaUrls]);

    return (
        <Container id={props?.id} className={classNames(`w-full m-auto relative ${props?.classname}`)}>
            <div className="container flex-wrap text-lg lg:text-3xl leading-none relative z-10 m-auto flex flex-col pb-[6rem] gap-7">
                {(props?.helper || props?.title || props?.subtitle) && (
                    <SectionHeader className="flex flex-col justify-center items-center text-center w-full gap-7">
                        {(props?.title) && (
                            <span>
                                {props?.title && (
                                    <Title
                                        barstitle={props?.barstitle}
                                        className={classNames(`text-center relative text-2xl lg:text-4xl`, {
                                            'pt-2 pb-2 lg:ps-[150px] lg:pe-[150px]': !!props?.barstitle,
                                        })}
                                        dangerouslySetInnerHTML={{ __html: props?.title }}
                                    />
                                )}
                            </span>
                        )}

                        {props?.subtitle && (
                            <Subtitle className="text-center" dangerouslySetInnerHTML={{ __html: props?.subtitle }} />
                        )}
                    </SectionHeader>
                )}

                {mediaUrls.length > 0 && (
                    <BoxContainer className='p-5 overflow-auto flex items-center max-w-100
                        [&::-webkit-scrollbar]:h-1
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-track]:ms-7
                        [&::-webkit-scrollbar-track]:me-7
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-yellow-500
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:cursor-move
                        '>
                        {mediaUrls.map((url, index) => (
                            url ? (
                                <div key={index} className='flex-shrink-0 mr-5'>
                                    <LazyLoadImage
                                        src={url}
                                        alt={`Media ${index + 1}`}
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                            ) : null
                        ))}
                    </BoxContainer>
                )}
            </div>
        </Container>
    );
};

export default Mediascroll;
