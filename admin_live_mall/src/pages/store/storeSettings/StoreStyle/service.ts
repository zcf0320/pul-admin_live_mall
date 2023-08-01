import { request } from '@umijs/max';
import { ColourScheme, ShopStyle } from './data';

export async function getShopStyle() {
  return request<API.Response<ShopStyle>>('/v1/shop/getShopStyle', { method: 'POST' });
}
export async function setShopStyle(data: ColourScheme) {
  return request<API.Response<ShopStyle>>('/v1/shop/setShopStyle', { method: 'POST', data });
}
