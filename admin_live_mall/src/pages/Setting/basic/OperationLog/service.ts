import { request } from '@umijs/max';

//查询列表
export async function getPage(data: any) {
  return request('/v1/log/opLogs', { method: 'get', params: data });
}
