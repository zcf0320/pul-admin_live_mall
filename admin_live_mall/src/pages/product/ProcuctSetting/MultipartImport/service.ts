import { request } from '@umijs/max';
import { TableListItem } from './data';

//查询列表
export async function getPage(data: any) {
  return request<API.ResponsePage<TableListItem>>('/v1/importHis/batchImportProduct', {
    method: 'GET',
    params: data,
  });
}
//添加
export async function add(data: any) {
  return request('/admin/productCategory/addCategory', { method: 'POST', data });
}
//编辑
export async function edit(data: any) {
  return request('/admin/productCategory/editCategory', { method: 'POST', data });
}
//删除
export async function remove(data: any) {
  return request('/admin/productCategory/delCategory', { method: 'POST', data });
}
//导入
export async function importExcel(data: any) {
  return request('/v1/product/batchImportProduct', { method: 'POST', data });
}
//导入
export async function fetchImportProductTemplate() {
  return request('/v1/product/uploadBatchImportTemplate', { method: 'POST', responseType: 'blob' });
}
