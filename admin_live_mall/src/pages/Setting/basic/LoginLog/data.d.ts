export type TableListItem = {
  createId: number; //创建人id
  createTime: string; //创建时间
  id: number; //id
  isDelete: boolean; //逻辑删除
  loginIp: string;
  modifyId: number; //修改人id
  modifyTime: string; //修改时间
  region: string;
  tenantId: number;
  userAgent: string;
  userId: number;
  username: string;
};
