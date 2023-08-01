import { request } from '@umijs/max';

// 当前用户信息接口
export async function queryCurrentUser() {
  return request('/v1/sys/menu', { method: 'GET' });
}
// 退出登录
export async function outLogin() {
  return request('/v1/system/logout', {
    method: 'GET',
  });
}
