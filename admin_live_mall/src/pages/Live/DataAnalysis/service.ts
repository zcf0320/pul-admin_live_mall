import { request } from '@umijs/max';

//删除
export async function importProduct(data: any) {
  return request('/v1/live/importGoods', { method: 'POST', data });
}
//删除
export async function getPage(data: any) {
  return request('/v1/live/liveActivityList', { method: 'GET', params: data });
}

//创建直播活动
export async function createLiveActivity(data: any) {
  return request('/v1/live/createLiveActivity', { method: 'POST', data });
}
