import { request } from '@umijs/max';

export const postPhoneLogin = (data: { mobile: string; verifyCode: string }) => {
  return request<API.Response<string>>('/v1/system/mobileLogin', { method: 'POST', data });
};

export const postPasswordLogin = (data: { username: string; password: string }) => {
  return request<API.Response<string>>('/v1/system/login', { method: 'POST', data });
};
