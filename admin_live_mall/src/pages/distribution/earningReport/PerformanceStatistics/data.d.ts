export interface DataType {
  customerCount: string; //累计客户	integer
  directOrderAmount: string; //直推订单额	string
  directOrderNum: number; //直推订单数	integer
  id: string; //团长ID	integer
  image: string; //团长头像	string
  indirectOrderAmount: string; //分佣订单额	string
  indirectOrderNum: number; //分佣订单数	integer
  inviteCount: number; //邀请人数	integer
  name: string; //团长名字	string
  phone: string; //团长手机号	string
  settledCommission: string; //已结算佣金	string
  toBeSettledCommission: string; //待结算佣金
}
