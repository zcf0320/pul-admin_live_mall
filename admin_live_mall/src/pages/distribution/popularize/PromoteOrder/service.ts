import { request } from '@umijs/max';

// 获取推广订单列表
export async function promoteOrderList(data: any) {
  return request<any>('/v1/team/promoteOrders', {
    method: 'POST',
    data,
  });
}

// 导出推广订单
export async function exportPromoteOrderList(data: any) {
  return request('/v1/team/exportPromotionOrder', {
    method: 'POST',
    data,
    responseType: 'blob',
  });
}
