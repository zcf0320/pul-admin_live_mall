export interface TableListItem {
  createTime: string; //	创建时间	string
  dividePartner: boolean; //	合伙人分佣开关	boolean
  divideTeam: boolean; //	团长分佣开关	boolean
  factGmv: number; //	实际销量	integer
  id: string; //	ID	integer
  initialGmv: number; //	起始销量	integer
  isJoinExtension: boolean; //	是否参与推广	boolean
  mainPic: Array<string>; //	商品主图	string
  marketPrice: string; //	划线价	string
  modifyTime: string; //	更新时间	string
  name: string; //	商品名称	string
  productId: number; //	商品 ID	integer
  salePrice: string; //	销售价	string
  stockCount: number; //	库存数量	integer
  subName: string; //	商品副标题	string
}
