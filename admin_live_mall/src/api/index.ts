import { request } from '@umijs/max';

//获取联系客户二维码
export const getServiceQrCode = () => {
  return request<API.Response<any>>('/api/link/linkService', {
    method: 'GET',
  });
};
//获取系统统计数据
export const getSystemIndexData = () => {
  return request<API.Response<any>>('/api/system/indexData', {
    method: 'GET',
  });
};
//获取商家信息
export const getEnterpriseInfo = () => {
  return request<API.Response<any>>('/api/system/enterpriseInfo', {
    method: 'GET',
  });
};
//获取分类数据
export const categoryList = (data: any) => {
  return request<API.Response<any>>('/api/productInfo/categoryList', {
    method: 'POST',
    data,
  });
};

// https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/getUnlimitedQRCode.html
// 生成小程序二维码
export const generateWxQrCode = (data: {
  envVersion: 'release' | 'trial' | 'develop';
  page: string;
  scene: string;
}) => {
  return request<API.Response<any>>('/v1/live/getWxQrCode', {
    method: 'POST',
    data,
  });
};
