export type TableListItem = {
  createId: number; //创建人id
  createTime: string; //创建时间
  id: number; //id
  ip: string;
  isDelete: boolean; //逻辑删除
  modifyId: number; //修改人id
  modifyTime: string; //修改时间
  module: string;
  requestMethod: string;
  requestParams: string;
  requestResult: string;
  requestUrl: string;
  runTime: number;
  tenantId: number;
  type: string;
  userId: number;
  username: string;
};
