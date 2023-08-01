import { request } from '@umijs/max';
// 商品概览数据
export const getOverviewGoodsData = () => {
  return request<API.Response<any>>('/v1/data/overviewGoods', {
    method: 'GET',
  });
};
