import { request } from '@umijs/max';
import { IPermsTree, IRoleForm, IRoleRecord } from './type';

// ------ 角色 start ------
export const getPermsTree = () => {
  return request<API.ResponsePage<IPermsTree[]>>('/v1/sys/perms', {
    method: 'GET',
  });
};

export const roleList = (data: { pageNo: number; pageSize: number; name?: string }) => {
  return request<API.ResponsePage<IRoleRecord>>('/v1/sys/roleList', {
    method: 'GET',
    params: data,
  });
};

export const deleteRole = (data: { id: number }) => {
  return request<API.Response<any>>('/v1/sys/deleteRole', {
    method: 'POST',
    data,
  });
};

export const addRole = (data: IRoleForm) => {
  return request<API.Response<any>>('/v1/sys/addRole', {
    method: 'POST',
    data,
  });
};

export const updateRole = (data: IRoleForm) => {
  return request<API.Response<any>>('/v1/sys/updateRole', {
    method: 'POST',
    data,
  });
};
// ------ 角色 end ------

// ------ 员工 start ------
export const userList = (data: {
  pageNo: number;
  pageSize: number;
  mobile?: string;
  username?: string;
}) => {
  return request<API.ResponsePage<IRoleRecord>>('/v1/sys/userList', {
    method: 'GET',
    params: data,
  });
};

export const userAdd = (data: any) => {
  return request<API.Response<any>>('/v1/sys/userAdd', {
    method: 'POST',
    data,
  });
};

export const userUpdate = (data: any) => {
  return request<API.Response<any>>('/v1/sys/userUpdate', {
    method: 'POST',
    data,
  });
};

export const userDelete = (data: any) => {
  return request<API.Response<any>>('/v1/sys/userDelete', {
    method: 'POST',
    params: data,
  });
};
// ------ 员工 end ------
