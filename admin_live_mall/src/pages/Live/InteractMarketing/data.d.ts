import { IProduct } from '@/api/type';

export interface ILiveActive {
  activityId: number; //	活动ID	integer
  condition: string; //	参与条件,可用值:DIRECT_GET,SIGN	string
  goods: number; //	活动奖品ID	array	integer
  liveRoomId: number; //	直播间ID	integer
  name: string; //	活动名称	string
  id: string;
  productList: Array<IProduct>; //	中奖商品列表	array	Product
  status: string; //	活动状态,可用值:NO_START,RUNNING,END	string
  type: string; //	活动类型,可用值:FUDAI,SIGN	string
}

export interface ActiveUser {
  createId: string; //	创建人	integer
  createTime: string; //	创建时间	string
  enterTime: string; //	进入直播间时间	string
  exitTime: string; //	退出直播间时间	string
  id: string; //	ID	integer
  liveActivityId: string; //	直播间营销活动ID	integer
  liveRoomId: string; //	直播间ID	integer
  modifyId: string; //	更新人	integer
  modifyTime: string; //	更新时间	string
  phone: string; //	用户手机号	string
  shopId: string; //	店铺ID	integer
  tenantId: string; //	租户ID	integer
  totalTime: string; //	累计时长	integer
  userId: string; //	用户ID	integer
  userName: string; //	用户名	string
  headImage: string;
}
