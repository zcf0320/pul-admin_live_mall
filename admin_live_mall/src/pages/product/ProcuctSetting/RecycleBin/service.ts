import { request } from '@umijs/max';
import { TableListItem } from './data';

//查询列表
export async function getPage(data: any) {
  return request<API.ResponsePage<TableListItem>>('/v1/product/recyclingBin', {
    method: 'POST',
    data: data,
  });
}
// 批量操作

export async function multipartAction(data: any) {
  return request('/v1/product/recyclingBin/batchOperations', {
    method: 'POST',
    data: data,
  });
}
