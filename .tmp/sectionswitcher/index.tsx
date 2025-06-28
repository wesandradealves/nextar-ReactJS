"use client";

import { useState, useEffect, useRef, useMemo, useCallback} from 'react';
import DynamicComponent from '../DynamicComponent';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MenuItem, MenuProps, OutlinedInput } from '@mui/material';
import { useTheme } from 'styled-components';
import classNames from 'classnames';

import { Container, SectionHeader, Subtitle, Title } from '../section/styles';
import { Props } from '../section/typo';
import { MediaService } from '@/services/mediaService';
import { ContentService, ContentItem } from '@/services/ContentService';

const Sectionswitcher = (props: Props) => {
    const [selectedValue, setSelectedValue] = useState<string[]>(props?.components?.length ? [props.components[0]] : []);
    const [isExpanded, setIsExpanded] = useState(false);
    const [Icon, setIcon] = useState<React.ComponentType<{ className?: string }> | null>(null);
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | undefined>(undefined);
    const [contentData, setContentData] = useState<ContentItem[] | null>(null);

    const selectRef = useRef<HTMLDivElement>(null);
    const menuContainerRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    const fetchBackgroundImage = useCallback(async () => {
        if (props.backgroundimage) {
            try {
                const bgImage = await MediaService(Number(props.backgroundimage));
                if (bgImage && bgImage.source_url) {
                    setBackgroundImageUrl(bgImage.source_url);
                }
            } catch (error) {
                console.error("Error fetching background image:", error);
            }
        }
    }, [props.backgroundimage]);

    useEffect(() => {
        fetchBackgroundImage();
    }, [fetchBackgroundImage]);

    const handleChange = useCallback((event: SelectChangeEvent<string[]>) => {
        setContentData(null);
        setSelectedValue(typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value);
    }, []);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setIsExpanded(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    useEffect(() => {
        const loadIcon = async () => {
            const { FaAngleDown, FaAngleUp } = await import('react-icons/fa');
            setIcon(() => (isExpanded ? FaAngleUp : FaAngleDown));
        };
        loadIcon();
    }, [isExpanded]);

    const normalizeType = (type: string): string => {
        const typeMap: Record<string, string> = {
            media: 'midia',
        };
        return typeMap[type] || type;
    };

    const fetchContent = useCallback(async () => {
        try {
            if (selectedValue.length > 0) {
                const [typeRaw, id] = selectedValue[0].split(':');
                const type = normalizeType(typeRaw);
                const data = id ? await ContentService(type, id) : await ContentService(type);
                setContentData(Array.isArray(data) ? data.filter((item): item is ContentItem => !!item) : [data].filter((item): item is ContentItem => !!item));
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    }, [selectedValue]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const memoizedContent = useMemo(() => contentData, [contentData]);

    const customMenuProps = useMemo<Partial<MenuProps>>(() => ({
        PaperProps: {
            sx: {
                bgcolor: '#1B1F28',
                color: '#ffffff',
                borderRadius: '0',
                boxShadow: '0px 0 0 rgba(0, 0, 0, 0.25)',
                maxHeight: '300px',
                overflowY: 'auto',
                position: 'absolute',
            },
        },
        MenuListProps: {
            sx: {
                top: 0,
                padding: 0,
            }
        },
        container: menuContainerRef.current,
    }), []);

    const renderTitleSection = useMemo(() => {
        if (!(props?.helper || props?.title || props?.subtitle)) return null;

        return (
            <SectionHeader className="flex flex-col justify-center items-center text-center w-full gap-7">
                {(props?.helper || props?.title) && (
                    <span>
                        {props?.title && (
                            <Title
                                barstitle={props?.barstitle}
                                className={classNames(`text-center relative text-2xl lg:text-5xl`, {
                                    'pt-2 pb-2 lg:ps-[150px] lg:pe-[150px]': !!props?.barstitle
                                })}
                                dangerouslySetInnerHTML={{ __html: props.title }}
                            />
                        )}
                    </span>
                )}
                {props?.subtitle && (
                    <Subtitle
                        className="text-center"
                        dangerouslySetInnerHTML={{ __html: props.subtitle }}
                    />
                )}
            </SectionHeader>
        );
    }, [props?.helper, props?.title, props?.subtitle, props?.barstitle]);

    return (
        <Container
            id={props?.id}
            background={props?.background}
            backgroundcolor={props?.backgroundcolor}
            backgroundimage={backgroundImageUrl || ''}
            backgroundposition={props?.backgroundposition}
            backgroundsize={props?.backgroundsize}
            backgroundattachment={props?.backgroundattachment}
            className={classNames(`w-full m-auto relative ${props?.classname}`, {
                'overflow-hidden': props?.opacity
            })}
        >
            <div className={classNames(
                `container flex-wrap text-lg lg:text-3xl leading-none relative z-10 m-auto flex`,
                `flex-${props?.direction ?? 'col'}`,
                `pt-[6rem] pb-[6rem] gap-${props?.gap || 7}`
            )}>
                {renderTitleSection}

                {props?.components && (
                    <div className='flex flex-col xl:flex-row flex-wrap justify-between gap-12 xl:gap-[90px] items-start xl:pt-12 relative w-full'>
                        <div
                            ref={selectRef}
                            className={classNames(`flex mx-auto flex-wrap relative bg-[#1B1F28] shadow-lg transition-none lg:text-3xl font-bold w-full lg:w-[273px] items-center flex-wrap justify-between ps-6`, {
                                'rounded-full': !isExpanded,
                                'rounded-tl-[40px] rounded-tr-[40px]': isExpanded
                            })}
                        >
                            <Select
                                onOpen={() => setIsExpanded(true)}
                                onClose={() => setIsExpanded(false)}
                                MenuProps={{
                                    ...customMenuProps,
                                    container: menuContainerRef.current,
                                    disablePortal: true,
                                }}
                                sx={{
                                    '.MuiOutlinedInput-input': {
                                        marginRight: '-100px',
                                        fontFamily: 'Montserrat',
                                        lineHeight: 1.5,
                                        color: '#ffffff',
                                        fontWeight: '700',
                                        fontSize: {
                                            xs: '24px',
                                            lg: '28px',
                                            xl: '32px',
                                        },
                                    },
                                    '.MuiPopover-root': {
                                        position: 'absolute',
                                        '.MuiPaper-root': {
                                            margin: '-2px 0 0 -24px',
                                            borderRadius: '0 0 40px 40px',
                                            paddingBottom: '16px',
                                            top: '100% !important',
                                            minWidth: 'initial !important',
                                            maxWidth: 'initial !important',
                                            width: 'calc(100% + 84px) !important',
                                            left: '0 !important'
                                        },
                                    },
                                    '.MuiSelect-icon': {
                                        display: 'none',
                                    },
                                    '.MuiOutlinedInput-notchedOutline': { borderStyle: 'none' },
                                }}
                                className="flex-1 appearance-none bg-none cursor-pointer"
                                value={selectedValue}
                                onChange={handleChange}
                                input={<OutlinedInput />}
                            >
                                {props.components.map((item: string) => (
                                    <MenuItem
                                        key={item}
                                        value={item}
                                        sx={{
                                            '&:hover': {
                                                bgcolor: '#333333',
                                            },
                                            '&.Mui-selected': {
                                                bgcolor: '#444444',
                                                color: '#FFD700',
                                            },
                                        }}
                                    >
                                        {item.toLocaleUpperCase()}
                                    </MenuItem>
                                ))}
                            </Select>

                            {Icon && (
                                <div className='pe-6' style={{ color: theme._colors.primary.bdm3 }}>
                                    <Icon className="pointer-events-none cursor-pointer text-4xl" />
                                </div>
                            )}
                            <div ref={menuContainerRef} id="menu-container" />
                        </div>

                        <div className='flex-1 relative w-full'>
                            <div className='grid grid-cols-1'>
                                {contentData && (
                                    <DynamicComponent data={memoizedContent} classname="overflow-hidden w-full" machineName={selectedValue[0]} />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {props?.opacity && (
                <div className={classNames(
                    `absolute z-1 bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed bg-black`,
                    `opacity-${props.opacity}`
                )} />
            )}
        </Container>
    );
};

export default Sectionswitcher;
