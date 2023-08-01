export interface ShopStyle {
  createId: number;
  createTime: string;
  id: number;
  isDelete: boolean;
  modifyId: number;
  modifyTime: string;
  primaryColor: string;
  promotionalColor: string;
  shopId: number;
  subColor: string;
  tenantId: number;
}

export interface ColourScheme {
  primaryColor: string;
  subColor: string;
  promotionalColor: string;
}
