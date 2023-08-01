import { request } from '@umijs/max';
import { ActiveUser } from './data';

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

// 抽奖名单
export async function fetchPrizeList(data: any) {
  return request('/v1/live/prizeUserList', { method: 'POST', data });
}

// 导入抽奖名单的用户列表
export async function fetchUserList(data: any) {
  return request('/v1/live/userList', { method: 'POST', data });
}

// 导入用户到抽奖名单
export async function postImportUserToPrize(data: {
  liveActivityId: string;
  userIdList: string[];
}) {
  return request('/v1/live/importUserList', { method: 'POST', data });
}

// 随机选择用户
export async function postRandomSelectUser(data: {
  liveActivityId: string;
  userIdList: string[];
  size: number;
}) {
  return request<API.Response<ActiveUser[]>>('/v1/live/randomUser', { method: 'POST', data });
}

// 开奖
export async function postOpenPrize(data: { liveActivityId: string; userIdList: string[] }) {
  return request('/v1/live/runLottery', { method: 'POST', data });
}
