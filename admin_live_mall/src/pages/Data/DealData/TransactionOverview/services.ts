import { request } from '@umijs/max';
// 交易概览数据
export const getOverviewTradeData = () => {
  return request<API.Response<any>>('/v1/data/overviewTrade', {
    method: 'GET',
  });
};
