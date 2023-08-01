export interface TableListItem {
  status: boolean;
  createId: number; //createId	创建人	integer
  createTime: string; //createTime	创建时间	string
  customerNum: number; //customerNum	客户数量	integer
  id: string; //id	ID	integer
  image: string; //image	头像	string
  isClear: boolean; //isClear	已清除	boolean
  isDelete: boolean; //isDelete		boolean
  level: number; //level	等级	integer
  levelName: string; //levelName	等级名称
  modifyId: number; //modifyId	更新人	integer
  modifyTime: string; //modifyTime	更新时间	string
  name: string; //name	名称	string
  phone: string; //phone	手机号	string
  remarkName: string; //remarkName	备注名称	string
  settledCommission: string; //settledCommission	已结算佣金	string
  shopId: number; //shopId	店铺ID	integer
  supId: number; //supId	上级ID	integer
  supName: string; //supName	上级名称	string
  supPhone: string; //supPhone	上级手机号	string
  supRemarkName: string; //supRemarkName	上级备注名称	string
  tenantId: number; //tenantId	租户ID	integer
  toBeSettledCommission: string; //toBeSettledCommission	待结算佣金	string
  userId: number; //userId	用户ID	integer
  type: string; // 结算类型
  isDefault: boolean; // 是否系统默认账户
  tutorId: string; // 客户经理id
}
