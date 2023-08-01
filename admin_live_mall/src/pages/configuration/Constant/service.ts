import { request } from '@umijs/max';

//查询常量列表
export async function getPage(data: any) {
  return request('/v1/config/query', { method: 'POST', data });
}
//添加
export async function add(data: any) {
  return request('/v1/config/add', { method: 'POST', data });
}
//编辑
export async function edit(data: any) {
  return request('/v1/config/edit', { method: 'POST', data });
}
//删除
export async function remove(data: any) {
  return request('/v1/config/delete', { method: 'POST', data });
}
