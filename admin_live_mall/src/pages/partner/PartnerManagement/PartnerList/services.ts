import { request } from '@umijs/max';

// 合伙人列表
export function partnerList(data: any): Promise<any> {
  return request('/v1/partner/list', { method: 'POST', data });
}

// 合伙人等级列表
export function partnerLevelList(data: any): Promise<any> {
  return request('/v1/partner/levelList', { method: 'POST', data });
}

// 导出合伙人列表
export function exportPartnerList(data: any): Promise<Blob> {
  return request('/v1/partner/exportPartner', { method: 'POST', data, responseType: 'blob' });
}

// 启用禁用合伙人
export function disabledPartner(data: any): Promise<void> {
  return request('/v1/partner/disabled', { method: 'POST', data });
}

// 清退合伙人
export function clearPartner(data: any): Promise<void> {
  return request('/v1/partner/clear', { method: 'POST', data });
}

export function editRemarkValue(data: any): Promise<void> {
  return request('/v1/partner/modifyNoteName', { method: 'POST', data });
}

// 获取合伙人详情
export function revenueDetail(data: any): Promise<any> {
  return request('/v1/partner/details', { method: 'POST', data });
}

// 获取团队成员列表
export function teamMemberList(data: any): Promise<any> {
  return request('/v1/partner/subUser', { method: 'POST', data });
}

// 编辑合伙人等级
export async function editPartnerLevel(data: any): Promise<any> {
  return await request('/v1/partner/modifyPartnerLevel', { method: 'POST', data });
}

// 导出合伙人详情列表 exportPartnerDetailList
export async function exportPartnerDetailList(data: any): Promise<any> {
  return await request('/v1/partner/detailsExport', { method: 'POST', data, responseType: 'blob' });
}
