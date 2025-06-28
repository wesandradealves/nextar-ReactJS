"use client";

import Link from 'next/link';
import { Container, List, ListItem, Submenu } from './styles';
import { Props } from './typo';
import Button from '../button/button';
import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { FaAngleDown } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { MenuItem } from '@/services/navigationService';

export default function Navigation({ children, className, mobile, data, ListClassName, isScrolling, defaultexpanded }: Props & { data: MenuItem[] }) {
    const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});
    const navRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (isScrolling) {
            setExpandedItems({});
        }
    }, [isScrolling]);

    useEffect(() => {
        if (defaultexpanded && Array.isArray(data)) {
            const allExpanded = data.reduce((acc, _, index) => {
                acc[index] = true;
                return acc;
            }, {} as { [key: number]: boolean });
            setExpandedItems(allExpanded);
        }
    }, [defaultexpanded, data]);

    const toggleExpand = (index: number) => {
        setExpandedItems(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (navRef.current && !navRef.current.contains(event.target as Node)) {
            setExpandedItems({});
        }
    };

    const handleResize = () => {
        setExpandedItems({});
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleResize);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Container role='navigation'
            defaultexpanded={defaultexpanded}
            className={classNames(`navigation ${className}`, { '--mobile h-full w-full fixed top-0 z-1000': !!mobile })} ref={navRef}>
            <List
                className={classNames(`list list-none w-full flex leading-none ${ListClassName}`, {
                    'container m-auto flex-col': mobile
                })}>

                {(Array.isArray(data) ? data : []).map(function (row: MenuItem, i: number) {
                    return (
                        <ListItem
                            defaultexpanded={defaultexpanded}
                            className={classNames('item font-bold flex flex-col text-base', row?.className, {
                                'expanded': expandedItems[i],
                                [ListClassName || '']: mobile,
                                'current': pathname && pathname.replaceAll('/', '') == row.url.replaceAll('/', '')
                            })} key={i}>

                            {(row.acf && row.acf.isButton) ? (
                                <Button
                                    className={`${Array.isArray(row.classes) ? row.classes.join(` `) : ''}`}
                                    effect={row.acf.effect}
                                    href={row.children && row.children.length ? '#' : row.url}
                                    tag={'a'}
                                >
                                    {row.title}
                                </Button>
                            ) : <Link className={`flex items-center gap-3 ${Array.isArray(row.classes) ? row.classes.join(` `) : ''}`} title={row.title} href={row.children && row.children.length ? '#' : row.url}>
                                {row.title}

                                {(row?.children && row.children.length && !defaultexpanded) ? <FaAngleDown className='arrow text-2xl' onClick={() => toggleExpand(i)} /> : ''}
                            </Link>}


                            {(row?.children && row.children.length) ? (<Submenu
                                className={classNames('left-0', {
                                    "block": defaultexpanded || !defaultexpanded && expandedItems[i],
                                    "hidden": !defaultexpanded && !expandedItems[i],
                                    "relative top-0": defaultexpanded,
                                    "absolute top-[100%] mt-2 min-w-[125%]": !defaultexpanded
                                })}>
                                <List
                                    className={classNames('list flex flex-col list-none rounded-[10px]', {
                                        "p-0": defaultexpanded,
                                        "py-3 px-6": !defaultexpanded,
                                        [ListClassName || '']: mobile
                                    })}>
                                    {row.children.map(function (row: MenuItem, j: number) {
                                        return (
                                            <ListItem className='item font-normal' key={j}>
                                                <Link title={row.title} href={row.url}>
                                                    {row.title}
                                                </Link>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Submenu>) : ''}
                        </ListItem>
                    );
                })}

                {children && (<>{children}</>)}
            </List>
        </Container>
    );
}