import { request } from '@umijs/max';

// 获取团长详情
export async function getDetails(data: any) {
  return request('/v1/team/performanceDetails', { method: 'POST', data });
}

// 团长详情业绩列表导出
export async function teamPerformanceExport(data: any) {
  return request('/v1/team/performanceDetailsExport', {
    method: 'POST',
    data,
    responseType: 'blob',
  });
}
