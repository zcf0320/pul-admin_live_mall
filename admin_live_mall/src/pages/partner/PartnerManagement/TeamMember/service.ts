import { request } from '@umijs/max';

// 导出合伙人列表
export function exportMemberList(data: any): Promise<Blob> {
  return request('/v1/partner/exportMembers', { method: 'POST', data, responseType: 'blob' });
}

// 变更合伙人
export function moveSubordinates(data: any): Promise<void> {
  return request('/v1/partner/moveSubordinates', { method: 'POST', data });
}
