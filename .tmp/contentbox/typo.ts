export interface CTA {
  btnLabel: string;
  link: string;
  classname: string;
  effect: string;
}

export interface Props {
  id?: string;
  className?: string;
  media?: number | string;
  title?: string;
  text?: string;
  alignment?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  reverse?: boolean | string;
  cta?: number;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [key: string]: any;
}