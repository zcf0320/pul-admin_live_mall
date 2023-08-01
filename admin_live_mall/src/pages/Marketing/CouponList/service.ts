import { request } from '@umijs/max';

//查询列表
export async function getPage(data: any) {
  return request('/v1/coupon/list', { method: 'GET', params: data });
}

//添加
export async function add(data: any) {
  return request('/v1/coupon/createCoupon', { method: 'POST', data });
}

//编辑
export async function edit(data: any) {
  return request('/v1/coupon/modifyNum', { method: 'POST', data });
}

//删除
export async function remove(data: any) {
  return request('/v1/coupon/loseEfficacy', { method: 'POST', data });
}
// 作废
export async function cancel(data: any) {
  return request('/v1/coupon/deprecated', { method: 'POST', data });
}
// 常量
export async function getConfig(data: any) {
  return request('/admin/config/query', { method: 'POST', data });
}

// 获取客户会员等级

// 获取用户会员列表数据
export async function getUserLevel(): Promise<any> {
  return request('/v1/user/level/list', { method: 'POST' });
}
// 获取用户会员列表数据
export async function getUserLabels(): Promise<any> {
  return request('/v1/user/label/list', { method: 'POST' });
}
