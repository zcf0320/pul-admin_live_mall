import { request } from '@umijs/max';

// 结算统计详情
export async function teamSituation(data: any) {
  return request('/v1/team/situation', { method: 'POST', data });
}
