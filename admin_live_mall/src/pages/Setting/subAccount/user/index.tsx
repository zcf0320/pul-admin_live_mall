import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Tag } from 'antd';
import { useRef, useState } from 'react';

import { roleList, userAdd, userDelete, userList, userUpdate } from '@/api/system';
import { IUserForm, IUserRecord } from '@/api/type';
import { TableRequest } from '@/pages/utils/tableRequest';
import {
  ActionType,
  DrawerForm,
  PageContainer,
  ProColumns,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';

export default function () {
  const ref = useRef<ActionType>();
  const reloadTable = () => ref.current?.reload();

  const [isEdit, setIsEdit] = useState<IUserRecord>();
  const [modalVisit, setModalVisit] = useState(false);

  //新建
  const newAdd = () => {
    return (
      <DrawerForm<IUserForm>
        key="label"
        title={isEdit ? '编辑' : '新建'}
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
            setIsEdit(undefined);
          }
        }}
        drawerProps={{ destroyOnClose: true, maskClosable: false }}
        onFinish={async (values) => {
          if (values.password && values.password !== values.password2) {
            message.error('输入密码不一致');
            return;
          }

          let res;
          if (isEdit) {
            res = await userUpdate({ ...values, id: isEdit.id });
          } else {
            res = await userAdd(values);
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
        <ProFormText
          name="username"
          initialValue={isEdit?.userName}
          label="员工账号"
          placeholder="请输入员工账号"
          rules={[{ required: true }]}
        />
        <ProFormText
          name="realName"
          label="员工姓名"
          placeholder="请输入员工姓名"
          rules={[{ required: true }]}
        />
        <ProFormText
          name="mobile"
          label="手机号"
          placeholder="请输入员工手机号"
          rules={[{ required: true }]}
        />
        <ProFormText.Password
          name="password"
          label="登录密码"
          placeholder="请输入登录密码"
          rules={[{ required: isEdit ? false : true }]}
        />
        <ProFormText.Password
          name="password2"
          label="确认密码"
          placeholder="请确认密码"
          rules={[{ required: isEdit ? false : true }]}
        />
        <ProFormSelect
          name="roleIds"
          label="角色"
          rules={[{ required: true }]}
          mode="multiple"
          fieldProps={{
            fieldNames: { value: 'id', label: 'name' },
            tokenSeparators: [','],
          }}
          initialValue={isEdit?.roles.map((i) => i.id)}
          request={async () => {
            const res = await roleList({ pageNo: 1, pageSize: 10000 });
            return res?.data?.records.map((item) => ({
              id: item.id,
              name: item.roleName,
            }));
          }}
        />
      </DrawerForm>
    );
  };

  //编辑
  const alterLabel = (record: IUserRecord) => (
    <a
      key="alterLabel"
      onClick={() => {
        setModalVisit(true);
        setIsEdit(record);
      }}
    >
      编辑
    </a>
  );

  //删除
  const deleteLabel = (record: IUserRecord) => (
    <a
      key="deleteLabel"
      onClick={() => {
        Modal.confirm({
          title: '删除',
          content: '确定删除吗？',
          onOk: async () => {
            const res = await userDelete({ id: record.id });
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
  // const renderAction = (record: IUserRecord) => {
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
  const columns: ProColumns<IUserRecord>[] = [
    {
      title: '员工账号',
      width: 230,
      dataIndex: 'userName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '员工姓名',
      width: 230,
      dataIndex: 'realName',
      align: 'center',
      search: false,
      ellipsis: true,
    },
    {
      title: '员工头像',
      width: 230,
      dataIndex: 'headImage',
      search: false,
      align: 'center',
      ellipsis: true,
      valueType: 'avatar',
    },
    {
      title: '员工手机号',
      width: 230,
      dataIndex: 'mobile',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '员工角色',
      width: 230,
      search: false,
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        return record.roles?.map((i) => {
          return <Tag key={i.id}>{i.roleName}</Tag>;
        });
      },
    },
    {
      title: '操作',
      width: 80,
      search: false,
      align: 'center',
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => [alterLabel(record), deleteLabel(record)],
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<IUserRecord>
        columns={columns}
        actionRef={ref}
        scroll={{ x: 1000 }}
        form={{ span: 6, collapsed: false }}
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [newAdd()]}
        request={(params) => TableRequest({ ...params, username: params.userName }, userList)}
      />
    </PageContainer>
  );
}
