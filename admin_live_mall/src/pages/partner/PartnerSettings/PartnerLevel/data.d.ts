export type TableListItem = {
  id: string;
  name: string;
  render?: () => void;
  level: number;
  customerTotal: string;
  status: boolean;
  directCommissionRate: string;
  isDefault?: boolean;
};

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
