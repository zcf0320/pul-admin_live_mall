export interface RegisterRequestParams {
  brand: string; //	主营品牌		false  string;
  mobile: string; //	手机号		true string;
  name: string; //	商家名称		true string;
  verifyCode: string; //	验证码		truestring;
  registerSign?: string;
}

export interface IStoreInformation {
  brand: string; //	品牌	string
  id: number; //	Id	integer(int64)
  mobile: string; //	移动电话	string
  name: string; //	商家名称	string
  status: 'INIT' | 'APPROVAL' | 'SUCCESS' | 'FAIL' | 'UN_AUTH'; //	状态,可用值:INIT,APPROVAL,SUCCESS,FAIL	string
}

export interface IAddress {
  code: number; //	区划代码	integer(int64)
  level: number; //	级别1-5,省市县镇村	integer(int32)
  name: string; //	名称	string
  pcode: number; //	父级区划代码	integer(int64)
}
export interface ICategory {
  name: string; //分类名称	string
  createId: number; //创建人id	integer(int64)
  createTime: string; //创建时间	string(date-time)
  id: number; //id	integer(int64)
  isDelete: boolean; //逻辑删除	boolean
  level: number; //层级	integer(int32)
  modifyId: number; //修改人id	integer(int64)
  modifyTime: string; //修改时间	string(date-time)
  parentId: number; //父ID	integer(int64)
  sort: number; //排序	integer(int32)
  status: number; //状态：0-下架 1-上架	integer(int32)
}

export interface IPalletProductSpecs {
  price: number; //		零售价	integer(int32)
  supplyPrice: string; //		供货价	string
  stock: string; //	库存数量	string
  name: string; //	规格名称	string
  pic: string; //	规格图	string
  id: string;
  goodsId: string; //	商品Id	integer(int64)
}

export interface ISharePallet {
  shareFields: string[];
  items: IPalletProduct[];
  hasFav: boolean;
  store: IStoreInfo;
}

// export interface IPalletProduct {
//   category1: string; //	一级类目	string
//   category1Name: string; //	一级类目	string
//   category3: string; //	三级类目	string
//   category3Name: string; //	一级类目	string
//   category2: string; //	二级类目	string
//   category2Name: string; //	一级类目	string
//   detail: string; //	详情	string
//   id: string; //	Id	integer(int64)
//   mainPic: string[] | null; //	商品主图	string
//   name: string; //	商品名称	string
//   productUrl: string; //	参考链接	string
//   // qualification: string; //	资格图	string
//   // qualificationId: number; //	品牌Id	integer(int64)
//   price: number;
//   onePiecePrice: number; //
//   originPrice: number;
//   supplyPrice: number;
//   commissionRate: number; //
//   ringPic: string[]; //	轮播图	string
//   skuList: IPalletProductSpecs[];
//   specList: ISpecList;
//   storeId: number; //	Id	integer(int64)
//   monthGmv: string; //	三十日销量	string
//   weekGmv: string; //	七日销量	string
//   sumGmv: string; //	总销量	string
//   supportGetSample: boolean;
//   stock: number; //
//   qualityPeriod: string;
//   material: string;
//   deliveryInfo: string; //
//   sellingPoints: string; //
//   sandBack4Sample: boolean;
//   status: boolean; //	状态：0-下架 1-上架	integer(int32)
// }

// export interface ISku {
//   bmColonelPrice: number; //	帮卖团长价	number
//   colonelPrice: number; //	大团长价	number
//   coreColonelPrice: number; //	核心大团长价	number
//   createId: number; //	创建人	integer
//   createTime: string; //	创建时间	string
//   goodsId: number; //	商品Id	integer
//   groupPrice: number; //	社群团购价	number
//   id: number; //	ID	integer
//   isDelete: boolean; //		boolean
//   modifyId: number; //	更新人	integer
//   modifyTime: string; //	更新时间	string
//   name: string; //	规格名称	string
//   proxyPrice: number; //	总代理价	number
//   publicPrice: number; //	天猫京东价	number
//   skuCode: string; //	sku编码	string
//   specId: string; //	规格ID	string
//   tenantId: number; //	租户ID	integer
// }

export interface ISpec {
  id: number; //		integer
  name: string; //		string
  values: Array<{
    id: number; //		integer
    name: string; //		string
  }>;
}

export interface IPalletProduct {
  id: string;
  brandId: number; //	品牌id	integer(int64)
  brandName: string; //	品牌	string
  categoryName: string; //	商品分类	string
  douYinUrl: string; //	天猫链接	string
  groupUrl: string; //	天猫链接	string
  jdUrl: string; //	天猫链接	string
  kttUrl: string; //	快团团链接	string
  name: string; //	商品名称	string
  pallets: Array<string>; //	货盘列表	array	string
  remark: string; //	备注	string
  skuList: ISku[];
  specList: ISpec[];
  status: number; //	状态：0-下架 1-上架	integer(int32)
  tmallUrl: string; //	天猫链接	string
  weiDianUrl: string; //	天猫链接	string
}

export interface IStoreInfo {
  address: string; //address		string
  annualProduction: string; //annualProduction	年产量	string
  annualSales: string; //annualSales	年销售额	string
  area: string; //area		string
  brand: string; //brand	OEM品牌	string
  category: any[]; //category	主营类目 ID列表	array	integer
  categoryNames: any[]; //categoryNames	主营类目 名字列表	array	string
  city: string; //city		string
  dailyCapacity: string; //dailyCapacity	日产能	string
  deliveryCapacity: string; //deliveryCapacity	发货能力	string
  freezeSign: string; //freezeSign	是否冻结,可用值:NORMAL,FREEZE	string
  headImage: string; //headImage	头像	string
  id: number; //id	Id	integer(int64)
  industrialAdvantages: string; //industrialAdvantages	产业优势	string
  industryAdvantages: string; //industryAdvantages	行业优势	string
  linkName: string; //linkName	联系人姓名	string
  mainSalesChannel: string; //mainSalesChannel	主营销售渠道	string
  mobile: string; //mobile	移动电话	string
  name: string; //name	商家名称	string
  operaProduct: string; //operaProduct	主营产品	string
  photos: any[]; //photos	商家照片	array	string
  province: string; //province		string
  registerSign: string; //registerSign	注册标识	string
  staffSize: string; //staffSize	公司人员规模	string
  status: string; //status	状态,可用值:DISABLE,APPROVAL,SUCCESS,FAIL,UN_AUTH	string
  userId: number; //userId	对应user表id	integer(int64)
  video: string; //video	商家视频	string
}

export interface IPallet {
  id: string; //	ID	integer(int64)
  name: string; //	货盘名称	string
  remark: string; //	备注	string
  status: boolean; //	状态 true/false	boolean
  storeId: number; //	商家ID	integer(int64)
}

export interface IPalletShareRecord {
  id: string; //
  allowTransmit: boolean; //	允许转发	boolean
  endTime: string; //	二维码结束时间	string(date-time)
  palletId: number; //	货盘ID	integer(int64)
  palletName: string; //	货盘名称	string
  password: string; //	查看密码	string
  price: number; //	零售价	number
  priceType: string; //	零售价格类型	string
  shareCode: string; //	分享编码	string
  shareTimeType: string; //		string
  shareUrl: string; //
  startTime: string; //	二维码开始时间	string(date-time)
  status: boolean; //	状态	boolean
  supplyPrice: number; //	供货价	number
  supplyPriceType: string; //	供货价类型	string
  views: number; //	查看人数	integer(int32)
}

export interface IViews {
  createId: number; //	创建人id	integer(int64)
  createTime: string; //	创建时间	string(date-time)
  historyId: number; //	integer(int64)
  id: number; //	id	integer(int64)
  isDelete: boolean; //	逻辑删除	boolean
  mobile: string; //		string
  modifyId: number; //	修改人id	integer(int64)
  modifyTime: string; //	修改时间	string(date-time)
  palletId: number; //		integer(int64)
}

export interface ICompanyInfoType {
  companyName: string;
  companyShortName: string;
  logo: string;
  slogan: string;
  kaEmail: string;
  kaMobile: string;
  kaName: string;
  kaWeChat: string;
}

export interface IRoleRecord {
  id: number;
  members: number;
  remarks: string;
  roleName: string;
  tenantId: number;
}

export interface IUserRecord {
  headImage: string; //headImage	头像	string
  id: number; //id		integer(int64)
  mobile: string; //mobile	手机号	string
  realName: string; //realName	员工姓名	string
  roles: IRoleRecord[]; //roles	角色列表	array
  tenantId: number; //tenantId		integer(int64)
  userName: string; //userName	员工账号	string
}

export interface IRoleRecord {
  createId: number; //createId	创建人id	integer(int64)
  createTime: string; //createTime	创建时间	string(date-time)
  id: number; //id	id	integer(int64)
  isDelete: boolean; //isDelete	逻辑删除	boolean
  modifyId: number; //modifyId	修改人id	integer(int64)
  modifyTime: string; //modifyTime	修改时间	string(date-time)
  remarks: string; //remarks	备注	string//
  roleName: string; //roleName	角色名称	string
  status: number; //status	状态：0-失效 1-有效	integer(int32)
  tenantId: number; //tenantId	公司/机构编码	integer(int64)
  permissions: string[]; //菜单权限id
}

export interface IUserForm {
  id?: number;
  mobile: string;
  password: string;
  password2: string;
  realName: string;
  roleIds: any[];
  username: string;
}

export interface IPermsTree {
  authority: string; //authority	授权标识	string
  hidden: boolean; //hidden		boolean
  id: number; //id	菜单ID	integer(int64)
  layout: boolean; //layout		boolean
  menuIcon: string; //menuIcon	菜单图标	string
  menuName: string; //menuName	菜单名称	string
  menuType: number; //menuType	0-菜单，1-按钮	integer(int32)
  menuUrl: string; //menuUrl	菜单链接	string
  parentId: number; //parentId	父ID	integer(int64)
  subMenus: SubMenu[];
}

export interface SubMenu {
  authority: string;
  hidden: boolean;
  id: number;
  layout: boolean;
  menuIcon: string;
  menuName: string;
  menuType: number;
  menuUrl: string;
  parentId: number;
  subMenus: SubMenu[];
}
export interface IRoleForm {
  id?: number;
  name: string;
  permissions: any[];
  remark: string;
}
export interface IAccessRecords {
  createId: number; //	创建人	integer
  createTime: string; //	创建时间	string
  historyId: number; //		integer
  id: number; //	ID	integer
  isDelete: boolean; //		boolean
  mobile: string; //		string
  modifyId: number; //	更新人	integer
  modifyTime: string; //	更新时间	string
  palletId: number; //		integer
  palletName: string; //		string
  tenantId: number; //	租户ID	integer
  times: number; //	查看次数	integer
  shareCode: string;
}

export interface IProduct {
  category1: string; //	一级类目id	integer
  category1Name: string; //	一级类目名称	string
  category2: string; //	二级类目id	integer
  category2Name: string; //		二级类目名称	string
  // category3: number; //三级类目id	integer
  // category3Name: string; //		三级类目名称	string
  commissionRate: number; //	佣金比例	number
  detail: string; //	详情	string
  id: string; //	Id	integer
  isRecommend: boolean; //	是否推荐	boolean
  isVirtual: boolean; //是否虚拟商品
  mainPic: Array<string>; //	商品主图	string
  marketPrice: string; //	划线价	string
  name: string; //	商品名称	string
  ringPic: Array<string>; //	轮播图	array	string
  salePrice: string; //	销售价	string
  status: number; //	状态：0-下架 1-上架	integer
  stockCount: number; //	库存数量	integer
  sumGmv: string; //	gmv	string
  spec: ISpec[];
  labels: string[];
  subName: string;
  labelIds: string[];
  labelNames: string[];
  dividePartner: boolean;
  divideTeam: boolean;
}

export interface ISku {
  freight: string; //	运费	string
  gmv: number; //	integer
  id: number; //skuID	integer
  marketPrice: number; //	number
  productId: number; //		integer
  salePrice: number; //		number
  skuCode: string; //		string
  specId: string; //	string
  specsName: string; //	string
  specsPic: string; //	string
  specsUnit: string; //	string
  stock: number; //	integer
}

export interface IProductDetail extends IProduct {
  specsList: ISku[];
  preOnTime: string;
}
