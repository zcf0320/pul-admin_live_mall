import { request } from '@umijs/max';
import { ShopInfo } from './data';

// 店铺信息
export async function getShopInfo() {
  return request<API.Response<ShopInfo>>('/v1/shop/getShopInfo', { method: 'GET' });
}

// 更新店铺信息
export async function updataShopInfo(data: {
  bottomLogo: string; //bottomLogo	底部logo		false
  id: number; //id	店铺id		true
  industry1Id: number; //industry1Id	行业1		false
  industry2Id: number; //industry2Id	行业2		false
  introduction: string; //introduction	店铺简介		false
  logo: string; //logo	店铺logo		true
  manager: string; //manager	管理员		false
  mobile: string; //mobile	联系人手机号		false
  name: string; //name	店铺名称		true
  openStoreType: string; //openStoreType	营业时间类型,可用值:ALL_DAY,EVERY_DAY,EVERY_WEEK		false
  tradeStatus: boolean; //tradeStatus	营业状态		false
}) {
  return request<API.Response<any>>('/v1/shop/update', { method: 'POST', data });
}
