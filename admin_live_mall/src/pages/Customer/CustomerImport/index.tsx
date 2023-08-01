import { useRef, useState } from 'react';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
import { Badge, Button, notification } from 'antd';
import { ITotalCustomerTabCom } from '@/pages/Customer/TotalCustomer/data';

import UploadModel from './UploadModel';
import { customerExportLog } from '@/pages/Customer/CustomerImport/service';
import type { NotificationPlacement } from 'antd/es/notification/interface';

import styles from '@/pages/Customer/CustomerImport/index.module.less';

export default () => {
  const [showModal, setShowModal] = useState(false);
  const tableRef = useRef<ActionType>();
  const [requestParams, setRequestParams] = useState({
    pageSize: 20,
    pageNo: 1,
  });

  const BatchAddUser = () => (
    <>
      {/*<Button*/}
      {/*  className={styles.batchAdd}*/}
      {/*  onClick={() => {*/}
      {/*    tableRef.current?.reload();*/}
      {/*  }}*/}
      {/*>*/}
      {/*  查询*/}
      {/*</Button>*/}
    </>
  );

  const columns: ProColumns[] = [
    { title: '导入时间', dataIndex: 'createTime', align: 'center' },
    {
      title: '导入状态',
      dataIndex: 'status',
      align: 'center',
      render: (text) => {
        return (
          <>
            <Badge color={text ? 'green' : 'red'} className={styles.mr10} />
            <span>{text === 'finish' ? '成功' : '失败' || '-'}</span>
          </>
        );
      },
    },
    { title: '导入成功数', dataIndex: 'success', align: 'center' },
    { title: '导入失败数', dataIndex: 'fail', align: 'center' },
    { title: '操作者', dataIndex: 'operator', align: 'center' },
    // {
    //   title: '操作',
    //   dataIndex: 'totalPrice',
    //   search: false,
    //   ellipsis: true,
    // },
  ];

  const getCustomerExportLog = async (data: { pageSize: number; pageNo: number }) => {
    const {
      data: { records = [], total = 0 },
    } = await customerExportLog(data);
    return {
      data: records,
      success: true,
      total,
    };
  };
  const newAdd = () => {
    return (
      <Button type="primary" className={styles.batchAdd} onClick={() => setShowModal(true)}>
        <PlusOutlined />
        新增批量导入
      </Button>
    );
  };
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    placement: NotificationPlacement,
    { success, fail }: { fail: number; success: number },
  ) => {
    api.info({
      // type: success === 0 ? 'error' : 'success',
      message: `客户批量导入完成!`,
      description: (
        <>
          <div style={{ color: 'green' }}>成功数：{success || 0}</div>
          <div style={{ color: 'red' }}>失败数：{fail || 0}</div>
        </>
      ),
      placement,
    });
  };
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      {contextHolder}
      <BatchAddUser />
      <ProTable<ITotalCustomerTabCom>
        rowKey="id"
        columns={columns}
        scroll={{ x: 1000 }}
        search={false}
        actionRef={tableRef}
        toolBarRender={() => [newAdd()]}
        request={async (params: any) => {
          setRequestParams(params);
          return await getCustomerExportLog(params);
        }}
        pagination={{
          pageSize: requestParams.pageSize,
        }}
      />
      {showModal ? (
        <UploadModel
          showModal={showModal}
          setShowModal={() => setShowModal(false)}
          onRefresh={() => {
            getCustomerExportLog(requestParams).then((res) => {
              const { success = 0, fail = 0 } = res.data[0];
              openNotification('top', { success, fail });
              tableRef.current?.reload();
            });
          }}
        />
      ) : null}
    </PageContainer>
  );
};
