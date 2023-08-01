import { request } from '@umijs/max';

// 获取合伙人等级列表
export async function getLevelList(data: { page: number; pageSize: number }) {
  return request('/v1/partner/levelList', { method: 'POST', data });
}

export async function addPartnerLevel(data: { name: string; directCommissionRate: string }) {
  return request('/v1/partner/addLevel', { method: 'POST', data });
}

// 编辑合伙人等级
export async function editLevel(data: { id: string; name: string; directCommissionRate: string }) {
  return request('/v1/partner/editLevel', { method: 'POST', data });
}

// 禁用合伙人等级
export async function DisableLevel(data: { id: string }) {
  return request('/v1/partner/disableLevel', { method: 'POST', data });
}
