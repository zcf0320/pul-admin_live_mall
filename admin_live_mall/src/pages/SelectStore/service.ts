import { request } from '@umijs/max';

export const fetchUserShops = () => {
  return request('/v1/shop/userShops');
};
