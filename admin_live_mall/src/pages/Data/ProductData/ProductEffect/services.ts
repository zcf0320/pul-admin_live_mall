import { request } from '@umijs/max';
// 交易概览数据
export const getGoodsEffectData = () => {
  return request<API.Response<any>>('/v1/data/goodsEffect', {
    method: 'GET',
  });
};
