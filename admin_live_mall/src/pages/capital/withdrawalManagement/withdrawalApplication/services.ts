import { request } from '@umijs/max';

// 获取提现统计
export function withdrawalApply(data: IParams) {
  return request('/v1/fund/withdrawalApply', { method: 'POST', data });
}

// 批量标记发放
export function markDistribute(data: { ids: string; remark: string }) {
  return request('/v1/fund/mark', { method: 'POST', data });
}

// 批量驳回
export function markReject(data: { ids: string; remark: string }) {
  return request('/v1/fund/reject', { method: 'POST', data });
}

export async function postExport(data: IParams) {
  return request<Blob>('/v1/fund/withdrawalRecordExport', {
    method: 'POST',
    data,
    responseType: 'blob',
  });
}
