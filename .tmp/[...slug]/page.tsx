/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState, Suspense, useCallback, useMemo } from 'react';
import React from 'react';
import { PostService } from '@/services/postService';
import DynamicComponent from '@/components/DynamicComponent';
import { useSettings } from '@/context/settings';
import { useMetadata } from '@/hooks/useMetadata';

interface Typo {
    title?: {
      rendered?: string;
    };
    acf_blocks: unknown[];
    id: unknown;
    acf: unknown;
    data: {
      "title": {
        "rendered": string
      }
    }
}

export default function Page() {
  const params = useParams<Record<string, string | string[]>>();
  const slug = params?.slug;
  const [content, setContent] = useState<any>(null);
  const [data, setData] = useState<Typo | null>(null);
  const { settings } = useSettings();
  
  const fetchData = useCallback(async (slug: string) => {
    try {
      const _slug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

      const data = await PostService({ slug: _slug, type: 'page' });
      setContent(data.acf_blocks);
      setData(data);
    } catch (err) {
      console.error('Error fetching page data:', err);
    }
  }, []);

  useEffect(() => {
    if (slug) {
      fetchData(Array.isArray(slug) ? slug[0] : slug);
    }
  }, [slug, fetchData]);

  const title = useMemo(() => (data?.title?.rendered ? ` - ${data.title.rendered}` : ''), [data]);

  useMetadata({
    title: `${settings?.blog_info?.name ?? 'BDM Digital'}${title}`,
    ogTitle: `${settings?.blog_info?.name ?? 'BDM Digital'}${title}`,
    favicon: settings?.favicon || '',
  });

  const renderedContent = useMemo(() => {
    return content?.map((object: any, index: number) => (
      <Suspense key={index} fallback={<div>Carregando...</div>}>
        <DynamicComponent
          data={object.attrs.data ?? object}
          machineName={object.machine_name}
        />
      </Suspense>
    ));
  }, [content]);

  return <>{renderedContent}</>;
}