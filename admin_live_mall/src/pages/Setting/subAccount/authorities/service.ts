import { request } from '@umijs/max';
import type { IAuthoritiesListItem, IAddAuthoritiesParams } from './data';
const MENU_AUTHORITIES_LIST = '/v1/sys/perms';
const MENU_ADD_AUTHORITIES = '/v1/sys/addPerms';
const MENU_EDIT_AUTHORITIES = '/v1/sys/updatePerms';
const MENU_DELETE_AUTHORITIES = '/v1/sys/deletePerms';
// const ORG_ORG_LIST = '/admin/org/orgList';

/** 查询权限列表 */
export async function getAuthoritiesList() {
  return request<API.Response<IAuthoritiesListItem>>(MENU_AUTHORITIES_LIST, { method: 'GET' });
}
/** 添加权限 */
export async function addAuthorities(data: IAddAuthoritiesParams) {
  return request<API.Response<null>>(MENU_ADD_AUTHORITIES, {
    method: 'POST',
    data,
  });
}
/** 修改权限 */
export async function editAuthorities(data: IAddAuthoritiesParams) {
  return request<API.Response<null>>(MENU_EDIT_AUTHORITIES, {
    method: 'POST',
    data,
  });
}
/** 删除权限 */
export async function deleteAuthorities(data: { id: number }) {
  return request<API.Response<null>>(MENU_DELETE_AUTHORITIES, {
    method: 'POST',
    data,
  });
}
/** 查询公司/机构列表 */
// export async function getOrgList() {
//   return request<API.Response<IOrgListRespones[]>>(ORG_ORG_LIST, {
//     method: 'POST',
//   });
// }
