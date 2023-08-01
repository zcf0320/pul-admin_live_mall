// actionType	行为类型
enum GROWTH_ACTION_TYPE {
  BUY_PRODUCT = 'BUY_PRODUCT', // 购买商品
  PLACE_ORDER = 'PLACE_ORDER', // 完成下单
  VISIT = 'VISIT', // 访问
  SHARE = 'SHARE', // 分享
  EVALUATE = 'EVALUATE', // 评价
}

/*
*  BUY_PRODUCT = false,
      PLACE_ORDER = false,
      SHARE = false,
      EVALUATE = false,
      VISIT = false,
      buy_product_amount = '',
      buy_product_value = '',
      place_order_count = '',
      place_order_value = '',
      access_time_unit = '',
      access_count = '',
      access_value = '',
      share_count = '',
      share_time_unit = '',
      share_value = '',
      evaluate_count = '',
      evaluate_value = '',
* */
type IGrowthValueForm = {
  buy_product_id?: string;
  place_order_id?: string;
  access_id?: string;
  share_id?: string;
  evaluate_id?: string;
  BUY_PRODUCT?: boolean;
  PLACE_ORDER?: boolean;
  SHARE?: boolean;
  EVALUATE?: boolean;
  VISIT?: boolean;
  buy_product_amount?: string | number;
  buy_product_value?: string | number;
  place_order_count?: string | number;
  place_order_value?: string | number;
  access_time_unit: number;
  access_count?: string | number;
  access_value?: string | number;
  share_count?: string | number;
  share_time_unit: number;
  share_value?: string | number;
  evaluate_value1?: string | number;
  evaluate_value2?: string | number;
};

interface ILockUpParam {
  isLockUp: boolean;
  status: boolean;
}

interface IRequireParam {
  BUY_PRODUCT?: boolean;
  PLACE_ORDER?: boolean;
  SHARE?: boolean;
  EVALUATE?: boolean;
  VISIT?: boolean;

  [index: string]: boolean;
}

export { GROWTH_ACTION_TYPE, IGrowthValueForm, IRequireParam, ILockUpParam };
