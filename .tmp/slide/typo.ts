export interface SLIDE {
  media?: number | string;
  title?: string;
  subtitle?: string;
  text?: string;
}

export interface Props {
  id?: string;
  className?: string;
  slider?: number;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [key: string]: any;
}