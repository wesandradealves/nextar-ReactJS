/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Props {
    title?: string;
    subtitle?: string;
    backgroundimage?: any;
    background?: string;
    backgroundcolor?: string;
    backgroundsize?: string;
    backgroundposition?: string;
    backgroundattachment?: string;
    classname?: string;
    id?: string;
    direction?: string;
    helper?: string;
    children?: React.ReactNode;
    barstitle?: string;
    opacity?: number;
    gap?: any;
    [key: string]: any;
}

export interface CardItem {
    classname?: string;
    title: string;
    text: string;
    image?: number | string;
    gap?: string;
    imagealign?: string;
    alignmentClass?: string;
    alignment?: string;
}

export interface BoxItem {
    classname: string;
    title: string;
    justify: string;
    alignment: string;
    wrap: string;
    cards: CardItem[];
}

export type GroupedBoxes = BoxItem[];
