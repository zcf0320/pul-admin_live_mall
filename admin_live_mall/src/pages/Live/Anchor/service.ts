import { request } from '@umijs/max';

//查询列表
export async function getPage(data: any) {
  return request('/v1/anchor/list', { method: 'GET', params: data });
}
//删除
export async function deleteAnchor(data: any) {
  return request('/v1/anchor/delete', { method: 'POST', data });
}
// 添加
export async function add(data: any) {
  return request('/v1/anchor/add', { method: 'POST', data });
}
