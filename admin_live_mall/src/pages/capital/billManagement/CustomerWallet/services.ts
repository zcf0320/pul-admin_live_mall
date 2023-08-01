import { request } from '@umijs/max';

export async function customerWallet(data: IRequestParam) {
  return await request('/v1/fund/customerWallet', { method: 'POST', data });
}

export async function quotAadjustment(data: IQuotaParam) {
  return await request('/v1/fund/modifyBalance', { method: 'POST', data });
}

export async function exportCustomerWallet(data: IRequestParam) {
  return await request('/v1/fund/customerWalletExport', {
    method: 'POST',
    data,
    responseType: 'blob',
  });
}
