import { request } from '@umijs/max';
import { TableListItem } from './data';

/**
 * 获取团长等级列表
 * @param data
 * @returns
 */
export async function getlevelList(data: any) {
  return request<API.ResponsePage<TableListItem>>('/v1/team/levelList', { method: 'POST', data });
}
export async function delLevel(data: any) {
  return request<API.Response>('/v1/team/delLevel', { method: 'POST', data });
}
