import { request } from '@umijs/max';
// 获取标签组列表数据

export const labelGroupsList = (data: { pageNo: number; pageSize: number }) => {
  return request<API.Response<any>>('/v1/user/label/queryGroup', {
    method: 'POST',
    data,
  });
};
// 添加标签组
export const addGroup = (data: { name: string }) => {
  return request<API.Response<any>>('/v1/user/label/addGroup', {
    method: 'POST',
    data,
  });
};

// 修改标签分组和标签
export const editGroup = (data: { id?: string; name: string; pid?: string }) => {
  return request<API.Response<any>>('/v1/user/label/edit', {
    method: 'POST',
    data,
  });
};
// 删除标签分组
export const delGroup = (data: { ids: string[] }) => {
  return request<API.Response<any>>('/v1/user/label/delGroup', {
    method: 'POST',
    data,
  });
};
// 删除标签
export const delTags = (data: { ids: string[] }) => {
  return request<API.Response<any>>('/v1/user/label/del', {
    method: 'POST',
    data,
  });
};
