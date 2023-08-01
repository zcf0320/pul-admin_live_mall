import { request } from '@umijs/max';
//查询列表
export async function getPageList(data: {
  endTime?: string;
  pageNo?: number;
  pageSize?: number;
  teamInfo?: string;
  startTime?: string;
}) {
  return request('/v1/team/performanceStatistics', { method: 'POST', data });
}
// 导出列表
export async function getExport(data: {
  endTime?: string;
  pageNo?: number;
  pageSize?: number;
  teamInfo?: string;
  startTime?: string;
  excludeColumnFieldNames?: string[];
}) {
  return request('/v1/team/performanceExport', { method: 'POST', data, responseType: 'blob' });
}
