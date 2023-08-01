import { IProduct } from '@/api/type';

export interface TableListItem {
  activityId: string; //	活动ID	integer
  goods: string; //	活动奖品ID	integer
  id: string; //		integer
  liveRoomId: string; //	直播间ID	integer
  lotteryPersons: string; //	中奖人数	integer
  name: string; //	活动名称	string
  persons: string; //	参与福袋活动人数	integer
  product: IProduct;
  status: string; //	活动状态,可用值:RUNNING,END	string
}

export interface ILuckyBagDetail {
  createTime: string; //	创建时间	string(date-time)
  goodsName: string; //	商品名称	string
  id: string; //		integer(int64)
  liveRooms: string; //	直播间个数	integer(int64)
  lotteryPersons: string; //	中奖人数	integer(int64)
  name: string; //	福袋名称	string
  persons: number; //	参与人数	integer(int64)
}
