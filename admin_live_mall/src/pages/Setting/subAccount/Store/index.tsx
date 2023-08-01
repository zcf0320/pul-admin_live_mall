import { useRef, useState } from 'react';

import { TableRequest } from '@/pages/utils/tableRequest';
import {
  ActionType,
  DrawerForm,
  ModalForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProFormDigit,
  ProFormSelect,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components';
import { Button, DatePicker, Form, Input, Modal, Switch, message } from 'antd';
import type { TableListItem } from './data';
import { addStore, addTime, deleteStore, getPage, updateStore } from './service';
import { isPhone } from '@/pages/utils/is';
import dayjs from 'dayjs';

export enum OrderStatus {
  'CLOSE' = 'CLOSE',
  'WAIT_PAY' = 'WAIT_PAY',
  'TO_SHIP' = 'TO_SHIP',
  'TO_RECEIVE' = 'TO_RECEIVE',
  'FINISH' = 'FINISH',
}

export const orderStatusObject: { [key: string]: string } = {
  CLOSE: '已关闭',
  WAIT_PAY: '待付款',
  TO_SHIP: '待发货',
  TO_RECEIVE: '待收货',
  FINISH: '已完成',
};

export default function Store() {
  const ref = useRef<ActionType>();
  const [editValue, setEditValue] = useState<TableListItem>();
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<TableListItem>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addTimeModalOpen, setAddTimeModalOpen] = useState(false);

  const reloadTable = () => {
    ref.current?.reload();
  };

  const renderAdd = () => {
    return (
      <Button
        onClick={() => {
          // TODO
          setDrawerOpen(true);
        }}
        type="primary"
      >
        新增店铺
      </Button>
    );
  };

  const renderSee = (record: TableListItem) => {
    return (
      <a
        onClick={() => {
          setCurrentItem(record);
          setInfoModalOpen(true);
        }}
        type="primary"
      >
        查看
      </a>
    );
  };

  const renderEdit = (record: TableListItem) => {
    return (
      <a
        onClick={() => {
          setEditValue(record);
          setDrawerOpen(true);
        }}
        type="primary"
      >
        编辑
      </a>
    );
  };
  const renderAddTime = (record: TableListItem) => {
    return (
      <a
        onClick={() => {
          setCurrentItem(record);
          setAddTimeModalOpen(true);
        }}
        type="primary"
      >
        续期
      </a>
    );
  };
  const renderMoreAction = (record: TableListItem) => {
    return (
      <TableDropdown
        onSelect={(key) => {
          if (key === 'delete') {
            Modal.confirm({
              title: '删除店铺',
              content: '是否删除店铺',
              onOk: () => {
                deleteStore({
                  id: record.id,
                }).then(() => {
                  message.success('删除成功');
                  reloadTable();
                });
              },
            });
          }
        }}
        key="actionGroup"
        menus={[{ key: 'delete', name: '删除' }]}
      />
    );
  };

  const descColumns: ProDescriptionsItemProps[] = [
    { title: '店铺ID', dataIndex: 'id', ellipsis: true },

    { title: '店铺名称', dataIndex: 'name', ellipsis: true },
    { title: '店铺管理员', dataIndex: 'manager', ellipsis: true },
    {
      title: '手机号',
      dataIndex: 'mobile',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      ellipsis: true,
      renderText: (text, record) => {
        return record.status ? '启用' : '禁用';
      },
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      ellipsis: true,
    },
    {
      title: '截止日期',
      dataIndex: 'endTime',
      ellipsis: true,
    },
  ];

  //常量列表
  const columns: ProColumns<TableListItem>[] = [
    { title: '店铺ID', dataIndex: 'id', search: false, ellipsis: true },

    { title: '店铺名称', dataIndex: 'name', ellipsis: true },
    { title: '店铺管理员', dataIndex: 'manager', search: false, ellipsis: true },
    {
      title: '手机号',
      dataIndex: 'mobile',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,

      ellipsis: true,
      renderText: (text, record) => {
        return record.status ? '启用' : '禁用';
      },
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      ellipsis: true,
      search: false,
      align: 'center',
    },
    {
      title: '截止日期',
      dataIndex: 'endTime',
      ellipsis: true,
      search: false,
      align: 'center',
    },
    {
      title: '操作',
      width: 140,
      fixed: 'right',
      align: 'center',
      valueType: 'option',
      render: (_: any, record: any) => [
        renderSee(record),
        renderEdit(record),
        renderAddTime(record),
        renderMoreAction(record),
      ],
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        scroll={{ x: 1000 }}
        search={{
          span: 6,
          collapsed: false,
          labelWidth: 'auto',
        }}
        toolBarRender={() => [renderAdd()]}
        request={(params) => {
          return TableRequest(params, getPage);
        }}
      />
      <Modal
        width={1000}
        title="店铺详情"
        open={infoModalOpen}
        onCancel={() => {
          setInfoModalOpen(false);
        }}
        destroyOnClose
      >
        <ProDescriptions bordered dataSource={currentItem} columns={descColumns}></ProDescriptions>
      </Modal>

      <ModalForm
        width={600}
        title="续期"
        open={addTimeModalOpen}
        onOpenChange={setAddTimeModalOpen}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={async (values) => {
          await addTime({
            ...values,
            id: currentItem?.id,
          }).then(() => {
            message.success('续期成功');
            reloadTable();
            setAddTimeModalOpen(false);
          });
        }}
      >
        <ProFormDigit
          rules={[{ required: true, message: '请输入续期时间' }]}
          label="续期时间"
          name={'value'}
        ></ProFormDigit>
        <ProFormSelect
          label="续期单位"
          rules={[{ required: true, message: '请输入续期单位' }]}
          name={'unit'}
          options={[
            {
              label: '天',
              value: 'DAY',
            },
            {
              label: '月',
              value: 'MONTH',
            },
            {
              label: '年',
              value: 'YEAR',
            },
          ]}
        ></ProFormSelect>
      </ModalForm>

      <DrawerForm
        onOpenChange={(value) => {
          setDrawerOpen(value);
          if (!value) setEditValue(undefined);
        }}
        drawerProps={{ destroyOnClose: true }}
        title={`${editValue ? '编辑' : '新增'}店铺`}
        width={600}
        initialValues={
          editValue
            ? {
                ...editValue,
                time: [dayjs(editValue?.startTime), dayjs(editValue?.endTime)],
              }
            : undefined
        }
        labelCol={{ span: 4 }}
        open={drawerOpen}
        onFinish={async (values) => {
          const fn = editValue ? updateStore : addStore;
          await fn({
            ...values,
            id: editValue ? editValue.id : undefined,
            startTime: values.time[0],
            endTime: values.time[1],
          }).then(() => {
            message.success('成功');
            reloadTable();
            setDrawerOpen(false);
            setEditValue(undefined);
          });
        }}
      >
        <Form.Item
          name={'name'}
          rules={[
            {
              required: true,
              message: '请输入店铺名称',
            },
          ]}
          label="店铺名称"
        >
          <Input placeholder="请输入店铺名称"></Input>
        </Form.Item>
        <Form.Item
          name={'manager'}
          rules={[{ required: true, message: '请输入店铺管理员名称' }]}
          label="店铺管理员"
        >
          <Input placeholder="请输入店铺管理员名称"></Input>
        </Form.Item>
        <Form.Item
          name={'mobile'}
          rules={[{ required: true, message: '请输入手机号码', validator: isPhone }]}
          label="手机号码"
        >
          <Input placeholder="请输入手机号码"></Input>
        </Form.Item>
        <Form.Item
          name={'time'}
          rules={[{ required: true, message: '请输入手机号码' }]}
          label="店铺有效期"
        >
          <DatePicker.RangePicker></DatePicker.RangePicker>
        </Form.Item>
        <Form.Item name={'remark'} label="备注">
          <Input.TextArea placeholder="请输入备注"></Input.TextArea>
        </Form.Item>
        <Form.Item name={'status'} valuePropName="checked" initialValue={true} label="状态">
          <Switch></Switch>
        </Form.Item>
      </DrawerForm>
    </PageContainer>
  );
}
