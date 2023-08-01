import { request } from '@umijs/max';

//查询列表
export async function getPage() {
  return request('/v1/importHis/batchShipments', { method: 'GET' });
}

// export async function getDetail(data: any) {
//   return request<API.Response<TableListItemDetail>>('/admin/order/detail', {
//     method: 'POST',
//     data: data,
//   });
// }
//添加
export async function batchShipment(data: any) {
  return request('/v1/order/batchShipment', { method: 'POST', data });
}

export async function postExport() {
  return request<Blob>('/v1/order/shipmentTemplateDownload', {
    method: 'POST',
    responseType: 'blob',
  });
}
