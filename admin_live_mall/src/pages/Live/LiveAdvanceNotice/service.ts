import { request } from '@umijs/max';
import { TableListItem } from './data';

//查询列表
export async function getPage(data: any) {
  return request('/v1/live/list', { method: 'GET', params: data });
}
//删除
export async function remove(data: any) {
  return request('/v1/live/deleteLive', { method: 'POST', data });
}
// 编辑
export async function edit(data: any) {
  return request('/v1/live/updateLive', { method: 'POST', data });
}

//删除
export async function fetchDetail(data: any) {
  return request<API.Response<TableListItem>>('/v1/live/detail', { method: 'GET', params: data });
}
