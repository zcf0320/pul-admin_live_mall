import { request } from '@umijs/max';

// 获取结算列表
export function getSettlementList(data: any) {
  return request('/v1/fund/settlementList', { method: 'POST', data });
}

// 导出结算列表
export function exportSettlementList(data: any) {
  return request('/v1/fund/settlementListExport', { method: 'POST', data, responseType: 'blob' });
}
