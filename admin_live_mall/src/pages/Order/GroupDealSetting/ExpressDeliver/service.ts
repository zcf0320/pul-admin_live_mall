import { request } from '@umijs/max';
import { IDeliverCompany } from './data';

//查询列表
export async function getPage() {
  return request<API.Response<any>>('/v1/freightTemplate/list', {
    method: 'POST',
  });
}
//添加
export async function add(data: any) {
  return request('/admin/productCategory/addCategory', { method: 'POST', data });
}
//编辑
export async function edit(data: any) {
  return request('/admin/productCategory/editCategory', { method: 'POST', data });
}
//删除
export async function remove(data: any) {
  return request('/v1/freightTemplate/del', { method: 'POST', data });
}

// 获取所有的快递公司
export async function getDeliverCompany(data: any = {}) {
  return request<API.Response<IDeliverCompany[]>>('/v1/order/getLogisticsList', {
    method: 'POST',
    data,
  });
}

// 获取已选的快递公司
export async function getSelectedDeliverCompany(data: any = {}) {
  return request<API.Response<IDeliverCompany[]>>('/v1/order/getShopLogistics', {
    method: 'POST',
    data,
  });
}
// 获取已选的快递公司
export async function changeCompanyStatus(data: any) {
  return request('/v1/order/chooseLogistics', {
    method: 'POST',
    data,
  });
}

// 获取设置规则
export async function fetchSettingByKey(data: { keys: string[] }) {
  return request('/v1/setting/get', {
    method: 'POST',
    data,
  });
}

// 设置规则
export async function setSetting(data: { key: string; value: any }[]) {
  return request('/v1/setting/set', {
    method: 'POST',
    data: {
      settingList: data,
    },
  });
}
