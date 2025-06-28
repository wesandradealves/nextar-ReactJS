"use client";

import { useEffect, useState, useMemo } from 'react';
import { Container } from './styles';
import { Props } from './typo';
import { IconType } from 'react-icons';

export default function SocialNetworks({ data, className }: Props) {
    const [icons, setIcons] = useState<{ [key: string]: IconType }>({});

    const iconNameMap = useMemo<Record<string, string>>(() => ({
        facebook: 'FaFacebookF', 
        linkedin: 'FaLinkedin', 
        youtube: 'FaYoutube',  
    }), []);

    useEffect(() => {
        if (data) {
            const loadIcons = async () => {
                const loadedIcons: { [key: string]: IconType } = {};
                for (const item of data) {
                    if (!item.title) continue;
                    const normalizedTitle = item.title.toLowerCase();
                    const iconName = iconNameMap[normalizedTitle] || `Fa${item.title}`;
                    try {
                        const iconModule = await import('react-icons/fa');
                        loadedIcons[normalizedTitle] = iconModule[iconName as keyof typeof iconModule] as IconType;
                    } catch {
                        console.error(`Icon ${iconName} not found`);
                    }
                }
                setIcons(loadedIcons);
            };

            loadIcons();
        }
    }, [data, iconNameMap]);

    return (
        <Container className={`socialNetworks ${className}`}>
            <div className="flex gap-4">
                    {(Array.isArray(data) ? data : [])
                        .filter((item) => item.title && item.url)
                        .map((item, index) => {
                        const IconComponent = icons[item.title.toLowerCase()];
                        return (
                            <a
                                key={index}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {IconComponent ? <IconComponent /> : item.title}
                            </a>
                        );
                    })}
            </div>
        </Container>
    );
}