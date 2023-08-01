import { request } from '@umijs/max';
import { TableListItem } from './data';

//查询列表
export async function getPage(data: any) {
  return request('/v1/live/getInteractActivity', { method: 'GET', params: data });
}

//删除
export async function remove(data: any) {
  return request('/v1/live/delInteractActivity', { method: 'POST', data });
}

// 编辑
export async function edit(data: any) {
  return request('/v1/live/updateInteractActivity', { method: 'POST', data });
}

// 编辑
export async function add(data: any) {
  return request('/v1/live/createInteractActivity', { method: 'POST', data });
}

//删除
export async function fetchDetail(data: any) {
  return request<API.Response<TableListItem>>('/v1/live/detail', { method: 'GET', params: data });
}
