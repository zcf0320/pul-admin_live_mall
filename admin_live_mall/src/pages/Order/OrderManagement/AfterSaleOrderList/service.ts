import { request } from '@umijs/max';

//查询列表
export async function getPage(data: any) {
  return request('/v1/afterSaleOrder/getAfterSaleOrder', { method: 'GET', params: data });
}

export async function postAgreeRefund(data: any) {
  return request('/v1/afterSaleOrder/agreeRefundMoney', { method: 'POST', data: data });
}

export async function postDisAgreeRefundOrReturnGoods(data: any) {
  return request('/v1/afterSaleOrder/refuseRefundMoney', { method: 'POST', data: data });
}

export async function postAgreeReturnGoods(data: any) {
  return request('/v1/afterSaleOrder/agreeRefundProduct', { method: 'POST', data: data });
}

export async function postConfirmReceive(data: any) {
  return request('/v1/afterSaleOrder/confirmReceive', { method: 'POST', data: data });
}
