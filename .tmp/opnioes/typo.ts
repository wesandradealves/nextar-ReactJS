export interface Data {
    rating: number;
    text?: string;
    title: string;
}
  
export interface Props {
    classname: string;
    data: Data[];
}