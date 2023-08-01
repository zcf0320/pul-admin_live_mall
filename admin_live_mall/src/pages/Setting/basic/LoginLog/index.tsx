import { useRef } from 'react';

import { TableRequest } from '@/pages/utils/tableRequest';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import type { TableListItem } from './data';
import { getPage } from './service';

export default function PageSpecification() {
  const ref = useRef<ActionType>();

  //登录日志列表
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
      title: '登录时间',
      width: 70,
      dataIndex: 'createTime',
      align: 'center',
      ellipsis: true,
      search: false,
    },
    {
      title: '登录ip',
      width: 70,
      dataIndex: 'loginIp',
      align: 'center',
      ellipsis: true,
      search: false,
    },
    {
      title: '登录地址',
      width: 70,
      dataIndex: 'region',
      align: 'center',
      ellipsis: true,
      search: false,
    },
    {
      title: 'userAgent',
      width: 70,
      dataIndex: 'userAgent',
      align: 'center',
      ellipsis: true,
      search: false,
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
