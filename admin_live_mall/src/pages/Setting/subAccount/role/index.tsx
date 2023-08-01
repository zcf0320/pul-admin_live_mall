import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import { useRef, useState } from 'react';

import { addRole, deleteRole, roleList, updateRole } from '@/api/system';
import { IRoleForm, IRoleRecord } from '@/api/type';
import { TableRequest } from '@/pages/utils/tableRequest';
import {
  ActionType,
  DrawerForm,
  PageContainer,
  ProColumns,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import AuthProTable from '../../components/AuthProTable';

export default function () {
  const ref = useRef<ActionType>();
  const reloadTable = () => ref.current?.reload();

  const [isEdit, setIsEdit] = useState<IRoleRecord>();
  const [modalVisit, setModalVisit] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);

  //新建
  const newAdd = () => {
    return (
      <DrawerForm<IRoleForm>
        key="tableForm"
        width={900}
        trigger={
          <Button type="primary">
            <PlusOutlined />
            新建
          </Button>
        }
        initialValues={{ name: isEdit?.roleName, remark: isEdit?.remarks }}
        title={isEdit ? '编辑' : '新建'}
        open={modalVisit}
        drawerProps={{
          maskClosable: false,
          destroyOnClose: true,
        }}
        onOpenChange={(visible) => {
          setModalVisit(visible);
          if (!visible) {
            setIsEdit(undefined);
            setPermissions([]);
          }
        }}
        onFinish={async (values) => {
          console.log(values, permissions);

          let res;
          if (isEdit) {
            res = await updateRole({ ...values, id: isEdit.id, permissions });
          } else {
            res = await addRole({ ...values, permissions });
          }

          if (res.code === 0) {
            message.success('成功！');
            reloadTable();
          } else {
            message.error('失败！');
            return false;
          }
          return true;
        }}
      >
        <ProFormText name="name" label="岗位名称" rules={[{ required: true }]} />
        <ProFormText name="remark" label="备注" />

        <AuthProTable
          toolBarRender={false}
          pagination={false}
          hideAction={true}
          rowSelection={{
            checkStrictly: false,
            defaultSelectedRowKeys: isEdit?.permissions || [],
            onChange: (selectedRowKeys) => {
              console.log(selectedRowKeys);
              setPermissions(selectedRowKeys as string[]);
            },
          }}
        />
      </DrawerForm>
    );
  };

  //编辑
  const alterLabel = (record: IRoleRecord) => (
    <a
      key="alterLabel"
      onClick={() => {
        setPermissions(record.permissions);
        setModalVisit(true);
        setIsEdit(record);
      }}
    >
      编辑
    </a>
  );

  //删除
  const deleteLabel = (record: IRoleRecord) => (
    <a
      key="deleteLabel"
      onClick={() => {
        Modal.confirm({
          title: '删除',
          content: '确定删除吗？',
          onOk: async () => {
            const res = await deleteRole({ id: record.id });
            if (res.code === 0) {
              message.success('删除成功！');
              reloadTable();
            } else {
              message.error('删除失败！');
            }
          },
        });
      }}
    >
      删除
    </a>
  );

  // 操作
  // const renderAction = (record: IRoleRecord) => {
  //   const dropdownItems: ItemType[] = [
  //     {
  //       key: '1',
  //       label: alterLabel(record),
  //     },
  //     {
  //       key: '2',
  //       label: deleteLabel(record),
  //     },
  //   ].filter((item) => item.label !== null);

  //   return (
  //     <Dropdown trigger={['click']} menu={{ items: dropdownItems }} placement="bottomLeft">
  //       <Button size="small" type="primary">
  //         操作
  //         <DownOutlined />
  //       </Button>
  //     </Dropdown>
  //   );
  // };

  //列表
  const columns: ProColumns<IRoleRecord>[] = [
    {
      title: '岗位名称',
      //  width: 250,
      dataIndex: 'roleName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '成员',
      // width: 230,
      dataIndex: 'members',
      search: false,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '备注',
      // width: 230,
      dataIndex: 'remarks',
      search: false,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作',
      width: 80,
      search: false,
      align: 'center',
      fixed: 'right',
      valueType: 'option',
      // render: (_, record) => [renderAction(record)],
      render: (_, record) => [alterLabel(record), deleteLabel(record)],
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<IRoleRecord>
        columns={columns}
        actionRef={ref}
        form={{ span: 6, collapsed: false }}
        scroll={{ x: 1000 }}
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [newAdd()]}
        request={(params) => TableRequest({ ...params, name: params.roleName }, roleList)}
      />
    </PageContainer>
  );
}
