import { request } from '@umijs/max';

// export interface RoleResponse {
//   records: Role[];
// }
// export interface Role {
//   id: number;
//   members: number;
//   remarks: string;
//   roleName: string;
//   tenantId: number;
// }
// export const getRoleList = (params: { pageNo: number; pageSize: number }) => {
//   return request<API.Response<RoleResponse>>('/api/perms/roleList', { method: 'GET', params });
// };
export const updatePassword = (data: { newPsw: string; oldPsw: string }) => {
  return request<API.Response<string>>('/admin/system/updatePsw', { method: 'POST', data });
};
export const updateAccount = (data: { avatar: string; mobile: string; username: string }) => {
  return request<API.Response<string>>('/api/system/updateAccount', { method: 'POST', data });
};
