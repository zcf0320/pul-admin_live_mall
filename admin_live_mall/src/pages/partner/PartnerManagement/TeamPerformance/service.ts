import { request } from '@umijs/max';

// 团队业绩列表
export function performance(data: any): Promise<any> {
  return request('/v1/partner/performance', { method: 'POST', data });
}

// 团队业绩导出
export function performanceExport(data: any): Promise<any> {
  return request('/v1/partner/performanceExport', { method: 'POST', data, responseType: 'blob' });
}
