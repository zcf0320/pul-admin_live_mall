import { request } from '@umijs/max';

//查询列表
export async function getPage(data: any) {
  return request('/v1/spec/list', { method: 'POST', data: data });
}
//添加
export async function add(data: any) {
  return request('/v1/spec/add', { method: 'POST', data });
}
//编辑
export async function edit(data: any) {
  return request('/v1/spec/update', { method: 'POST', data });
}
//删除
export async function remove(data: any) {
  return request('/v1/spec/delete', { method: 'POST', data });
}
