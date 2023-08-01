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

export async function getPage(data: any) {
  return request('/v1/live/liveRoomGoods', { method: 'POST', data });
}

// 删除
export async function postDelete(data: any) {
  return request('/v1/live/deleteGoods', { method: 'POST', data });
}
