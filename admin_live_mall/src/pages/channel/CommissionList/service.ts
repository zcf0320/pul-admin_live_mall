import { request } from '@umijs/max';

// 查询列表
export async function getPage(data: any) {
  return request('/admin/channel/page', { method: 'POST', data });
}

// 佣金发放
export async function commissionDistribution(data: any) {
  return request('/admin/channel/distribution', { method: 'POST', data });
}

// 渠道列表
export async function getPersonnel(data: any) {
  return request('/admin/channel/list', { method: 'POST', data });
}
