import { message, Modal } from 'antd';
import { useRef } from 'react';

import { TableRequest } from '@/pages/utils/tableRequest';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import type { TableListItem } from './data';
import { getPage, multipartAction } from './service';

export default function PageSpecification() {
  const ref = useRef<ActionType>();
  const reloadTable = () => {
    ref.current?.reload();
  };

  //编辑
  const alterLabel = (record: any) => (
    <a
      key="alter"
      onClick={() => {
        const deleteModal = Modal.confirm({
          title: `确定要恢复：${record.name}吗?`,
          onOk: () => {
            multipartAction({ ids: [record.id], del: false }).then(() => {
              message.success('恢复成功');
              // refresh();
              deleteModal.destroy();
              reloadTable();
            });
          },
        });
      }}
    >
      恢复
    </a>
  );

  //删除
  const deleteLabel = (record: TableListItem) => (
    <a
      onClick={() => {
        const deleteModal = Modal.confirm({
          title: `确定要彻底删除：${record.name}吗?`,
          onOk: () => {
            multipartAction({ ids: [record.id], del: true }).then(() => {
              message.success('删除成功');
              // refresh();
              deleteModal.destroy();
              reloadTable();
            });
          },
        });
      }}
    >
      彻底删除
    </a>
  );

  //常量列表
  const columns: ProColumns<TableListItem>[] = [
    // {
    //   title: 'ID',
    //   width: 200,
    //   dataIndex: 'id',
    //   ellipsis: true,
    // },
    {
      title: '商品名称',
      width: 400,
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '价格',
      dataIndex: 'salePrice',
      search: false,
      ellipsis: true,
      valueType: 'money',
    },
    {
      title: '库存',
      dataIndex: 'stockCount',
      search: false,
      ellipsis: true,
    },
    {
      title: '删除时间',
      dataIndex: 'deleteTime',
      search: false,
      ellipsis: true,
      render: (text, record) => <span>{record?.deleteTime ?? record?.modifyTime}</span>,
    },
    {
      title: '删除时间',
      dataIndex: 'createTime',
      search: {
        transform: (value) => ({
          startTime: value[0],
          endTime: value[1],
        }),
      },
      valueType: 'dateTimeRange',
      ellipsis: true,
      hideInTable: true,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      align: 'center',
      valueType: 'option',
      // render: (_: any, record: any) => [renderAction(record)],
      render: (_: any, record: any) => [alterLabel(record), deleteLabel(record)],
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        // rowSelection={{
        //   checkStrictly: false,
        //   onChange: (selectedRowKeys) => {
        //     console.log(selectedRowKeys);
        //   },
        // }}
        scroll={{ x: 1000 }}
        search={{
          labelWidth: 'auto',
        }}
        request={(params) => TableRequest(params, getPage)}
      />
    </PageContainer>
  );
}
