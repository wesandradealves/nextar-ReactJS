'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FiClock, FiUser, FiArrowLeft } from 'react-icons/fi';
import classNames from 'classnames';
import { useParams } from 'next/navigation';
import { PostService } from '@/services/postService';
import { getUser } from '@/services/userService';
import { MediaService } from '@/services/mediaService';
import { TaxonomyService } from '@/services/TaxonomyService';
import { ContentItem } from '@/services/ContentService';
import { useLanguage } from '@/context/language';
import { useTranslate } from '@/hooks/useTranslate';
import { useSettings } from '@/context/settings';
import { formatDate } from '@/utils/index';

import { Body } from './style';
import { Container, Title } from '@/components/section/styles';
import { CategoryTag } from '@/components/media/styles';
import SingleSkeleton from './SingleSkeleton';
import { useMetadata } from '@/hooks/useMetadata';

type MappedContent = ContentItem & {
  author_name?: string;
  _categories?: { id: number; name: string }[];
  thumbnail?: string;
};

export default function Single() {
  const params = useParams();
  const [content, setContent] = useState<MappedContent | null>(null);
  const { language } = useLanguage();
  const { translate } = useTranslate(language);
  const [backText, setBackText] = useState('Voltar para notícias');
  const { settings } = useSettings();
  
  useEffect(() => {
    let mounted = true;
    (async () => {
      const translated = await translate('Voltar para notícias');
      if (mounted) setBackText(translated);
    })();
    return () => { mounted = false };
  }, [translate]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const id = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
        if (!id) return;
        const data = await PostService({ id, type: 'midia' });
        const pageData = data as Partial<ContentItem>;
        const featured_media = pageData.featured_media ?? '';
        const author = pageData.author ?? '';
        const categories = pageData.categories ?? [];
        const [thumbnail, authorData, categoriesData, tagsData] = await Promise.all([
          featured_media ? MediaService(Number(featured_media)) : null,
          typeof author === 'number' ? getUser(author) : null,
          Array.isArray(categories) && categories.length
            ? Promise.all(categories.map(async (catId: number) => {
                const cat = await TaxonomyService(catId);
                return { ...cat, name: await translate(cat.name) };
              }))
            : [],
          Array.isArray(pageData.tags) && pageData.tags.length
            ? Promise.all(pageData.tags.map(async (tagId: number) => {
                const tag = await TaxonomyService(tagId, 'tags');
                return { ...tag, name: await translate(tag.name) };
              }))
            : []
        ]);
        setContent({
          ...pageData,
          rating: pageData.rating ?? 0,
          categories: categories,
          thumbnail: thumbnail?.source_url || pageData.thumbnail || (pageData as { source_url?: string }).source_url || '',
          author_name: authorData?.name || '',
          _categories: categoriesData,
          tags: tagsData,
          date: formatDate(pageData.date || '', language),
          content: pageData.content || { rendered: '', protected: false },
          title: pageData.title || { rendered: '' },
          excerpt: pageData.excerpt || { rendered: '', protected: false },
          id: pageData.id ?? 0,
          slug: pageData.slug ?? '',
          type: pageData.type ?? '',
          link: pageData.link ?? '',
          meta: pageData.meta ?? {},
          _links: pageData._links ?? {},
        } as MappedContent);
      } catch (error) {
        console.log('Error fetching content:', error);
      }
    };
    fetchContent();
  }, [params, language]);

  const title = useMemo(() => (content?.title?.rendered ? ` - ${content.title.rendered}` : ''), [content]);

  useMetadata({
    title: `${settings?.blog_info?.name ?? 'BDM Digital'}${title}`,
    ogTitle: `${settings?.blog_info?.name ?? 'BDM Digital'}${title}`,
    favicon: settings?.favicon || '',
  });

  if (!content) return <SingleSkeleton />;

  return (
    <>
      <Container
        className='text-white text-center pt-[190px] pb-[90px] bg-fixed bg-cover relative overflow-hidden'
        backgroundimage={content?.thumbnail || ''}
        backgroundposition='center top'
      >
        <div className='container m-auto gap-6 flex flex-col relative z-10'>
          <Link
            href="/"
            className='inline-flex text-base lg:text-xl items-center gap-2 hover:text-primary-bdm3 transition-colors'
          >
            <FiArrowLeft /> {backText}
          </Link>

          <ul className='flex flex-wrap gap-4 text-sm list-none text-base lg:text-xl'>
            <li className='flex items-center gap-2'>
              <FiUser size={16} /> {content.author_name}
            </li>
            <li className='flex items-center gap-2'>
              <FiClock size={16} /> {content.date} • {content.acf?.readTime}
            </li>
          </ul>

          <Title
            className='text-start leading-1 text-xl lg:text-4xl'
            dangerouslySetInnerHTML={{ __html: content.title.rendered }}
          />

          {(content._categories ?? []).length > 0 && (
            <div className="flex gap-2 flex-wrap items-center justify-center">
              {content._categories!.map((category) => (
                <CategoryTag key={category.id} className="rounded-full px-4 py-2">
                  {category.name}
                </CategoryTag>
              ))}
            </div>
          )}
        </div>

        <div className={classNames(
          'absolute inset-0 w-full h-full bg-black opacity-80 z-1'
        )} />
      </Container>

      {content.content && (
        <Body
          className='text-base lg:text-lg xl:text-xl m-auto container text-white py-[90px] flex flex-col gap-8'
          dangerouslySetInnerHTML={{ __html: content.content.rendered }}
        />
      )}
    </>
  );
}
