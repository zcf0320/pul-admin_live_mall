import { request } from '@umijs/max';
//获取标签列表分页数据
export const customerPageList = (data: { name?: string; pageNo?: number; pageSize?: number }) => {
  return request<API.Response>('/v1/user/label/queryPage', {
    method: 'POST',
    data,
  });
};
// 获取标签组列表数据无分页
export const groupsList = () => {
  return request<API.Response<any>>('/v1/user/label/groupList', {
    method: 'POST',
  });
};
// 添加标签
export const customerAddLabel = (data: { id: string; name: string }) => {
  return request<API.Response<any>>('/v1/user/label/add', {
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
// 导出标签
export const exportLabels = (data: { name: string; excludeColumnFieldNames: string[] }) => {
  return request<API.Response<any>>('/v1/user/label/exportLabels', {
    method: 'POST',
    data,
    responseType: 'blob',
  });
};
// 修改标签分组和标签
export const editGroup = (data: { id?: string; name: string; pid?: string }) => {
  return request<API.Response<any>>('/v1/user/label/edit', {
    method: 'POST',
    data,
  });
};
