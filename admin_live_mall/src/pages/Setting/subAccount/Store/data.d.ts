export type TableListItem = {
  bottomLogo: string; //	底部logo	string
  createTime: string; //	创建时间	string
  endTime: string; //	到期时间	string
  id: string; //	店铺id	integer
  industry1Id: string; //	行业1	integer
  industry2Id: string; //	行业2	integer
  introduction: string; //	店铺简介	string
  logo: string; //	店铺logo	string
  manager: string; //	联系人	string
  mobile: string; //	联系人手机号	string
  name: string; //	店铺名称	string
  openStoreType: string; //营业时间类型,可用值:ALL_DAY,EVERY_DAY,EVERY_WEEK	string
  startTime: string; //	开始时间	string
  status: boolean; //	是否启用/禁用	boolean
  tradeStatus: boolean; //	营业状态	boolean
};

export type TableListItemDetail = TableListItem & {
  orderItems: {
    amount: string; //	金额	string
    coverPic: string; //		封面图	string
    createId: number; //	创建人	integer
    createTime: string; //		创建时间	string
    id: number; //	ID	integer
    isVirtual: boolean; //	是否虚拟商品	boolean
    modifyId: number; //	更新人	integer
    modifyTime: string; //		更新时间	string
    num: number; //购买数量	integer
    orderId: number; //	订单Id	integer
    productId: number; //商品Id	integer
    productName: string; //		商品名称	string
    skuCode: string; //	sku编码	string
    skuId: number; //规格Id	integer
    specsName: string; //		规格名称	string
    specsPic: string; //		规格图	string
    specsUnit: string; //		单位	string
    userId: number; //	用户Id	integer
  }[];
};

export type SpecValue = {
  id: number;
  specId: number;
  value: string;
};
