import { request } from '@umijs/max';

// 获取提现统计
export function withDrawStatistics(data: { startTime: string; endTime: string }) {
  return request('/v1/fund/withdrawalStatistics', { method: 'POST', data });
}
