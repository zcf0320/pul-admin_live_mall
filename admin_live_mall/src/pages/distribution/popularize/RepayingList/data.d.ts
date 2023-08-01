export interface TableListItem {
  clearId: number; //clearId	清退操作人ID	integer
  clearName: string; //clearName	清退操作人名称	string
  clearPhone: string; //clearPhone	清退操作人手机号	string
  createId: number; //createId	创建人	integer
  createTime: string; //createTime	创建时间	string
  id: number; //id	ID	integer
  isDelete: boolean; //isDelete		boolean
  modifyId: number; //modifyId	更新人	integer
  modifyTime: string; //modifyTime	更新时间	string
  remarkName: string; //remarkName	备注名称	string
  shopId: number; //shopId	店铺ID	integer
  supId: number; //supId	原上级ID	integer
  supName: string; //supName	原上级名称	string
  supPhone: string; //supPhone	原上级手机号	string
  supRemarkName: string; //supRemarkName	上级备注名称	string
  teamId: number; //teamId	团长ID	integer
  teamImage: string; //teamImage	团长头像	string
  teamName: string; //teamName	团长名称	string
  teamPhone: string; //teamPhone	团长手机号	string
  tenantId: number; //tenantId	租户ID	integer
  transferId: number; //transferId	转移方ID	integer
  transferName: string; //transferName	转移方姓名	string
  transferPhone: string; //transferPhone	转移方手机号	string
}
