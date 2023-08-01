import { request } from '@umijs/max';

//查询列表
export async function getData() {
  return request<API.Response<any>>('/v1/order/getTradeSet', {
    method: 'POST',
  });
}
//添加
export async function add(data: any) {
  return request('/admin/productCategory/addCategory', { method: 'POST', data });
}
//编辑
export async function edit(data: any) {
  return request('/v1/order/editTradeSet', { method: 'POST', data });
}
