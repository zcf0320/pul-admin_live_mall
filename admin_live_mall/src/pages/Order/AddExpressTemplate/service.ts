import { request } from '@umijs/max';
import { IRegion } from './data';

//查询列表
export async function getRegion() {
  return request<API.Response<IRegion[]>>('/v1/region/allCity', {
    method: 'GET',
  });
}
//添加
export async function addTemplate(data: any) {
  return request('/v1/freightTemplate/add', { method: 'POST', data });
}
//编辑
export async function editTemplate(data: any) {
  return request('/v1/freightTemplate/edit', { method: 'POST', data });
}
//删除
export async function getDetail(data: any) {
  return request('/v1/freightTemplate/details', { method: 'POST', data });
}
