export interface ShopInfo {
  bottomLogo: string; //bottomLogo	底部logo	string
  createTime: string; //createTime	创建时间	string(date-time)
  endTime: string; //endTime	到期时间	string(date-time)
  id: number; //id	店铺id	integer(int64)
  industry1Id: number; //industry1Id	行业1	integer(int64)
  industry2Id: number; //industry2Id	行业2	integer(int64)
  introduction: string; //introduction	店铺简介	string
  logo: string; //logo	店铺logo	string
  manager: string; //manager	联系人	string
  mobile: string; //mobile	联系人手机号	string
  name: string; //name	店铺名称	string
  openStoreType: string; //openStoreType	营业时间类型,可用值:ALL_DAY,EVERY_DAY,EVERY_WEEK	string
  remark: string; //remark	备注	string
  startTime: string; //startTime	开始时间	string(date-time)
  status: boolean; //status	是否启用/禁用	boolean
  tradeStatus: boolean; //tradeStatus	营业状态	boolean
  qrCode: string;
}

export interface UserInfo {
  createTime: string;
  headImage: string;
  id: string;
  mobile: string;
  modifyTime: string;
  realName: string;
  roleNames: string;
  roles: string;
  tenantId: string | number;
  userName: string;
}
