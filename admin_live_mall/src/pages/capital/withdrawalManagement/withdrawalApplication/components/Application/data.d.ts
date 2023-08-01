export interface DataType {
  id: string;
  name: string;
  age: number;
  address: string;
  title?: string;
  dataIndex?: string;
  paick: string;
  num: string;
  xin: string;
}
export interface RequestType {
  address: string;
  age: string[];
  current: number;
  name: string;
  num: string;
  pageSize: number;
  xin: string;
}
