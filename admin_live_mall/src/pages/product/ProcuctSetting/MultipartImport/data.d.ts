export type TableListItem = {
  createId: number; //	创建人	integer
  createTime: string; //	创建时间	string
  extra: string; //	扩展数据	string
  extraObj: any; //		object
  fail: number; //	失败数	integer
  id: string; //	ID	integer
  isDelete: boolean; //		boolean
  modifyId: string; //	更新人	integer
  modifyTime: string; //	更新时间	string
  operator: string; //	操作人员	string
  shopId: string; //	店铺ID	integer
  status: string; //	状态	string
  success: string; //成功数	integer
  taskType: string; //任务类型,可用值:SYNC_GOODS_STOCK,IMPORT_CUSTOMER	string
  tenantId: string; //	租户ID	integer
  total: number; //导入总数	integer
};
export type SpecValue = {
  id: number;
  specId: number;
  value: string;
};
