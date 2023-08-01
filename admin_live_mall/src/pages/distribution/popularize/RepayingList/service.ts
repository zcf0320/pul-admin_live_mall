import { request } from '@umijs/max';
import { TableListItem } from './data';

//查询列表
export async function clearRecord(data: any) {
  return request<API.ResponsePage<TableListItem>>('/v1/team/clearRecord', { method: 'POST', data });
}

export async function postExport(data: any) {
  return request<Blob>('/v1/team/exportClearRecord', {
    method: 'POST',
    data,
    responseType: 'blob',
  });
}
