export interface Data {
    id: number;
    type: string;
    machine_name: string;
    attrs: unknown[];
    innerContent: string[];
}
  
export interface Props {
    data: Data[];
}