"use client";

import { useState, useRef, useEffect } from 'react';
import { Container, Item, Flag } from './styles';
import { Props } from './typo';
import classNames from 'classnames';
import { Language, useLanguage } from '@/context/language';
import { getAvailableLanguages } from '@/services/languageService';

export default function LanguageSwitcher({ float, effect, className }: Props) {
  const { language, setLanguage } = useLanguage();
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const [availableLangs, setAvailableLangs] = useState<string[]>([]);
  const containerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setMounted(true);

    getAvailableLanguages()
      .then(setAvailableLangs)
      .catch(() => setAvailableLangs(['pt']));

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowAll(false);
      }
    };

    const handleScroll = () => {
      setShowAll(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLanguageChange = (code: string) => {
    if (float === 'on' && !showAll) {
      setShowAll(true);
      return;
    }
    setLanguage(code as Language);
    if (float === 'on') {
      setShowAll(false);
    }
    window.location.reload();
  };

  return (
    <Container
      ref={containerRef}
      className={classNames('flex items-center gap-4', {
        'fixed bottom-0 p-12 right-0': float === 'on',
        [className || '']: className,
      })}
    >
      {mounted && availableLangs.length > 0 && (
        availableLangs.map((lang: string, idx: number) => {
          const isCurrentLang = language === lang;
          const shouldHide = float === 'on' && language && !isCurrentLang && !showAll;
          const flagCode = lang === 'pt' ? 'br' : lang === 'en' ? 'us' : lang;
          return (
            <Item
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={classNames('block cursor-pointer', {
                'current': isCurrentLang,
                'hidden': shouldHide,
              })}
            >
              <Flag
                data-code={lang}
                title={lang}
                onMouseEnter={() => setHoveredItem(idx)}
                onMouseLeave={() => setHoveredItem(null)}
                className={classNames(`block relative fi fi-${flagCode}`, {
                  [`animate__animated animate__${effect}`]: effect && hoveredItem === idx
                })}
                float={float}
              />
            </Item>
          );
        })
      )}
    </Container>
  );
}
