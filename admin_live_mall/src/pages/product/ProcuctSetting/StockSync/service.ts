import { request } from '@umijs/max';
import { TableListItem } from './data';

//查询列表
export async function getPage(data: any) {
  return request<API.ResponsePage<TableListItem>>('/v1/importHis/syncStock', {
    method: 'GET',
    params: data,
  });
}

//添加
export async function uploadFile(data: any) {
  return request('/v1/product/stockCountSync', { method: 'POST', data });
}
