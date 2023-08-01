import { normImage, UploadPhotos } from '@/pages/components/UploadPhotos/UploadPhotos';
import { TableRequest } from '@/pages/utils/tableRequest';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Form, message, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import type { TableListItem } from './data';
import { add, edit, getPage, remove } from './service';

const JumpType = {
  1: 'APP页面',
  2: 'H5页面',
};

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
        title={isEdit ? '编辑配置' : '新建配置'}
        trigger={
          <Button type="primary">
            <PlusOutlined />
            新建配置
          </Button>
        }
        initialValues={
          isEdit ? { ...isEdit, jumpType: String(isEdit.jumpType) } : { jumpType: '1' }
        }
        open={modalVisit}
        onOpenChange={(visible) => {
          setModalVisit(visible);
          if (!visible) setIsEdit(null);
        }}
        modalProps={{ destroyOnClose: true, maskClosable: false }}
        onFinish={async (values) => {
          let msg = null;
          if (isEdit?.handleType === '编辑') {
            msg = await edit({ ...values, id: isEdit.id });
          } else {
            msg = await add(values);
          }
          if (msg && msg.code === 0) {
            message.success('成功！');
            reloadTable();
            return true;
          } else {
            message.error('失败！');
            return false;
          }
        }}
      >
        <ProForm.Group>
          <ProFormText name="typeName" label="配置名称" rules={[{ required: true }]} />
          <ProFormText name="type" label="字段名" rules={[{ required: true }]} />
          <ProFormSelect name="jumpType" label="跳转类型" width={'sm'} valueEnum={JumpType} />
        </ProForm.Group>
        <ProForm.Group>
          <Form.Item
            label="图片"
            tooltip="只能上传一张图片哦"
            name="picItem"
            valuePropName="imageUrl"
            getValueFromEvent={normImage}
            rules={[{ required: true, message: '请上传图片' }]}
          >
            <UploadPhotos amount={1} onChange={(e: any) => normImage(e)} />
          </Form.Item>
          <ProFormText width={'md'} name="picItem" label="图片地址" rules={[{ required: true }]} />
          <ProFormDigit label="权重" name="sort" width={'xs'} fieldProps={{ precision: 0 }} />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText name="jumpUrl" label="跳转路径" width={'md'} />
          <ProFormText name="jumpParams" label="跳转参数" width={'md'} />
        </ProForm.Group>
      </ModalForm>
    );
  };

  //编辑
  const alterLabel = (record: any) => (
    <a
      key="alter"
      onClick={() => {
        setModalVisit(true);
        setIsEdit({ ...record, handleType: '编辑' });
      }}
    >
      编辑
    </a>
  );

  // 删除
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

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      width: 60,
      dataIndex: 'id',
      search: false,
      align: 'center',
      ellipsis: true,
      copyable: true,
    },
    { title: '配置名称', width: 90, dataIndex: 'typeName', search: false, align: 'center' },
    { title: '字段名', width: 80, dataIndex: 'type', search: false, align: 'center' },
    {
      title: '图片',
      width: 60,
      dataIndex: 'picItem',
      valueType: 'image',
      search: false,
      align: 'center',
    },
    {
      title: '跳转路径',
      width: 120,
      dataIndex: 'jumpUrl',
      ellipsis: true,
      search: false,
      align: 'center',
      copyable: true,
    },
    {
      title: '跳转参数',
      width: 100,
      dataIndex: 'jumpParams',
      search: false,
      align: 'center',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '跳转类型',
      dataIndex: 'jumpType',
      width: 90,
      valueEnum: JumpType,
      align: 'center',
    },
    { title: '权重', width: 80, dataIndex: 'sort', search: false, align: 'center' },
    {
      title: '操作',
      width: 40,
      align: 'center',
      fixed: 'right',
      valueType: 'option',
      render: (_: any, record: any) => [alterLabel(record), deleteLabel(record)],
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        scroll={{ x: 1500 }}
        headerTitle="首页配置"
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [newAdd()]}
        request={(params) => TableRequest(params, getPage)}
      />
    </PageContainer>
  );
};
