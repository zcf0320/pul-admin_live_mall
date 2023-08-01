// export interface AddLevel {
//   commissionOrderAmount: string; //commissionOrderAmount	达到分佣订单额条件			string
//   commissionOrderCount: number; //commissionOrderCount	分佣订单数达到条件			integer(int32)
//   customerCount: number; //customerCount	达到累计客户数条件			integer(int32)
//   directCommissionRate: string; //directCommissionRate	直推佣金系数			string
//   invitationRewardRate: string; //invitationRewardRate	邀请奖励系数			string
//   inviteCount: number; //inviteCount	邀请人数达到条件			integer(int32)
//   method: number; //method	满足方式 1-勾选满足其一即可 2-勾选条件需全满足			integer(int32)
//   name: string; //name	等级名称			string
//   settledCommissionAmount: string; //settledCommissionAmount	达到已结算佣金金额条件			string
//   totalAmount: string; //totalAmount	累计消费额达到条件			string
//   id: number;
//   level: number;
// }

export interface AddLevel {
  directCommissionRate: string; //directCommissionRate	直推佣金系数
  name: string; //name	等级名称
  id: string;
  level: number;
}
