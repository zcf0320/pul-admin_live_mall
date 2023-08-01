import { request } from '@umijs/max';
import { IPageParams, IQueryParams } from '@/pages/Customer/TotalCustomer/data';

// 获取用户标签列表
export async function getClientTagList(data: IPageParams): Promise<any> {
  return await request('/v1/user/label/queryPage', { method: 'POST', data });
}

// 获取客户列表
export async function getClients(data: IPageParams | (IPageParams & IQueryParams)): Promise<any> {
  return await request<any>('/v1/user/list', { method: 'POST', data });
}

// 导入客户列表
export async function exportCustomerList(data: any): Promise<any> {
  return await request('/v1/user/export', { method: 'POST', data, responseType: 'blob' });
}

// 获取签到记录
export async function attendanceRecord(data: any): Promise<any> {
  return await request('/v1/user/attendanceRecord', { method: 'POST', data });
}

// 补签记录
export async function repairRecord(data: any): Promise<any> {
  return await request('/v1/user/repair', { method: 'POST', data });
}

// 更新用户标签
export async function updateUserTags(data: { id: string; labelIds: string[] }): Promise<any> {
  return await request<any>('/v1/user/updateLabels', { method: 'POST', data });
}

// 设为团长
export async function setAsTeam(data: { id: string }): Promise<any> {
  return await request('/v1/user/setAsTeam', { method: 'POST', data });
}

// 设为客户经理
export async function setAsTutor(data: { id: string }): Promise<any> {
  return await request('/v1/user/setAsTutor', { method: 'POST', data });
}

// 设为合伙人
export async function setAsPartner(data: { id: string }): Promise<any> {
  return await request('/v1/user/setAsPartner', { method: 'POST', data });
}

// 设置用户状态
export async function customerStatus(data: { id: string }): Promise<any> {
  return await request('/v1/user/setStatus', { method: 'POST', data });
}

// 获取合伙人或团长别名
export function getIdentity(data: { keys: string[] }) {
  return request('/v1/setting/get', { method: 'POST', data });
}

// 获取全国城市
export function getAllCity() {
  return request('/v1/region/allCity', { method: 'GET' });
}

// 根据城市id获取子城市
export function getSubcity(data: { id: string }) {
  return request('/v1/region/getItem', { method: 'POST', data });
}
