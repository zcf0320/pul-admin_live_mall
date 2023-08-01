// 获取可以导出的字段
import { request } from '@@/exports';

export function getExportFields(data: any) {
  return request(`/v1/system/getExportField?className=${data}`, { method: 'POST' });
}
