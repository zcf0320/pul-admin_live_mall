import { request } from '@umijs/max';
// 今日概览数据
export const getOverviewTodayData = () => {
  return request<API.Response<any>>('/v1/data/overviewToday', {
    method: 'GET',
  });
};
