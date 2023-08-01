import { request } from '@umijs/max';

//查询列表
export async function getSetting() {
  return request<API.Response<any>>('/v1/product/getProductSet', {
    method: 'POST',
  });
}
//编辑
export async function edit(data: any) {
  return request('/v1/product/editProductSet', { method: 'POST', data });
}
