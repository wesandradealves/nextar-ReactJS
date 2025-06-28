'use client';

import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Container, SectionHeader, Title } from '../section/styles';
import { Props } from '../section/typo';
import { MediaService } from '@/services/mediaService';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ContentItem, ContentService } from '@/services/ContentService';
import { TaxonomyService } from '@/services/TaxonomyService';
import ClientsSkeleton from './ClientsSkeleton';
import { ClientTitle, Tags, TagItem, Tag} from './styles';

const Clients = ({ data, classname }: { data: Props; classname?: string }) => {
  const [mediaUrl, setMediaUrl] = useState('');
  const [clients, setClients] = useState<
    Array<ContentItem & { thumbnail?: string; _tags?: { id: number; name: string }[] }>
  >([]);
  const [loading, setLoading] = useState(true);

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ContentService('clientes');
      const rawClients = Array.isArray(response) ? response : [response];
      const filteredClients = rawClients.filter((item): item is ContentItem => !!item);

      const mappedClients = await Promise.all(
        filteredClients.map(async (item) => {
          const [media, tags] = await Promise.all([
            item.featured_media ? MediaService(Number(item.featured_media)) : null,
            item.tags?.length
              ? Promise.all(item.tags.map((id: number) => TaxonomyService(id, 'tags')))
              : [],
          ]);

          return {
            ...item,
            thumbnail: media?.source_url,
            _tags: tags ?? [],
          };
        })
      );

      setClients(mappedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMedia = useCallback(async () => {
    if (!data?.media) return;

    try {
      const media = await MediaService(Number(data.media));
      setMediaUrl(media?.source_url || '');
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  }, [data?.media]);

  useEffect(() => {
    fetchMedia();
    loadClients();
  }, [fetchMedia, loadClients]);

  return (
    <Container
      id={data?.id}
      className={classNames(`w-full m-auto relative ${classname || data?.classname}`)}
    >
      <div
        className={classNames(
          `container flex-wrap text-lg lg:text-3xl leading-none relative z-10 m-auto flex`,
          `flex-col`,
          `pt-[6rem] pb-[6rem]`,
          data?.gap?.toString().includes('px') ? `gap-[${data.gap}]` : `gap-${data.gap || 7}`,
        )}
      >
        {data?.title && (
          <SectionHeader className="flex flex-col justify-center items-center text-center w-full gap-7">
            <Title
              barstitle={data?.barstitle}
              className={classNames(`text-center relative text-2xl lg:text-5xl`, {
                'pt-2 pb-2 lg:ps-[150px] lg:pe-[150px]': !!data?.barstitle,
              })}
              dangerouslySetInnerHTML={{ __html: data.title }}
            />
          </SectionHeader>
        )}

        {mediaUrl && (
          <LazyLoadImage
            src={mediaUrl}
            className="max-w-[100%] block me-auto"
          />
        )}

        {loading ? <ClientsSkeleton count={6} /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {clients.map((client) => (
              <div key={client.id} className="flex flex-col gap-6">
                {client.thumbnail && (
                  <LazyLoadImage
                    src={client.thumbnail}
                    alt={client.title?.rendered}
                    className="w-full h-48 object-cover object-center rounded-md h-[244px] md:h-[200px] lg:h-[244px] xl:h-[344px]"
                  />
                )}
                <ClientTitle
                  className="text-xl font-bold text-white uppercase "
                  dangerouslySetInnerHTML={{ __html: client.title?.rendered || '' }}
                />
                {(client._tags ?? []).length > 0 && (
                  <Tags className="flex gap-2 flex-wrap mt-2 list-none -mt-[2px]">
                    {client._tags!.map((tag) => (
                      <TagItem
                        key={tag.id}
                        className="bg-gray-200 text-xs px-3 py-1 rounded-[5px]"
                      >
                        <Tag>{tag.name.toLowerCase()}</Tag>
                      </TagItem>
                    ))}
                  </Tags>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

Clients.expectsArrayData = true;
export default Clients;
