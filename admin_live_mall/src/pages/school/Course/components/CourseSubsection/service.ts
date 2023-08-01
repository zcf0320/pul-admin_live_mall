import { request } from '@umijs/max';

//列表
export async function table(data: any) {
  return request('/admin/courseSubsection/subsectionList', { method: 'POST', data });
}
//添加
export async function add(data: any) {
  return request('/admin/courseSubsection/addSubsection', { method: 'POST', data });
}
//编辑
export async function edit(data: any) {
  return request('/admin/courseSubsection/editSubsection', { method: 'POST', data });
}
//删除
export async function remove(data: any) {
  return request('/admin/courseSubsection/delSubsection', { method: 'POST', data });
}
