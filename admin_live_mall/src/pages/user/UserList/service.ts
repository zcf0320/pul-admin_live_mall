import { request } from '@umijs/max';

//查询列表
export async function getPage(data: any) {
  return request('/admin/user/query', { method: 'POST', data });
}

// 用户下级
export async function getSubordinateList(data: any) {
  return request('/admin/user/subList', { method: 'POST', data });
}
