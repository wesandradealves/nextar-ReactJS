"use client";

import React, { useCallback, useEffect, useState } from "react";
import Card from '@/components/card/card';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Props } from '../section/typo';
import { MediaService } from '@/services/mediaService';
import { Container, SectionHeader, Subtitle, Title, Helper } from '../section/styles';
import classNames from "classnames";
import { CardItem } from "../boxes/typo";
import { RemappedProps } from "./typo";
import { motion, Variants } from 'framer-motion';

const Cardsmotion = (props: Props) => {
    const cardVariants: Variants = {
        offscreen: {
            y: 300,
        },
        onscreen: {
            y: 50,
            rotate: -10,
            transition: {
                type: "spring",
                bounce: 0.4,
                duration: 0.8,
            },
        },
    }

    const getAlignmentClass = (alignment: string): string => {
        switch (alignment) {
            case "m-auto":
                return "lg:text-center";
            case "me-auto":
                return "lg:text-start";
            case "ms-auto":
                return "lg:text-end";
            default:
                return "";
        }
    };

    const [remapped, setRemapped] = useState<RemappedProps>({
        cards: [],
        backgroundImageUrl: "",
        mediaImageUrl: "",
    });

    const remapProps = useCallback(async (props: Props): Promise<RemappedProps> => {
        const cards: CardItem[] = [];

        const cardIndexes = Array.from(
            new Set(
                Object.keys(props)
                    .map(key => {
                        const match = key.match(/^cards_(\d+)_/);
                        return match ? Number(match[1]) : null;
                    })
                    .filter((v): v is number => v !== null)
            )
        ).sort((a, b) => a - b);

        for (const i of cardIndexes) {
            const imageId = props[`cards_${i}_image`];
            let image = "";

            try {
                if (imageId) {
                    const media = await MediaService(Number(imageId));
                    image = media?.source_url || "";
                }
            } catch (error) {
                console.error(`Erro ao buscar imagem do card ${i}:`, error);
            }

            cards.push({
                alignment: getAlignmentClass(props[`cards_${i}_imagealign`] as string),
                classname: String(props[`cards_${i}_classname`] || ``),
                title: String(props[`cards_${i}_title`] || ""),
                text: String(props[`cards_${i}_text`] || ""),
                imagealign: String(props[`cards_${i}_imagealign`] || ""),
                image,
                gap: String(props[`cards_${i}_gap`] || ""),
            });
        }

        let backgroundImageUrl = "";
        let mediaImageUrl = "";

        if (props.backgroundimage) {
            try {
                const media = await MediaService(Number(props.backgroundimage));
                backgroundImageUrl = media?.source_url || "";
            } catch (error) {
                console.error("Erro ao buscar imagem de fundo:", error);
            }
        }

        if (props.media) {
            try {
                const media = await MediaService(Number(props.media));
                mediaImageUrl = media?.source_url || "";
            } catch (error) {
                console.error("Erro ao buscar imagem de mídia:", error);
            }
        }

        return {
            cards,
            backgroundImageUrl,
            mediaImageUrl,
        };
    }, []);

    useEffect(() => {
        remapProps(props).then(setRemapped);
    }, [props, remapProps]);

    const mergedProps = {
        ...props,
        ...remapped,
    };

    return (
        <Container
            id={mergedProps?.id}
            background={mergedProps?.background}
            backgroundcolor={mergedProps?.backgroundcolor}
            backgroundimage={remapped?.backgroundImageUrl}
            backgroundposition={mergedProps?.backgroundposition}
            backgroundsize={mergedProps?.backgroundsize}
            backgroundattachment={mergedProps?.backgroundattachment}
            className={classNames(`w-full m-auto relative ${mergedProps?.classname}`, {
                'overflow-hidden': mergedProps?.opacity
            })}
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
                                {mergedProps?.helper && (
                                    <Helper
                                        className="text-center uppercase"
                                        dangerouslySetInnerHTML={{ __html: mergedProps.helper }}
                                    />
                                )}
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

                {(mergedProps.cards || mergedProps?.mediaImageUrl) && (
                    <div className="flex flex-wrap justify-between 2xl:items-center gap-20 overflow-hidden">
                        {mergedProps.cards && (
                            <div className="flex flex-1 flex-col gap-[84px]">
                                {mergedProps.cards
                                    .slice(0, Math.ceil(mergedProps.cards.length / 2))
                                    .map((card, index) => (
                                        <Card
                                            key={`first-half-${index}`}
                                            {...card}
                                        />
                                    ))}
                            </div>
                        )}

                        {mergedProps?.mediaImageUrl && (
                            <motion.div
                                className="2xl:flex justify-center items-center hidden"
                                initial="offscreen"
                                whileInView="onscreen"
                                viewport={{ amount: 0.8 }}
                            >
                                <motion.div variants={cardVariants}>
                                    <LazyLoadImage
                                        className="w-full max-w-[800px] m-auto"
                                        src={mergedProps.mediaImageUrl}
                                        alt="Background Image"
                                    />
                                </motion.div>
                            </motion.div>
                        )}

                        {mergedProps.cards && (
                            <div className="flex  flex-1 flex-col gap-[84px]">
                                {mergedProps.cards
                                    .slice(Math.ceil(mergedProps.cards.length / 2)) 
                                    .map((card, index) => (
                                        <Card
                                            key={`second-half-${index}`}
                                            {...card}
                                        />
                                    ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Container>
    );
};

export default Cardsmotion;
