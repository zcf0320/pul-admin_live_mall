export interface ProColumns {
  title: string;
  dataIndex: string;
  className?: string;
  render?: any;
  fixed?: any;
}
export interface TableListItem {
  createId: string;
  createTime: string;
  icon: string;
  id: string;
  isDelete: boolean;
  modifyId: string;
  modifyTime: string;
  name: string;
  rightsDesc: string;
  shopId: string;
  status: boolean;
  tenantId: string;
  type: number;
}
export interface imgType {
  id: number;
  img: string;
}
