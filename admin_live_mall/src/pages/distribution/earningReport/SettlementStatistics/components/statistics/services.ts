import { request } from '@umijs/max';
//查询列表
export async function getPageList(data: {
  endTime?: string;
  pageNo?: number;
  pageSize?: number;
  queryType?: number;
  startTime?: string;
}) {
  return request('/v1/team/settlementStatistics', { method: 'POST', data });
}
