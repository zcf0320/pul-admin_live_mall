import { request } from '@umijs/max';

//查询列表
export async function getPage(data: any) {
  return request<API.Response>('/v1/team/list', { method: 'POST', data });
}

export async function postExport(data: any) {
  return request<Blob>('/v1/team/exportTeam', { method: 'POST', data, responseType: 'blob' });
}

// 获取客户经理列表
export async function tutorList(data: any) {
  return request<API.Response>('/v1/tutor/mentorList', { method: 'POST', data });
}

// 获取合伙人列表
export async function partnerList(data: any) {
  return request<API.Response>('/v1/partner/list', { method: 'POST', data });
}

/**
 * 清退团长
 * @param data
 * @returns
 */
export async function clearTeam(data: any) {
  return request<API.Response>('/v1/team/clear', { method: 'POST', data });
}

/**
 * 变更合伙人
 * @param data
 * @returns
 */
export async function changePartner(data: any) {
  return request<API.Response>('/v1/team/changeSup', { method: 'POST', data });
}

// 变更客户经理
export async function changeTutor(data: any) {
  return request<API.Response>('/v1/team/changeTutor', { method: 'POST', data });
}

// 编辑备注名
export function editRemarkValue(data: any): Promise<void> {
  return request('/v1/team/modifyNoteName', { method: 'POST', data });
}

// 设置等级
export function setUserLevel(data: any): Promise<void> {
  return request('/v1/team/editTeamLevel', { method: 'POST', data });
}
