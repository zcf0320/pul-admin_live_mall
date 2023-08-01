export interface TableListItem {
  couponEndTime: string; //		string
  couponId: number; //		integer
  couponName: string; //		string
  couponNumber: number; //	integer
  couponStartTime: string; //		string
  couponState: string; //	integer
  couponType: number; //	integer
  createId: number; //创建人	integer
  createTime: string; //	创建时间	string
  day: number; //	integer
  deductionMoney: number; //		number
  discountId: string[]; //		array	integer
  discountMethod: 'REDUCTION' | 'DISCOUNT'; //		integer
  discountRate: number; //		number
  effectiveRules: number; //		integer
  endTime: string; //	string
  id: number; //	ID	integer
  isOpen: number; //		integer
  limitMoney: number; //		integer
  modifyId: number; //	更新人	integer
  modifyTime: string; //	更新时间	string
  money: number; //		number
  restrictionMethod: number; //		integer
  returnUrl: string; //		string
  shopId: number; //	店铺ID	integer
  startTime: string; //		string
  tenantId: number; //	租户ID	integer
}
