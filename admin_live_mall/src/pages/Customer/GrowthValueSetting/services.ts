import { request } from '@umijs/max';

// 成长值编辑
export async function growthValueSetting(data: any) {
  return request('/v1/user/level/setting', { method: 'POST', data });
}

export async function getGrowthValue() {
  return request('/v1/user/level/getSetting', { method: 'POST' });
}
