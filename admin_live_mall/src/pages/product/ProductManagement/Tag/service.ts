import { request } from '@umijs/max';
import { TableListItem } from './data';

//查询列表
export async function getPage(data: any) {
  return request<API.ResponsePage<TableListItem>>('/v1/product/label/list', {
    method: 'POST',
    data: data,
  });
}
//添加
export async function add(data: any) {
  return request('/v1/product/label/add', { method: 'POST', data });
}
//编辑
export async function edit(data: any) {
  return request('/v1/product/label/edit', { method: 'POST', data });
}
//删除
export async function remove(data: any) {
  return request('/v1/product/label/delete', { method: 'POST', data });
}
