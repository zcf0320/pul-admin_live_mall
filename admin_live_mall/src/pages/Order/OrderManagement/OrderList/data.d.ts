export type TableListItem = {
  buyCount: number; //	购买数量	integer(int32)
  closeTime: string; //订单关闭时间	string(date-time)
  createId: number; //	创建人	integer(int64)
  createTime: string; //	创建时间	string(date-time)
  freight: string; //	运费	string
  hasEvaluated: string; //	是否已评价	boolean
  id: number; //	ID	integer(int64)
  logisticsName: string; //	物流名称	string
  logisticsNo: string; //物流单号	string
  modifyId: number; //	更新人	integer(int64)
  modifyTime: string; //	更新时间	string(date-time)
  orderNo: string; //	订单号	string
  orderTime: string; //下单时间	string(date-time)
  payAmount: string; //	支付金额	string
  payTime: string; //	支付时间	string(date-time)
  receiveAddress: string; //	收货人地址	string
  receiveArea: string; //	收货人区/县	string
  receiveCity: string; //	收货人城市	string
  isVirtual: boolean;
  receiveName: string; //	收货人姓名	string
  receiveStreet: string; //	收货人街道	string
  receivePhone: string; //	收货人电话	string
  receiveProvince: string; //	收货人省份	string
  receivingTime: string; //	收货时间	string(date-time)
  remark: string; //	备注	string
  shipTime: string; //	发货时间	string(date-time)
  status: OrderStatus; //	订单状态,可用值:CLOSE,WAIT_PAY,TO_SHIP,TO_RECEIVE,FINISH	string
  totalPrice: string; //	总价	string
  userId: number; //	购买人Id	integer(int64)
  userPhone: string; //	购买人手机号	string
  phone: string; // 买家手机号
  userName: string; //买家姓名
  orderItems: {
    amount: string; //	金额	string
    coverPic: string; //	封面图	string
    createId: number; //		创建人	integer
    createTime: string; //	创建时间	string
    id: number; //	ID	integer
    isDelete: boolean; //	boolean
    modifyId: number; //		更新人	integer
    modifyTime: string; //	更新时间	string
    num: number; //	购买数量	integer
    orderId: number; //	订单Id	integer
    productId: number; //		商品Id	integer
    productName: string; //	商品名称:string;//	string
    skuCode: string; //	sku编码	string
    skuId: number; //		规格Id	integer
    specsName: string; //	规格名称	string
    specsPic: string; //	规格图	string
    specsUnit: string; //	单位	string
    userId: number; //	用户Id	integer
  }[];
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
