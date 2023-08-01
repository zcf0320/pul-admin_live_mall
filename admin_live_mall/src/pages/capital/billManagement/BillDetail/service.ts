import { request } from '@umijs/max';

export async function billDetailList(data: any) {
  return request('/v1/fund/reconciliation', { method: 'POST', data });
}

export function exportBillDetailList(data: any) {
  return request('/v1/fund/reconciliationExport', { method: 'POST', data, responseType: 'blob' });
}
