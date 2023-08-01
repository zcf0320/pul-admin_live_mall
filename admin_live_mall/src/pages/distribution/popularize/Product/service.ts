import { request } from '@umijs/max';
import { TableListItem } from './data';

//查询列表
export async function getPage(data: any) {
  return request<API.ResponsePage<TableListItem>>('/v1/team/promotionProductList', {
    method: 'POST',
    data,
  });
}

export async function setting(data: any) {
  return request<API.Response>('/v1/team/batchSettings', { method: 'POST', data });
}
