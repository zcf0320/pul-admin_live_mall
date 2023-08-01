import { useRef } from 'react';

import { TableRequest } from '@/pages/utils/tableRequest';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import type { TableListItem } from './data';
import { getPage } from './service';

export default function PageSpecification() {
  const ref = useRef<ActionType>();

  //操作列表
  const columns: ProColumns<TableListItem>[] = [
    // { title: 'ID', width: 90, dataIndex: 'id', search: false },

    // {
    //   title: 'id',
    //   width: 70,
    //   dataIndex: 'id',
    //   align: 'center',
    //   ellipsis: true,
    //   search: false,
    // },
    {
      title: '操作时间',
      width: 70,
      dataIndex: 'createTime',
      align: 'center',
      ellipsis: true,
      search: false,
    },
    {
      title: 'ip',
      width: 70,
      dataIndex: 'ip',
      align: 'center',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作模块',
      width: 70,
      dataIndex: 'module',
      align: 'center',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作类型',
      width: 70,
      dataIndex: 'type',
      align: 'center',
      ellipsis: true,
      search: false,
    },
    {
      title: '请求方式',
      width: 70,
      dataIndex: 'requestMethod',
      align: 'center',
      ellipsis: true,
      search: false,
    },
    {
      title: '请求参数',
      width: 70,
      dataIndex: 'requestParams',
      align: 'center',
      ellipsis: true,
      search: false,
    },
    // {
    //   title: '请求结果',
    //   width: 70,
    //   dataIndex: 'requestResult',
    //   align: 'center',
    //   ellipsis: true,
    //   search: false,
    // },
    {
      title: '请求路径',
      width: 70,
      dataIndex: 'requestUrl',
      align: 'center',
      ellipsis: true,
      search: false,
    },
    {
      title: '运行时间',
      width: 70,
      dataIndex: 'runTime',
      align: 'center',
      ellipsis: true,
      search: false,
      render(_, records) {
        return records.runTime + 'ms';
      },
    },
    {
      title: '用户名',
      width: 70,
      dataIndex: 'username',
      align: 'center',
      ellipsis: true,
      search: false,
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        scroll={{ x: 1000 }}
        search={false}
        request={(params) => TableRequest(params, getPage)}
      />
    </PageContainer>
  );
}
