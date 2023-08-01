import { request } from '@umijs/max';

export const forgetPassword = (data: { mobile: string; pwd: string; verifyCode: string }) => {
  return request('/api/storeInfoManage/forgotPwd', {
    method: 'POST',
    data,
  });
};
