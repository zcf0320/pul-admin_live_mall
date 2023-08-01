export type TableListItem = {
  afterSaleNo: string; //	售后维权单号	string
  afterSaleReason: string; //	申请售后原因	string
  afterSaleStatus: number; //	售后状态1.待处理 2.处理中 3.已完成	integer
  afterSaleType: number; //	售后类型 1.待发货退款 2.已发货退款 3.退货退款 4.退货待买家发货 5.退货待商家退货	integer
  applyStartTime: string; //	申请开始时间	string
  createId: string; //	创建人	integer
  createTime: string; //	创建时间	string
  id: string; //	ID	integer
  isDelete: boolean; //		boolean
  modifyId: string; //	更新人	integer
  modifyTime: string; //	更新时间	string
  orderId: string; //订单编号	string
  orderMoney: string; //	订单金额	number
  productName: string; //	售后商品名称	string
  refundMoney: string; //	退款金额	number
  refundState: string; //	退款状态 1.商家已同意退货申请,待买家退货 2.申请退款待商家处理 3.商家拒绝退款,待买家处理 4.商家拒绝退货退款,待买家处理 5.平台介入,售后处理中 6.买家已退货,待商家确认收获 7.退款到账中 8.退款成功 9.退款关闭,商家拒绝 10.退款关闭,买家取消,可用值:SHOP_AGREE_REFUND_PRODUCT_WAIT_BUYER_REFUND_PRODUCT,APPLY_REFUND_MONEY_WAIT_SHOP_HANDLE,SHOP_REFUSE_REFUND_MONEY_WAIT_BUYER_HANDLE,SHOP_REFUSE_REFUND_MONEY_PRODUCT_WAIT_BUYER_REFUND,ROOT_ADD_HANDLING,BUYER_REFUND_PRODUCT_WAIT_SHOP_CONFIRM,REFUNDING_MONEY,REFUND_MONEY_SUCCESS,REFUND_MONEY_CLOSE_SHOP_REFUSE,REFUND_MONEY_CLOSE_BUYER_CANCEL	string
  shopId: string; //	店铺ID	integer
  tenantId: string; //	租户ID	integer
  userId: string; //	用户id	integer
  userName: string; //	用户名称	string
  logisticsNo: string;
};
