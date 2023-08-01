export interface IRegion {
  adCode: string;
  center: string;
  cityCode: string;
  createId: number;
  createTime: string;
  id: string;
  isDelete: true;
  level: string;
  modifyId: number;
  modifyTime: string;
  name: string;
  orderNum: number;
  parentId: number;
  path: string;
  children: [] | IRegion[];
}
export type SpecValue = {
  id: number;
  specId: number;
  value: string;
};
