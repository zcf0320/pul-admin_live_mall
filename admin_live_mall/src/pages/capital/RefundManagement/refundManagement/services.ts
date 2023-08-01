import { request } from '@umijs/max';

export function refundManageList(data: any) {
  return request('/v1/fund/refundMgr', { method: 'POST', data });
}
