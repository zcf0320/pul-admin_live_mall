import { request } from '@umijs/max';
// 用户会员权益列表（无分页）
export const equityList = () => {
  return request<API.Response<any>>('/v1/user/level/rights/list', {
    method: 'POST',
  });
};
// 新增用户会员权益;
export const addEquity = (data: {
  rightsDesc: string;
  icon: string;
  id?: number;
  name: string;
  status: number;
}) => {
  return request<API.Response<any>>('/v1/user/level/rights/add', {
    method: 'POST',
    data,
  });
};
// 编辑用户会员权益;
export async function editsEquity(data: {
  id?: string;
  status?: number;
  rightsDesc?: string;
  icon?: string;
  name?: string;
}) {
  return await request<API.Response<any>>('/v1/user/level/rights/edit', { data, method: 'POST' });
}
