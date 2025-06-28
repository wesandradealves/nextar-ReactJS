"use client";

import Link from 'next/link';
import { Container } from './styles';
import Navigation from '../navigation/navigation';
import SocialNetworks from '../socialNetworks/socialNetworks';
import { fetchNavigation } from '@/utils/index';
import { MenuItem } from '@/services/navigationService';
import { useEffect, useState, useCallback } from 'react';
import { useSettings } from '@/context/settings';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useLanguage } from '@/context/language';
import { useTranslate } from '@/hooks/useTranslate';

export default function Footer() {
  const [menu, setNavigation] = useState<MenuItem[] | null>(null);
  const { settings } = useSettings();
  const year = new Date().getFullYear();
  const { language } = useLanguage();
  const { translate } = useTranslate(language);

  const [copyright, setCopyright] = useState('');
  const [rights, setRights] = useState('');

  const loadNavigation = useCallback(async () => {
    try {
      const [footerMenu] = await Promise.all([fetchNavigation('footer')]);
      if (footerMenu) setNavigation(footerMenu);
    } catch (error) {
      console.error('Error loading navigation:', error);
    }
  }, []);

  const _translate = useCallback(
    async (text: string) => await translate(text),
    [translate]
  );

  useEffect(() => {
    loadNavigation();
  }, [loadNavigation]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const rights = await _translate('Todos os direitos reservados.');
      const copyright = await _translate('Desenvolvido por Dourado.cash');
      if (mounted) {
        setCopyright(rights);
        setRights(copyright);
      }
    })();
    return () => { mounted = false };
  }, [_translate]);

  return (
    <Container className="bg-white py-5 rounded-t-2xl">
      <div className="container m-auto px-5">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 py-5">
          <div className='flex flex-col gap-4 2xl:flex-row 2xl:gap-[9rem]'>

            {settings?.custom_logo && (<Link href="/">
              <LazyLoadImage
                src={settings?.custom_logo}
                alt={settings?.blog_info?.name}
                width={160}
                height={40}
                className="h-auto"
              />
            </Link>)}

            <div className="flex flex-col gap-4 md:max-w-[400px]">
              {settings?.social_networks && (<SocialNetworks className="text-xl" data={settings?.social_networks ?? []} />)}
              {(settings && rights && copyright) && (<p className="text-sm lg:text-md text-gray-700 leading-normal mt-2"
                  dangerouslySetInnerHTML={{
                    __html: `© ${year} ${settings?.blog_info?.name}. ${rights} <br/> ${copyright}`
                  }}
              />)}
            </div>
          </div>

          {menu && (<Navigation
            defaultexpanded="on"
            className="flex-1"
            ListClassName="gap-8 md:gap-4 xl:gap-[8rem] flex-col md:flex-row md:justify-end"
            data={menu}
          />)}
        </div>
      </div>
    </Container>
  );
}
