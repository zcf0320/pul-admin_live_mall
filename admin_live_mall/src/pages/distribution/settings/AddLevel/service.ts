import { request } from '@umijs/max';
import { AddLevel } from './data';

export async function addLevel(data: AddLevel) {
  return request<API.Response>('/v1/team/addLevel', { method: 'POST', data });
}
export async function editLevel(data: AddLevel) {
  return request<API.Response>('/v1/team/editLevel', { method: 'POST', data });
}
