// export interface TableListItem {
//   commissionOrderAmount: string; //commissionOrderAmount	达到分佣订单额条件	string
//   commissionOrderCount: number; //commissionOrderCount	分佣订单数达到条件	integer
//   createId: number; //createId	创建人	integer
//   createTime: string; //createTime	创建时间	string
//   customerCount: number; //customerCount	达到累计客户数条件	integer
//   directCommissionRate: string; //directCommissionRate	直推佣金系数	string
//   id: number; //id	ID	integer
//   invitationRewardRate: string; //invitationRewardRate	邀请奖励系数	string
//   inviteCount: number; //inviteCount	邀请人数达到条件	integer
//   isDelete: boolean; //isDelete		boolean
//   level: number; //level	等级	integer
//   method: number; //method	满足方式 1-勾选满足其一即可 2-勾选条件需全满足	integer
//   modifyId: number; //modifyId	更新人	integer
//   modifyTime: string; //modifyTime	更新时间	string
//   name: string; //name	等级名称	string
//   settledCommissionAmount: string; //settledCommissionAmount	达到已结算佣金金额条件	string
//   shopId: number; //shopId	店铺ID	integer
//   tenantId: number; //tenantId	租户ID	integer
//   totalAmount: string; //totalAmount	累计消费额达到条件	string
//   customerTotal: number; //客户数
// }

export interface TableListItem {
  createId: number; //createId	创建人	integer
  createTime: string; //createTime	创建时间	string
  customerTotal: number; //customerTotal	客户总数	integer
  directCommissionRate: string; //directCommissionRate	直推佣金系数	string
  id: number; //id	ID	integer
  isDelete: boolean; //isDelete		boolean
  level: number; //level	等级	integer
  modifyId: number; //modifyId	更新人	integer
  modifyTime: string; //modifyTime	更新时间	string
  name: string; //name	等级名称	string
  shopId: number; //shopId	店铺ID	integer
  tenantId: number; //tenantId	租户ID	integer
}
