// 获取合伙人详情
import { request } from '@umijs/max';

// 客户经理详情
export function mentorDetail(data: any): Promise<any> {
  return request('/v1/tutor/details', { method: 'POST', data });
}

// 导出客户经理详情列表 exportPartnerDetailList
export async function exportMentorDetailList(data: any): Promise<any> {
  return await request('/v1/tutor/detailsExport', { method: 'POST', data, responseType: 'blob' });
}
