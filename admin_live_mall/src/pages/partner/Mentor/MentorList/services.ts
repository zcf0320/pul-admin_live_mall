import { request } from '@umijs/max';

// 新增客户经理
export async function addMentor(data: {
  allowanceRatio: string;
  image: string;
  name: string;
  phone: string;
  remarkName?: string;
}) {
  return request('/v1/tutor/add', { method: 'POST', data });
}

// 获取客户经理列表
export async function getMentorList(data: {
  endTime?: string;
  mentorInfo?: string;
  pageNo: number;
  pageSize: number;
  startTime?: string;
}) {
  return request('/v1/tutor/mentorList', { method: 'POST', data });
}

// 修改备注名
export async function editMentorRemarkName(data: { id: string; remarkName: string }) {
  return await request('/v1/tutor/editRemarkName', { method: 'POST', data });
}

// 设置客户经理津贴
export async function setAllowance(data: { id: string; allowanceRatio: string }) {
  return await request('/v1/tutor/setAllowance', { method: 'POST', data });
}

// 删除客户经理
export async function delMentor(data: { id: string }) {
  return await request('/v1/tutor/del', { method: 'POST', data });
}

// 下级列表;
export async function getSubList(data: { id?: string; pageNo: number; pageSize: number }) {
  return await request('/v1/tutor/subList', { method: 'POST', data });
}
