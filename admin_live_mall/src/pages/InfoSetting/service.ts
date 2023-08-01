import { request } from '@umijs/max';

export const fetchUserShops = () => {
  return request('/v1/shop/userShops');
};
export const update = (data: any) => {
  return request('/v1/system/updateAccount', {
    data,
    method: 'POST',
  });
};
