import { request } from '@umijs/max';

// 获取概览数据
export function generalDataSource() {
  return request('/v1/data/indexOverview', { method: 'GET' });
}
