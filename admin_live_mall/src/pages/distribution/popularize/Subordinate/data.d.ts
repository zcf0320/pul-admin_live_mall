export interface SubUserInfo {
  consumptionAmount: string; //consumptionAmount	累计消费金额	string
  consumptionNum: number; //consumptionNum	消费次数	integer
  consumptionTime: string; //consumptionTime	最近消费时间	string
  growthValue: number; //growthValue	会员成长值	integer
  headImage: string; //headImage	头像	string
  id: number; //id	id	integer
  identity: string; //identity	身份（UserIdentityEnum）：0-普通客户 1-团长 2-合伙人,可用值:CUSTOMER,TEAM,PARTNER,TEAM_AND_PARTNER	string
  inviteCode: string; //inviteCode	邀请码	string
  lastLoginTime: string; //lastLoginTime	上次登录时间	string
  level: number; //level	会员等级	integer
  levelName: string; //levelName	会员等级	string
  membershipTime: string; //membershipTime	成为会员时间	string
  phone: string; //phone	手机号码	string
  registerTime: string; //registerTime	注册时间	string
  source: string; //source	来源(枚举：UserSourceEnum),可用值:IMPORT,APPLET	string
  status: boolean; //status	状态: 0-正常 1-冻结	boolean
  userName: string; //userName	账户名称	string
}
