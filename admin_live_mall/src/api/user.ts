import { request } from '@umijs/max';

export const getVerifyCode = (data: { mobile: string; codeType: number }) => {
  return request('/v1/system/sendVerifyCode', {
    method: 'POST',
    data,
  });
};
