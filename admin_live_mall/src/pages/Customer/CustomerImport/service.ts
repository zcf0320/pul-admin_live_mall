import { request } from '@umijs/max';

export async function downTemplate() {
  return await request('/v1/user/downloadTemplate', { method: 'POST', responseType: 'blob' });
}

// 上传客户列表
export async function uploadCustomerExcel(data: FormData) {
  return await request('/v1/user/importCustomers', { method: 'POST', data });
}

// 客户导入记录
export async function customerExportLog(data: any) {
  return await request('/v1/importHis/customers', { method: 'GET', params: data });
}
