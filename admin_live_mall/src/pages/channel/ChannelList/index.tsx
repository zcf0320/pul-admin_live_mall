import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { TableRequest } from '@/pages/utils/tableRequest';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDigit,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import type { TableListItem } from './data';
import { add, edit, getPage, remove, getConfig } from './service';

export default function PageSpecification() {
  const ref = useRef<ActionType>();
  const reloadTable = () => {
    ref.current?.reload();
  };

  const [isEdit, setIsEdit] = useState<any>();
  const [modalVisit, setModalVisit] = useState(false);
  const [url, setUrl] = useState();

  useEffect(() => {
    getConfig({ configKey: 'promotionUrl' }).then((res) => {
      setUrl(res.data.records[0].configValue);
    });
  }, []);

  //新建
  const newAdd = () => {
    return (
      <ModalForm
        width={400}
        key="label"
        title={isEdit ? '编辑渠道' : ''}
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
        onFinish={async (v) => {
          const values = {
            ...v,
            commissionRate: v.commissionRate * 0.01,
            id: isEdit?.id,
          };

          let msg = null;
          if (isEdit) {
            msg = await edit(values);
          } else {
            msg = await add(values);
          }

          if (msg.code === 0) {
            message.success('成功！');
            reloadTable();
          } else {
            message.error('失败！');
            return false;
          }
          return true;
        }}
      >
        <ProFormText
          name="name"
          label="渠道名称"
          placeholder="请输入渠道名称"
          rules={[{ required: true }]}
        />
        <ProFormText
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          rules={[{ required: true }]}
        />
        <ProFormText
          name="orgName"
          label="公司名称"
          placeholder="请输入公司名称"
          rules={[{ required: true }]}
        />
        <ProFormDigit
          label="佣金比例"
          name="commissionRate"
          min={0}
          fieldProps={{
            precision: 0,
            formatter: (value) => `${value}%`,
            parser: (value) => Number(value!.replace('%', '')),
            defaultValue: 0,
          }}
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
          title: `确定要删除渠道：${record.name}吗?`,
          onOk: () => {
            remove({ id: record.id }).then(() => {
              message.success('删除成功');
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

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      width: 90,
      dataIndex: 'id',
      search: false,
      ellipsis: true,
      copyable: true,
      align: 'center',
    },
    {
      title: '渠道名称',
      dataIndex: 'name',
      width: 90,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 90,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '公司名称',
      dataIndex: 'orgName',
      width: 90,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '佣金比例',
      dataIndex: 'commissionRate',
      width: 90,
      search: false,
      ellipsis: true,
      align: 'center',
      renderText: (_, record) => record.commissionRate * 100 + '%',
    },
    {
      title: '推广链接',
      dataIndex: '',
      width: 200,
      search: false,
      ellipsis: true,
      copyable: true,
      align: 'center',
      renderText: (_, record) => {
        return (url || '') + record.id;
      },
    },
    {
      title: '操作',
      width: 100,
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
        scroll={{ x: 1000 }}
        search={{
          labelWidth: 'auto',
          span: 6,
        }}
        toolBarRender={() => [newAdd()]}
        request={(params) => TableRequest(params, getPage)}
      />
    </PageContainer>
  );
}
