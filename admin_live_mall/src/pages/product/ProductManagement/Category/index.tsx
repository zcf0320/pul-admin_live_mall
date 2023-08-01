import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Select } from 'antd';
import { useRef, useState } from 'react';

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
import { add, edit, editStatus, getPage, remove } from './service';
import FormItem from 'antd/es/form/FormItem';
import { normImage, UploadPhotos } from '@/pages/components/UploadPhotos/UploadPhotos';
import SubTable from './components/SubTable';

export default function PageSpecification() {
  const ref = useRef<ActionType>();
  const reloadTable = () => {
    ref.current?.reload();
  };

  const [isEdit, setIsEdit] = useState<any>();
  const [modalVisit, setModalVisit] = useState(false);
  const [subAddRecord, setSubAddRecord] = useState<TableListItem>();
  const [reloadCount, setReloadCount] = useState(0);

  //新建
  const newAdd = () => {
    return (
      <ModalForm
        key="label"
        title={isEdit ? '编辑分类' : '添加分类'}
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
            setSubAddRecord(undefined);
          }
        }}
        modalProps={{ destroyOnClose: true, maskClosable: false }}
        onFinish={async (values) => {
          console.log('是否编辑？', isEdit?.type);
          let msg = null;
          if (isEdit) {
            msg = await edit({
              ...values,
              id: isEdit.id,
            });
          } else {
            msg = await add({
              ...values,
              parentId: subAddRecord ? subAddRecord.id : undefined,
            });
          }

          if (msg.code === 0) {
            if (isEdit) {
              message.success('编辑成功！');
            } else {
              message.success('新增成功');
            }

            reloadTable();
          } else {
            if (isEdit) {
              message.error('编辑失败！');
            } else {
              message.error('新增失败！');
            }
          }
          return true;
        }}
      >
        <ProFormText
          name="name"
          label="分类名称"
          placeholder="请输入分类名称"
          rules={[{ required: true }]}
        />
        <FormItem
          label="分类图标"
          name={'icon'}
          rules={[{ required: true }]}
          valuePropName="imageUrl"
          getValueFromEvent={normImage}
        >
          <UploadPhotos amount={1}></UploadPhotos>
        </FormItem>
        <FormItem initialValue={1} label="状态" name={'status'} rules={[{ required: true }]}>
          <Select
            options={[
              {
                value: 0,
                label: '禁用',
              },
              {
                value: 1,
                label: '启用',
              },
            ]}
          />
        </FormItem>
        <ProFormDigit name="sort" label="排序" initialValue={1} placeholder="请输入排序" />
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
  const addSubCategory = (record: TableListItem) => (
    <a
      key="alter"
      onClick={() => {
        setModalVisit(true);
        setSubAddRecord(record);
        // console.log(record);
        // record.values = record.specValues;
        // setIsEdit(record);
      }}
    >
      新增二级分类
    </a>
  );

  //删除
  const deleteLabel = (record: TableListItem) => (
    <a
      onClick={() => {
        const deleteModal = Modal.confirm({
          title: `确定要删除分类：${record.name}吗?`,
          onOk: () => {
            remove({ id: record.id }).then(() => {
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

  // 禁用
  const enableAndDisableCategory = (record: TableListItem) => {
    const title = record.status ? '禁用' : '启用';
    return (
      <a
        onClick={() => {
          const deleteModal = Modal.confirm({
            title: `确定要${title}分类：${record.name}吗?`,
            onOk: () => {
              editStatus({ id: record.id, status: record.status ? 0 : 1 }).then(() => {
                message.success(`${title}成功`);
                // refresh();
                deleteModal.destroy();
                reloadTable();
              });
            },
          });
        }}
      >
        {title}
      </a>
    );
  };

  //列表
  const columns: ProColumns<TableListItem>[] = [
    // {
    //   title: 'ID',
    //   width: 200,
    //   dataIndex: 'id',
    //   ellipsis: true,
    // },
    {
      title: '分类名称',
      // width: 230,
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '分类图标',
      dataIndex: 'icon',
      valueType: 'image',
      search: false,
      ellipsis: true,
    },
    // {
    //   title: '排序',
    //   dataIndex: 'sort',
    //   search: false,
    //   ellipsis: true,
    //   tooltip: '数字越大越靠前',
    // },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      ellipsis: true,
      valueEnum: {
        0: '已禁用',
        1: '已启用',
      },
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      align: 'center',
      valueType: 'option',
      // render: (_: any, record: any) => [renderAction(record)],
      render: (_: any, record: any) => [
        addSubCategory(record),
        alterLabel(record),
        enableAndDisableCategory(record),
        deleteLabel(record),
      ],
    },
  ];

  const expandedRowRender = (record: TableListItem, index: any, indent: any, expanded: boolean) => {
    if (!expanded) {
      return null;
    }
    return (
      <SubTable
        editCategory={(record: TableListItem) => {
          setIsEdit(record);
          setSubAddRecord(record);
          setModalVisit(true);
        }}
        reloadCount={reloadCount}
        record={record}
      />
      // <ProTable
      //   columns={[
      //     {
      //       title: '分类名称',
      //       // width: 230,
      //       dataIndex: 'name',
      //       ellipsis: true,
      //     },
      //     {
      //       title: '分类图标',
      //       // width: 230,
      //       dataIndex: 'icon',
      //       valueType: 'image',
      //       // dataIndex: 'name',
      //       ellipsis: true,
      //     },
      //     {
      //       title: '状态',
      //       dataIndex: 'status',
      //       search: false,
      //       ellipsis: true,
      //       valueEnum: {
      //         0: '已启用',
      //         1: '未启用',
      //       },
      //     },
      //     { title: '商品数量', dataIndex: 'name' },
      //     {
      //       title: '操作',
      //       dataIndex: 'operation',
      //       key: 'operation',
      //       valueType: 'option',
      //       render: (text, subRecord: any) => [alterLabel(subRecord), deleteLabel(subRecord)],
      //     },
      //   ]}
      //   params={{
      //     parentId: record.id,
      //   }}
      //   headerTitle={false}
      //   search={false}
      //   options={false}
      //   // dataSource={data}
      //   request={async (params) => {
      //     const result = (await getSubPage(params)).data;
      //     return {
      //       success: true,
      //       data: result,
      //     };
      //   }}
      //   pagination={false}
      // />
    );
  };

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        params={{ parentId: 0 }}
        expandable={{ expandedRowRender }}
        scroll={{ x: 1000 }}
        search={false}
        toolBarRender={() => [newAdd()]}
        request={(params) => {
          setReloadCount((count) => count + 1);
          return TableRequest(params, getPage);
        }}
      />
    </PageContainer>
  );
}
