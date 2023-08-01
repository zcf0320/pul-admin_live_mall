export interface TableListItem {
  buyUserId: number; //buyUserId	购买订单用户Id	integer
  buyUserPhone: string; //buyUserPhone	购买者账户	string
  channelId: number; //channelId	渠道ID	integer
  channelName: string; //channelName	渠道名称	string
  commissionRate: string; //commissionRate	佣金比例（%）	string
  createId: number; //createId	创建人	integer
  createTime: string; //createTime	创建时间	string
  distributionTime: string; //distributionTime	佣金发放时间	string
  estimatedCommission: string; //estimatedCommission	预估佣金	string
  id: number; //id	ID	integer
  isDelete: boolean; //isDelete		boolean
  isVirtual: boolean; //isVirtual	是否虚拟商品	boolean
  modifyId: number; //modifyId	更新人	integer
  modifyTime: string; //modifyTime	更新时间	string
  orderId: number; //orderId	订单Id	integer
  orderNo: string; //orderNo	订单编号	string
  payPrice: string; //payPrice	支付金额	string
  payTime: string; //payTime	订单支付时间	string
  realCommission: string; //realCommission	实际佣金	string
  remark: string; //remark	备注	string
  serialNo: string; //serialNo	流水号	string
  settleFlag: string; //settleFlag	状态：0-待结算 1-已结算 2-已发放,可用值:TO_BE_SETTLED,SETTLED,ISSUED	string
  settleTime: string; //settleTime	结算时间	string
  settledAmount: string; //settledAmount	参与结算金额	string
  tenantId: number; //tenantId		integer
}
