import { useRef, useState } from 'react';
import { TableRequest } from '@/pages/utils/tableRequest';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import type { TableListItem } from './data';
import { getPage, getSubordinateList } from './service';
import { Drawer } from 'antd';
import styles from './index.less';

export default () => {
  const ref = useRef<ActionType>();

  const [drawerShow, setDrawerShow] = useState<boolean>(false);
  const [currentDetails, setCurrentDetails] = useState<TableListItem | undefined>();

  const detail = (record: TableListItem) => {
    return (
      <a
        onClick={() => {
          setDrawerShow(true);
          setCurrentDetails(record);
        }}
        key="detail"
      >
        详情
      </a>
    );
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      width: 90,
      dataIndex: 'id',
      search: false,
      align: 'center',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '抖音头像',
      dataIndex: 'dyHeadImage',
      width: 90,
      search: false,
      align: 'center',
      ellipsis: true,
      valueType: 'image',
    },
    {
      title: '抖音昵称',
      dataIndex: 'dyUserName',
      width: 90,
      search: false,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '快手头像',
      dataIndex: 'ksHeadImage',
      width: 90,
      search: false,
      align: 'center',
      ellipsis: true,
      valueType: 'image',
    },
    {
      title: '快手昵称',
      dataIndex: 'ksUserName',
      width: 90,
      search: false,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '微信头像',
      dataIndex: 'wxHeadImage',
      width: 90,
      search: false,
      align: 'center',
      ellipsis: true,
      valueType: 'image',
    },
    {
      title: '微信昵称',
      dataIndex: 'wxUserName',
      width: 90,
      search: false,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 120,
      align: 'center',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '邀请码',
      dataIndex: 'inviteCode',
      width: 90,
      align: 'center',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '邀请人手机号',
      dataIndex: 'invitePhone',
      width: 120,
      align: 'center',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      width: 140,
      search: false,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      valueType: 'option',
      align: 'center',
      render: (_, record: TableListItem) => (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {detail(record)}
        </div>
      ),
    },
  ];
  const columns2: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      width: 90,
      dataIndex: 'id',
      search: false,
      align: 'center',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 120,
      align: 'center',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '邀请码',
      dataIndex: 'inviteCode',
      width: 90,
      align: 'center',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '邀请人手机号',
      dataIndex: 'invitePhone',
      width: 120,
      align: 'center',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      width: 140,
      search: false,
      align: 'center',
      ellipsis: true,
    },
  ];

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        scroll={{ x: 1500 }}
        headerTitle="会员列表"
        search={{ labelWidth: 'auto', span: 6 }}
        request={(params) => TableRequest(params, getPage)}
      />

      <Drawer
        width={800}
        placement="right"
        closable={false}
        onClose={() => setDrawerShow(false)}
        open={drawerShow}
        destroyOnClose
      >
        <ProDescriptions
          title="头像昵称"
          column={2}
          dataSource={currentDetails}
          columns={[
            { title: '微信头像', dataIndex: 'wxHeadImage', valueType: 'image' },
            { title: '微信昵称', dataIndex: 'wxUserName' },
            { title: '抖音头像', dataIndex: 'dyHeadImage', valueType: 'image' },
            { title: '抖音昵称', dataIndex: 'dyUserName' },
            { title: '快手头像', dataIndex: 'ksHeadImage', valueType: 'image' },
            { title: '快手昵称', dataIndex: 'ksUserName' },
          ]}
        />
        <br />
        <br />
        <ProDescriptions
          title="用户信息"
          column={3}
          dataSource={currentDetails}
          columns={[
            { title: '手机号', dataIndex: 'phone' },
            { title: '邀请码', dataIndex: 'inviteCode' },
            { title: '邀请人手机号', dataIndex: 'invitePhone' },
            { title: '注册时间', dataIndex: 'registerTime' },
          ]}
        />
        <br />
        <br />
        <ProTable<TableListItem>
          className={styles.table}
          columns={columns2}
          scroll={{ x: 600 }}
          headerTitle="用户下级"
          search={false}
          params={{ id: currentDetails?.id }}
          request={(params) => TableRequest(params, getSubordinateList)}
        />
      </Drawer>
    </PageContainer>
  );
};
