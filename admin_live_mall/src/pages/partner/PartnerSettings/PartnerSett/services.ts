import { request } from '@umijs/max';

// 设置合伙人别名
export async function setPartnerAlias(data: { settingList: { key: string; value: string }[] }) {
  return request('/v1/setting/set', { method: 'POST', data });
}

// 获取合伙人别名
export async function getPartnerAlias(data: { keys: string[] }) {
  return request('/v1/setting/get', { method: 'POST', data });
}
