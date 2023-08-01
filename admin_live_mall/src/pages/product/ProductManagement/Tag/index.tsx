import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
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

export default function PageSpecification() {
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
        width={500}
        title={isEdit ? '编辑标签' : '新增标签'}
        trigger={
          <Button type="primary">
            <PlusOutlined />
            新建
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
          if (isEdit) {
            msg = await edit({ ...values, id: isEdit.id });
          } else {
            msg = await add(values);
          }

          if (msg.code === 0) {
            message.success(isEdit ? '编辑成功！' : '新增成功！');
            reloadTable();
          } else {
            message.error(isEdit ? '编辑失败！' : '新增失败');
          }
          return true;
        }}
      >
        <ProFormText
          name="name"
          label="标签名称"
          placeholder="请输入标签名称"
          rules={[{ required: true }]}
        />
      </ModalForm>
    );
  };

  //编辑
  const alterLabel = (record: any) => (
    <a
      key="alter"
      onClick={() => {
        setModalVisit(true);
        console.log(record);
        record.values = record.specValues;
        setIsEdit(record);
      }}
    >
      编辑
    </a>
  );

  //删除
  const deleteLabel = (record: TableListItem) => (
    <a
      onClick={() => {
        const deleteModal = Modal.confirm({
          title: `确定要删除标签：${record.name}吗?`,
          onOk: () => {
            remove({ ids: [record.id] }).then(() => {
              message.success('删除成功');
              // refresh();
              deleteModal.destroy();
              reloadTable();
            });
          },
        });
      }}
    >
      删除
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
      title: '标签名称',
      width: 230,
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '商品数',
      dataIndex: 'productCount',
      search: false,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
      ellipsis: true,
    },
    {
      title: '操作',
      width: 100,
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
        scroll={{ x: 1000 }}
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [newAdd()]}
        request={(params) => TableRequest(params, getPage)}
      />
    </PageContainer>
  );
}
