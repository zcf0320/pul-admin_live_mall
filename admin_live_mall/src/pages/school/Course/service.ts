import { request } from '@umijs/max';

//列表(分页)
export async function table(data: any) {
  return request('/admin/course/getPageList', { method: 'POST', data });
}
//添加
export async function add(data: any) {
  return request('/admin/course/addCourse', { method: 'POST', data });
}
//编辑
export async function edit(data: any) {
  return request('/admin/course/editCourse', { method: 'POST', data });
}
//删除
export async function remove(data: any) {
  return request('/admin/course/delCourse', { method: 'POST', data });
}
//修改状态
export async function updateStatus(data: any) {
  return request('/admin/course/updateStatus', { method: 'POST', data });
}
//课程绑定套餐
export async function bindCourse(data: any) {
  return request('/admin/course/bindCourse', { method: 'POST', data });
}
//列表（不分页）
export async function allTable() {
  return request('/admin/course/getList', { method: 'POST', data: {} });
}
