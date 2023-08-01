import { request } from '@umijs/max';
import { SubUserInfo } from './data';

/**
 * 下级列表
 * @param data
 * @returns
 */
export async function getPage(data: any) {
  return request<API.ResponsePage<SubUserInfo>>('/v1/team/subUser', { method: 'POST', data });
}
// 批量变更
export async function postUserBatchUpdateTeam(data: { teamId: string; userIdList: string[] }) {
  return request<API.ResponsePage<SubUserInfo>>('/v1/team/userBatchUpdateTeam', {
    method: 'POST',
    data,
  });
}
// 批量删除
export async function postUserBatchDel(data: { userIdList: string[] }) {
  return request<API.ResponsePage<SubUserInfo>>('/v1/team/userBatchDel', {
    method: 'POST',
    data,
  });
}
// 批量补签
export async function postUserBatchCheckIn(data: { userIdList: string[]; date: string }) {
  return request<API.ResponsePage<SubUserInfo>>('/v1/team/userBatchCheckIn', {
    method: 'POST',
    data,
  });
}

//查询列表
export async function getPageList(data: any) {
  return request<API.Response>('/v1/team/list', { method: 'POST', data });
}

export async function postExport(data: any) {
  return request<Blob>('/v1/team/exportTeam', { method: 'POST', data, responseType: 'blob' });
}

// 获取客户经理列表 --
export async function tutorList(data: any) {
  return request<API.Response>('/v1/team/list', { method: 'POST', data });
}

// 变更客户经理
export async function changeTutor(data: any) {
  return request<API.Response>('/v1/team/userBatchUpdateTeam', { method: 'POST', data });
}
