import { request } from '@umijs/max';
import { TableListItemDetail } from './data';

//查询列表
export async function getPage(data: any) {
  return request('/v1/order/query', { method: 'POST', data: data });
}
export async function getDetail(data: any) {
  return request<API.Response<TableListItemDetail>>('/v1/order/detail', {
    method: 'POST',
    data: data,
  });
}
//添加
export async function postDeliver(data: any) {
  return request('/v1/order/sendProduct', { method: 'POST', data });
}

export async function postExport(data: any) {
  return request<Blob>('/v1/order/export', { method: 'POST', data, responseType: 'blob' });
}
