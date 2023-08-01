import { request } from '@umijs/max';

// 钱包详情
export function walletDetails(data: IWalletDetailRequestParam & { userId: string }) {
  return request('/v1/fund/walletDetails', { method: 'POST', data });
}

// 客户钱包详情导出
export async function exportCustomerWalletDetail(
  data: IWalletDetailFormValues & { userId: string; excludeColumnFieldNames: string[] },
) {
  return await request('/v1/fund/walletDetailsExport', {
    method: 'POST',
    data,
    responseType: 'blob',
  });
}
