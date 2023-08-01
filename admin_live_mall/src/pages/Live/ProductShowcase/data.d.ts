export interface TableListItem {
  click: number; //	点击人数	integer
  createId: string; //	创建人	integer
  createTime: string; //	创建时间	string
  goodsName: string; //	商品名称	string
  id: string; //	ID	integer
  isDelete: boolean; //			boolean
  liveRoomId: string; //	直播间ID	integer
  mainPic: string; //	商品主图	string
  modifyId: string; //	更新人	integer
  modifyTime: string; //	更新时间	string
  price: string; //	商品价格	number
  productId: string; //	原商品ID	integer
  shopId: string; //	店铺ID	integer
  show: boolean; //	显示	boolean
  sorted: string; //	排序	integer
  status: string; //	状态	string
  stock: string; //	商品库存	integer
  tenantId: string; //	租户ID	integer
}
