export interface DataType {
  id: string;
  name: string;
  userCount: string;
  createTime: string;
  type: string;
  groupName: string;
  pid: string;
}
export interface FormDataType {
  name: string;
  groupName: string;
}
export interface FormEditType {
  createTime?: string;
  groupName?: string;
  id: string;
  name?: string;
  pid?: string;
  type?: string;
  userCount?: string;
}
export interface GroupDataType {
  id: string;
  name: string;
}
