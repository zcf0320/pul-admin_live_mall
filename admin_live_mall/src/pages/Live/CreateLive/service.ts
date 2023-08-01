import { request } from '@umijs/max';

//添加
export async function createLiveRoomService(data: any) {
  return request('/v1/live/createLive', { method: 'POST', data });
}
