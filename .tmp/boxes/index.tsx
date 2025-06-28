"use client";

import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Container, SectionHeader, Subtitle, Title, Helper } from "./styles";
import { CardItem, Props, BoxItem } from "./typo";
import { MediaService } from "@/services/mediaService";
import Box from "../box/box";
import Card from "../card/card";

const Boxes = (props: Props) => {
  const [processedProps, setProcessedProps] = useState<
    Props & { content?: BoxItem[]; mediaUrls?: string[]; backgroundimage?: string }
  >({
    ...props,
    mediaUrls: [],
    backgroundimage: "",
    content: [],
  });

  const fetchBackgroundImage = useCallback(async () => {
    if (props.backgroundimage) {
      try {
        const bgImage = await MediaService(props.backgroundimage);
        setProcessedProps((prev) => ({
          ...prev,
          backgroundimage: bgImage?.source_url,
        }));
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    }
  }, [props.backgroundimage]);

  const groupedBoxes = useMemo(() => {
    const boxes: BoxItem[] = [];

    for (let i = 0; i < (props.boxes || 0); i++) {
      const box: BoxItem = {
        classname: props[`boxes_${i}_classname`] || "",
        title: props[`boxes_${i}_title`] || "",
        justify: props[`boxes_${i}_justify`] || "",
        alignment: props[`boxes_${i}_alignment`] || "",
        wrap: props[`boxes_${i}_wrap`] || "",
        cards: [],
      };

      const cardCount = props[`boxes_${i}_cards`] || 0;
      for (let j = 0; j < cardCount; j++) {
        const card: CardItem = {
          classname: `flex-1 ${props[`boxes_${i}_cards_${j}_classname`]}` || "flex-1",
          title: props[`boxes_${i}_cards_${j}_title`] || "",
          text: props[`boxes_${i}_cards_${j}_text`] || "",
          image: props[`boxes_${i}_cards_${j}_image`] || "",
          imagealign: props[`boxes_${i}_cards_${j}_imagealign`] || "",
          gap: props[`boxes_${i}_cards_${j}_gap`] || "",
        };
        box.cards.push(card);
      }

      boxes.push(box);
    }

    return boxes;
  }, [props]);

  useEffect(() => {
    fetchBackgroundImage();
  }, [fetchBackgroundImage]);

  useEffect(() => {
    setProcessedProps((prev) => ({
      ...prev,
      content: groupedBoxes,
    }));

  }, [groupedBoxes]);

  return (
    <Container
      id={props?.id}
      background={props?.background}
      backgroundcolor={props?.backgroundcolor}
      backgroundimage={processedProps?.backgroundimage}
      backgroundposition={props?.backgroundposition}
      backgroundsize={props?.backgroundsize}
      backgroundattachment={props?.backgroundattachment}
      className={classNames(`w-full m-auto relative ${props?.classname}`, {
        "overflow-hidden": props?.opacity,
      })}
    >
      <div
        className={`container flex-wrap text-lg lg:text-3xl leading-none relative z-10 m-auto flex flex-${props?.direction ?? "col"
          } pt-[6rem] pb-[6rem] gap-${props?.gap || 7}`}
      >
        {(props?.helper || props?.title || props?.subtitle) && (
          <SectionHeader className="flex flex-col justify-center items-center text-center w-full gap-7">
            {(props?.helper || props?.title) && (
              <span>
                {props?.helper && (
                  <Helper
                    className="text-center uppercase"
                    dangerouslySetInnerHTML={{ __html: props?.helper }}
                  />
                )}
                {props?.title && (
                  <Title
                    barstitle={props?.barstitle}
                    className={classNames(
                      `text-center relative text-2xl lg:text-5xl`,
                      {
                        "pt-2 pb-2 lg:ps-[150px] lg:pe-[150px]": !!props?.barstitle,
                      }
                    )}
                    dangerouslySetInnerHTML={{ __html: props?.title }}
                  />
                )}
              </span>
            )}
            {props?.subtitle && (
              <Subtitle
                className="text-center"
                dangerouslySetInnerHTML={{ __html: props?.subtitle }}
              />
            )}
          </SectionHeader>
        )}

        {processedProps?.content &&
          processedProps.content.map((box: BoxItem, i: number) => (
            <div
              className={classNames(`flex flex-col gap-8`, {
                [box?.classname]: box?.classname,
              })} key={`box-${i}`}>

              {box.title && (
                <Title
                  className={classNames(
                    `text-center relative text-2xl lg:text-5xl`
                  )}
                  dangerouslySetInnerHTML={{ __html: box.title }}
                />
              )}

              {(box.cards && box.cards.length) ? <Box {...box}>
                {box.cards.map((card: CardItem, j: number) => (
                  <Card key={`card-${i}-${j}`} {...card} />
                ))}
              </Box> : ''}
            </div>
          ))}
      </div>

      {props?.opacity && (
        <div
          className={`absolute z-1 bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed bg-black opacity-${props?.opacity}`}
        ></div>
      )}
    </Container>
  );
};

export default Boxes;
