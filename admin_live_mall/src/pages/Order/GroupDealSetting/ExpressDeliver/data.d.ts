export type TableListItem = {
  createId: number; //	创建人	integer
  createTime: string; //		创建时间	string
  icon: string; //		分类图标	string
  id: number; //	ID	integer
  level: number; //	层级	integer
  modifyId: number; //	更新人	integer
  modifyTime: string; //		更新时间	string
  name: string; //		分类名称	string
  parentId: number; //	父ID	integer
  parentName: string; //	父分类名称	string
  sort: number; //	排序	integer
  status: number; //	状态：0-下架 1-上架	integer
};
export type SpecValue = {
  id: number;
  specId: number;
  value: string;
};

export interface IDeliverCompany {
  id: string;
  createId: string;
  modifyId: string;
  createTime: string;
  modifyTime: string;
  deliveryCode: string;
  deliveryName: string;
  deliveryLogo: string;
  type: number;
  status: boolean;
}
