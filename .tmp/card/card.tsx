"use client";

import { Container } from "./styles";
import { Title, Text } from "./styles";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { CardItem } from "../boxes/typo";
import { useEffect, useState, useCallback } from "react";
import { MediaService } from "@/services/mediaService";
import classNames from "classnames";

export default function Card(Props: CardItem) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    typeof Props.image === "string" ? Props.image : undefined
  );

  const fetchImage = useCallback(async () => {
    if (typeof Props.image === "number") {
      try {
        const media = await MediaService(Props.image);
        if(media) setImageUrl(media?.source_url);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    }
  }, [Props.image]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);


  return (
    <Container className={`card flex text-base w-full lg:w-auto flex-col gap-${Props.gap !== '' ? Props.gap : 3} ${Props.classname}`}>
      {imageUrl && (
        <LazyLoadImage
          className={classNames(
            `inline max-w-[39px]`,
            [`lg:${Props.imagealign}`],
          )}
          src={imageUrl}
          alt="Card Image" />
      )}
      {Props.title && (
        <Title className={`font-bold lg:text-xl ${Props.alignment}`} dangerouslySetInnerHTML={{ __html: Props.title }} />
      )}
      {Props.text && <Text className={Props.alignment} dangerouslySetInnerHTML={{ __html: Props.text }} />}
    </Container>
  );
}
