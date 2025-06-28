export interface Data {
  title?: string;
  text?: string;
  image?: string;
}

export interface Props {
  className?: string;
  data: Data[];
}