import { request } from '@umijs/max';

//查询列表
export async function getPage(data: any) {
  return request('/v1/pageConfig/pageList', { method: 'POST', data });
}
//添加
export async function add(data: any) {
  return request('/v1/pageConfig/add', { method: 'POST', data });
}
//编辑
export async function edit(data: any) {
  return request('/v1/pageConfig/edit', { method: 'POST', data });
}
// 删除
export async function remove(data: any) {
  return request('/v1/pageConfig/delete', { method: 'POST', data });
}
