"use client";
import classNames from 'classnames';
import { Container, Helper, SectionHeader, Subtitle, Title } from '../section/styles';
import { Props } from '../section/typo';
import { useCallback, useEffect, useState } from 'react';
import { MediaService } from '@/services/mediaService';
import { UrlItem, GABlockProps } from './typo';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Metrics, MetricsText, Text } from './styles';

const Firebasegametrics = (props: Props | GABlockProps) => {
    const data = 'data' in props ? props.data : props;
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | undefined>(undefined);
    const [urlItems, setUrlItems] = useState<UrlItem[]>([]);

    const fetchMediaUrls = useCallback(async () => {
        const urls: UrlItem[] = [];

        const total = data.urls || 0;

        for (let i = 0; i < total; i++) {
            const link = data[`urls_${i}_link`] || '';
            let imagem = '';

            try {
                const imageId = data[`urls_${i}_imagem`];
                if (imageId) {
                    const media = await MediaService(imageId);
                    imagem = media?.source_url || '';
                }
            } catch (error) {
                console.error(`Erro ao buscar imagem do item de URL ${i}:`, error);
            }

            urls.push({ imagem, link });
        }

        setUrlItems(urls);
    }, [data]);

    const fetchBackgroundImage = useCallback(async () => {
        if (data.backgroundimage) {
            try {
                const bgImage = await MediaService(data.backgroundimage);
                if (bgImage && bgImage.source_url) {
                    setBackgroundImageUrl(bgImage.source_url);
                }
            } catch (error) {
                console.error("Erro ao buscar imagem de fundo:", error);
            }
        }
    }, [data.backgroundimage]);

    useEffect(() => {
        fetchBackgroundImage();
        fetchMediaUrls();
    }, [fetchBackgroundImage, fetchMediaUrls]);

    const mergedProps = {
        ...data,
        backgroundImageUrl,
        urlItems,
    };

    return (
        <Container
            id={mergedProps?.id}
            background={mergedProps?.background}
            backgroundcolor={mergedProps?.backgroundcolor}

            className={classNames(`w-full m-auto relative ${mergedProps?.classname}`)}
        >
            <div className={classNames(
                `container flex-wrap text-lg lg:text-3xl leading-none relative z-10 m-auto flex`,
                `flex-${mergedProps?.direction ?? 'col'}`,
                `pt-[6rem] pb-[6rem]`,
                mergedProps?.gap?.toString().includes('px')
                    ? `gap-[${mergedProps.gap}]`
                    : `gap-${mergedProps.gap || 7}`,
            )}>
                {(mergedProps?.helper || mergedProps?.title || mergedProps?.subtitle) && (
                    <SectionHeader className="flex flex-col justify-center items-center text-center w-full gap-7">
                        {(mergedProps?.helper || mergedProps?.title) && (
                            <span>
                                {mergedProps?.title && (
                                    <Title
                                        barstitle={mergedProps?.barstitle}
                                        className={classNames(`text-center relative text-2xl lg:text-5xl`, {
                                            'pt-2 pb-2 lg:ps-[150px] lg:pe-[150px]': !!mergedProps?.barstitle
                                        })}
                                        dangerouslySetInnerHTML={{ __html: mergedProps.title }}
                                    />
                                )}
                            </span>
                        )}
                        {mergedProps?.subtitle && (
                            <Subtitle
                                className="text-center"
                                dangerouslySetInnerHTML={{ __html: mergedProps.subtitle }}
                            />
                        )}
                    </SectionHeader>
                )}

                <Metrics
                    className='rounded-[20px] p-[40px] xl:pt-[268px] text-white flex flex-col xl:flex-row gap-20 justify-between xl:items-end'
                    backgroundimage={mergedProps?.backgroundImageUrl}
                    backgroundposition={mergedProps?.backgroundposition}
                    backgroundsize={mergedProps?.backgroundsize}
                    backgroundattachment={mergedProps?.backgroundattachment}>
                    {(mergedProps.prefix_title || mergedProps.suffix_title) && (<MetricsText className='flex flex-col gap-8'>
                        <span className='font-bold flex flex-col xl:flex-row xl:items-end gap-3'>
                            {mergedProps.prefix_title && (<span className=' text-4xl' dangerouslySetInnerHTML={{ __html: mergedProps.prefix_title }} />)}
                            <span className='text-6xl'>50 mil</span>
                            {mergedProps.suffix_title && (<span className=' text-4xl' dangerouslySetInnerHTML={{ __html: mergedProps.suffix_title }} />)}
                        </span>

                        {mergedProps?.helper && (
                            <Helper
                                className="font-light text-lg xl:px-8"
                                dangerouslySetInnerHTML={{ __html: mergedProps.helper }}
                            />
                        )}
                    </MetricsText>)}

                    {mergedProps.urlItems && (<div className="flex gap-4 xl:justify-end items-center">
                        {mergedProps.urlItems?.map((item: UrlItem, index: number) => (
                            <a key={index} href={item.link} target="_blank" rel="noopener noreferrer">
                                <LazyLoadImage src={item.imagem} alt={`Ícone ${index + 1}`} />
                            </a>
                        ))}
                    </div>)}
                </Metrics>

                {mergedProps.text && (<Text className='text-lg lg:px-[53px]' dangerouslySetInnerHTML={{ __html: mergedProps.text }} />)}
            </div>
        </Container>
    );
};

Firebasegametrics.expectsArrayData = true;
export default Firebasegametrics;
