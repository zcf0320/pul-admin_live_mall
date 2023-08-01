export interface IStore {
  bottomLogo: string; //	底部logo	string
  createTime: string; //	创建时间	string(date-time)
  endTime: string; //	到期时间	string(date-time)
  id: number; //	店铺id	integer(int64)
  industry1Id: number; //	行业1	integer(int64)
  industry2Id: number; //	行业2	integer(int64)
  introduction: string; //	店铺简介	string
  logo: string; //	店铺logo	string
  manager: string; //	联系人	string
  mobile: string; //	联系人手机号	string
  name: string; //	店铺名称	string
  openStoreType: string; //	营业时间类型,可用值:ALL_DAY,EVERY_DAY,EVERY_WEEK	string
  remark: string; //	备注	string
  startTime: string; //	开始时间	string(date-time)
  status: boolean; //	是否启用/禁用	boolean
  tradeStatus: boolean; //		营业状态	boolean
}
