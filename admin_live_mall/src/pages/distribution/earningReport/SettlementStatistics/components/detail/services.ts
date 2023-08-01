import { request } from '@umijs/max';

//结算明细查询列表
export async function getPageList(data: {
  pageNo?: number;
  pageSize?: number;
  orderNo?: string;
  teamInfo?: string;
  startTime?: string;
  endTime?: string;
}) {
  return request('/v1/team/settlementDetails', { method: 'POST', data });
}

// 结算明细导出
export async function getExport(data: {
  pageNo?: number;
  pageSize?: number;
  orderNo?: string;
  teamInfo?: string;
  startTime?: string;
  endTime?: string;
  excludeColumnFieldNames?: string[];
}) {
  return request('/v1/team/settlementDetailsExport', {
    method: 'POST',
    data,
    responseType: 'blob',
  });
}
