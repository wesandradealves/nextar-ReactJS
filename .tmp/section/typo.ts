 
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Props {
    title?: string;
    subtitle?: string;
    text?: string;
    backgroundimage?:any;
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
    barstitle?: string | boolean;
    opacity?: number;
    gap?: any;
    [key: string]: any;
}