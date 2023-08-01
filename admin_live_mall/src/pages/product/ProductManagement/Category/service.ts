import { request } from '@umijs/max';
import { TableListItem } from './data';

//查询列表
export async function getPage(data: any) {
  return request<API.Response<TableListItem[]>>('/v1/productCategory/pageList', {
    method: 'POST',
    data: data,
  });
}

// 查询子分类
export async function getSubPage(data: { parentId: string; showHidden?: boolean }) {
  if (!data.showHidden) {
    data.showHidden = false;
  }
  return request<API.Response<TableListItem[]>>('/v1/productCategory/getListByParent', {
    method: 'POST',
    data: data,
  });
}

//添加
export async function add(data: any) {
  return request('/v1/productCategory/addCategory', { method: 'POST', data });
}

//编辑
export async function edit(data: any) {
  return request('/v1/productCategory/editCategory', { method: 'POST', data });
}

//删除
export async function remove(data: any) {
  return request('/v1/productCategory/delCategory', { method: 'POST', data });
}

//删除
export async function editStatus(data: any) {
  return request('/v1/productCategory/updateStatus', { method: 'POST', data });
}
