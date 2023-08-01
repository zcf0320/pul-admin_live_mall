import { request } from '@umijs/max';

// 导入
export async function importProduct(data: any) {
  return request('/v1/live/importGoods', { method: 'POST', data });
}

// 讲解
export async function postExplain(data: any) {
  return request('/v1/live/upLink', { method: 'POST', data });
}

// 取消讲解
export async function postCancelExplain(data: any) {
  return request('/v1/live/cancelGoods', { method: 'POST', data });
}

// 讲解
export async function getPage(data: any) {
  return request('/v1/live/fuDaiHistory', { method: 'GET', params: data });
}

// 获取中间名单id
export async function fetchGetPrizeList(data: any) {
  return request('/v1/live/lotteryList', { method: 'GET', params: data });
}

// 发放
export async function postSendPrize(data: any) {
  return request('/v1/live/sendPrize', { method: 'POST', data: data });
}

// 讲解
export async function getDetail(data: any) {
  return request('/v1/live/fuDaiDetail', { method: 'GET', params: data });
}
