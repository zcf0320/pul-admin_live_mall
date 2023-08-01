import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm } from 'antd';
import { useRef, useState } from 'react';

import { TableRequest } from '@/pages/utils/tableRequest';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import type { TableListItem } from './data';
import { add, edit, getPage, remove } from './service';

export default () => {
  const ref = useRef<ActionType>();
  const reloadTable = () => {
    ref.current?.reload();
  };

  const [isEdit, setIsEdit] = useState<any>();
  const [modalVisit, setModalVisit] = useState(false);

  //新建
  const newAdd = () => {
    return (
      <ModalForm
        key="label"
        title={isEdit ? '编辑常量' : '新建常量'}
        trigger={
          <Button type="primary">
            <PlusOutlined />
            新建常量
          </Button>
        }
        initialValues={isEdit}
        open={modalVisit}
        onOpenChange={(visible) => {
          setModalVisit(visible);
          if (!visible) {
            setIsEdit(null);
          }
        }}
        modalProps={{ destroyOnClose: true, maskClosable: false }}
        onFinish={async (values) => {
          console.log('是否编辑？', isEdit?.type);

          let msg = null;
          if (isEdit?.type === '编辑') {
            msg = await edit(values);
          } else {
            msg = await add(values);
          }

          if (msg.code === 0) {
            message.success('成功！');
            reloadTable();
          } else {
            message.error('失败！');
          }
          return true;
        }}
      >
        <ProFormText name="configKey" label="Key" rules={[{ required: true }]} />
        <ProFormText name="configName" label="常量描述" rules={[{ required: true }]} />
        <ProFormText name="configValue" label="常量值" rules={[{ required: true }]} />
      </ModalForm>
    );
  };

  //编辑
  const alterLabel = (record: any) => (
    <a
      key="alter"
      onClick={() => {
        setModalVisit(true);
        setIsEdit({ ...record, type: '编辑' });
      }}
    >
      编辑
    </a>
  );

  //删除
  const deleteLabel = (record: any) => (
    <Popconfirm
      key="deleteLabel"
      title="确定要删除吗?"
      onConfirm={async () => {
        const res = await remove({ id: record.id });
        if (res.code === 0) {
          message.success('删除成功！');
          reloadTable();
        } else {
          message.error('删除失败！');
        }
      }}
    >
      <a>删除</a>
    </Popconfirm>
  );

  //常量列表
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      width: 90,
      dataIndex: 'id',
      search: false,
      copyable: true,
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Key',
      width: 100,
      dataIndex: 'configKey',
      ellipsis: true,
      copyable: true,
      align: 'center',
    },
    {
      title: '常量描述',
      width: 230,
      dataIndex: 'configName',
      search: false,
      ellipsis: true,
      copyable: true,
      align: 'center',
    },
    {
      title: '常量值',
      width: 250,
      dataIndex: 'configValue',
      search: false,
      ellipsis: true,
      copyable: true,
      align: 'center',
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      align: 'center',
      valueType: 'option',
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
          {alterLabel(record)}
          {deleteLabel(record)}
        </div>
      ),
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        headerTitle="常量列表"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [newAdd()]}
        request={(params) => TableRequest(params, getPage)}
      />
    </PageContainer>
  );
};
