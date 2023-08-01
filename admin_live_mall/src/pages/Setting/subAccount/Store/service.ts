import { request } from '@umijs/max';
import { TableListItemDetail } from './data';

//查询列表
export async function getPage(data: any) {
  return request('/admin/shop/list', { method: 'GET', params: data });
}
export async function getDetail(data: any) {
  return request<API.Response<TableListItemDetail>>('/admin/order/detail', {
    method: 'POST',
    data: data,
  });
}
//添加
export async function addStore(data: any) {
  return request('/admin/shop/add', { method: 'POST', data });
}

//添加
export async function updateStore(data: any) {
  return request('/admin/shop/update', { method: 'POST', data });
}

export async function addTime(data: any) {
  return request('/admin/shop/renew', { method: 'POST', data });
}
export async function deleteStore(data: any) {
  return request('/admin/shop/delete', { method: 'POST', data });
}
