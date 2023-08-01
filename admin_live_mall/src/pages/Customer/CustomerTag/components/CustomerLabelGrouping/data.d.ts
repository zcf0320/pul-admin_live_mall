export interface DataType {
  id: string;
  groupName: string;
  name?: string;
}
export interface GroupListType {
  createId: string;
  createTime: string;
  id: string;
  isDelete: boolean;
  modifyId: string;
  modifyTime: string;
  name: string;
  pid: string;
  shopId: string;
  tenantId: string;
  type: string;
}
export interface GroupDataType {
  id: string;
  groupName: string;
  labelList: GroupListType[];
}
