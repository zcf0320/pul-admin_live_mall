import { request } from '@umijs/max';

// 获取用户会员列表数据
export async function getUserLevel(): Promise<any> {
  return request('/v1/user/level/list', { method: 'POST' });
}

// 修改会员列表状态
export async function setUserStatus(data: { id: string }): Promise<any> {
  return request('/v1/user/level/setStatus', { data, method: 'POST' });
}

// 获取权益列表
export async function getLevelEquityList(): Promise<any> {
  return request('/v1/user/level/rights/list', { method: 'POST' });
}

// 设置等级
export async function setLevel(data: ILevelForm): Promise<any> {
  return request(`/v1/user/level/${data?.id ? 'edit' : 'add'}`, { data, method: 'POST' });
}

// 获取成长值设置
export async function getGrowthValue(): Promise<any> {
  return request('/v1/user/level/getSetting', { method: 'POST' });
}

// 调整等级
export async function setUserLevel(data: { id: string; level: number }): Promise<any> {
  return request('/v1/user/adjustLevel', { method: 'POST', data });
}
