// 支付方式
import { request } from '@umijs/max';

export async function payMethodList(data: { payMethod: string; month: string }) {
  return await request('/v1/fund/reconciliationOrder', { method: 'POST', data });
}
