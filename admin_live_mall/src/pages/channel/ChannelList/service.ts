import { request } from '@umijs/max';

//查询列表
export async function getPage(data: any) {
  return request('/admin/channel/list', { method: 'POST', data });
}
//添加
export async function add(data: any) {
  return request('/admin/channel/add', { method: 'POST', data });
}
//编辑
export async function edit(data: any) {
  return request('/admin/channel/edit', { method: 'POST', data });
}
//删除
export async function remove(data: any) {
  return request('/admin/channel/del', { method: 'POST', data });
}
// 常量
export async function getConfig(data: any) {
  return request('/admin/config/query', { method: 'POST', data });
}
