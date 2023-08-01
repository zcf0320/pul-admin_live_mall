import { request } from '@umijs/max';

// 获取提现设置
export function getWithDrawSetting(data: any) {
  return request('/v1/setting/get', { method: 'POST', data });
}

export function setWithDrawSetting(data: any) {
  return request('/v1/setting/set', { method: 'POST', data });
}
