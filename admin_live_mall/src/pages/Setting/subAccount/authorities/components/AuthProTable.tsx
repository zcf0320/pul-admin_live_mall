import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProTableProps } from '@ant-design/pro-components';
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag, TreeSelect } from 'antd';
import { useRef, useState } from 'react';

import { ProFormSwitch, ProTable } from '@ant-design/pro-components';
import type { IAddAuthoritiesParams, IAuthoritiesListItem } from '../../authorities/data';
import { addAuthorities, deleteAuthorities, editAuthorities, getAuthoritiesList } from '../service';
import { TableArrRequest, TreeTableArrRequest } from '../utils/utils';
import { cloneDeep } from 'lodash';

enum EType {
  create = '新建',
  update = '编辑',
}

enum EAuthoritiesType {
  menu = 0,
  action = 1,
  group = 2,
}

const menuTypeOptions = [
  { value: 0, label: '菜单' },
  { value: 1, label: '按钮' },
  { value: 2, label: '分组' },
];

const menuTypeMap = {
  0: {
    color: 'blue',
    text: '菜单',
  },
  1: {
    color: 'green',
    text: '按钮',
  },
  2: {
    color: 'yellow',
    text: '分组',
  },
};
export default ({
  hideAction = false,
  ...restProps
}: ProTableProps<IAuthoritiesListItem, IAddAuthoritiesParams> & { hideAction?: boolean }) => {
  const ref = useRef<ActionType>();
  const reloadTable = () => {
    ref.current?.reload();
  };
  const [modalVisit, setModalVisit] = useState(false);
  const [CURDType, setCURDType] = useState<EType>();
  const [menuData, setMenuData] = useState<IAuthoritiesListItem[]>();
  const [currentRecord, setCurrentRecord] = useState<Partial<IAuthoritiesListItem> | null>();

  const showModal = (type = EType.create, record?: IAuthoritiesListItem) => {
    setCURDType(type);
    if (type === EType.create) {
      setCurrentRecord({ menuType: EAuthoritiesType.menu });
    } else {
      setCurrentRecord({
        ...record,
        parentId: record?.parentId !== -1 ? record?.parentId : undefined,
      });
    }
    setModalVisit(true);
  };

  const transform = (menuData: IAuthoritiesListItem[]): IAuthoritiesListItem[] => {
    return menuData.map((item) => {
      return {
        ...item,
        disabled: item.menuType === EAuthoritiesType.action,
        subMenus: item.subMenus?.length > 0 ? transform(item.subMenus) : [],
      };
    });
  };

  const transformTreeData = (menuData: IAuthoritiesListItem[]) => {
    const newMenuData = cloneDeep(menuData);
    return transform(newMenuData);
  };

  const closeModal = () => {
    reloadTable();
    setModalVisit(false);
  };
  const renderCreat = () => (
    <ModalForm<any>
      key="create"
      trigger={
        <Button
          type="primary"
          onClick={() => {
            showModal();
          }}
        >
          <PlusOutlined />
          新建
        </Button>
      }
      width={500}
      open={modalVisit}
      onOpenChange={setModalVisit}
      modalProps={{ destroyOnClose: true }}
      initialValues={{ ...currentRecord }}
      onFinish={async (formData) => {
        const FormatFormData = {
          ...formData,
          authorityName: formData.menuName,
        };
        if (CURDType === EType.create) {
          const msg = await addAuthorities(FormatFormData);
          if (msg.code === 0) message.success('创建成功');
          closeModal();
        } else {
          const msg = await editAuthorities({ ...FormatFormData, id: currentRecord?.id });
          if (msg.code === 0) message.success('修改成功');
          closeModal();
        }
      }}
    >
      {/* <ProFormDigit name="id" label="ID" tooltip="系统生成，不能修改" placeholder="" disabled /> */}
      {/* <ProFormSelect
        name="orgCode"
        label="公司/机构编码"
        rules={[{ required: true }]}
        fieldProps={{
          fieldNames: { value: 'code', label: 'name' },
        }}
        request={async () => {
          const orgList = await getOrgList();
          return orgList?.data.map((item) => ({ code: item.orgCode, name: item.orgName }));
        }}
      /> */}
      <ProFormRadio.Group
        name="menuType"
        label="权限类型"
        rules={[{ required: true }]}
        options={menuTypeOptions}
        fieldProps={{
          onChange: (e) => setCurrentRecord({ ...currentRecord, menuType: e.target.value }),
        }}
      />

      <ProFormText name="menuName" label="权限名称" rules={[{ required: true }]} />
      {
        <ProForm.Item
          name="parentId"
          label="父级"
          // rules={[{ required: currentRecord?.menuType !== EAuthoritiesType.action }]}
        >
          <TreeSelect
            treeData={transformTreeData(menuData ?? [])}
            fieldNames={{
              value: 'id',
              label: 'menuName',
              children: 'subMenus',
            }}
            treeLine={{ showLeafIcon: false }}
            allowClear={true}
            placeholder={!!currentRecord?.menuType ? '请选择' : '不填为一级菜单'}
          >
            {/* {menuData?.map((item) => [
              <TreeNode
                key={item.id}
                value={item.id}
                title={item.menuName}
                disabled={currentRecord?.menuType === EAuthoritiesType.action}
              >
                {item?.subMenus?.map((subItem) => [
                  <TreeNode key={subItem.id} value={subItem.id} title={subItem.menuName} />,
                ])}
              </TreeNode>,
            ])} */}
          </TreeSelect>
        </ProForm.Item>
      }
      {currentRecord?.menuType === EAuthoritiesType.menu ||
      currentRecord?.menuType === EAuthoritiesType.group ? (
        <ProFormText name="menuUrl" label="菜单路径" rules={[{ required: true }]} />
      ) : (
        <ProFormText name="authority" label="权限标识" rules={[{ required: true }]} />
      )}
      <ProFormSwitch initialValue={false} label="不在菜单中显示" name={'hidden'} />
      {/* <ProFormSwitch initialValue={true} label="显示菜单（一级路由可用）" name={'layout'} /> */}
      <ProFormDigit name="sort" label="权重" />
    </ModalForm>
  );
  const renderUpdate = (record: IAuthoritiesListItem) => (
    <Button
      key="update"
      size="small"
      shape="circle"
      icon={<EditOutlined />}
      onClick={() => showModal(EType.update, record)}
    />
  );
  const renderDelete = ({ id, menuName }: IAuthoritiesListItem) => (
    <Popconfirm
      key="delete"
      okType="danger"
      title={`确认删除【${menuName}】吗?`}
      onConfirm={() => {
        deleteAuthorities({ id }).then(() => {
          message.success(`删除成功`);
          reloadTable();
        });
      }}
    >
      <Button size="small" shape="circle" icon={<DeleteOutlined />} />
    </Popconfirm>
  );

  const columns: ProColumns<IAuthoritiesListItem>[] = [
    {
      title: '权限名称',
      width: 200,
      dataIndex: 'menuName',
      search: false,
    },
    {
      title: '权限标识',
      width: 200,
      dataIndex: 'menuUrl',
      search: false,
    },
    {
      title: '权限标识',
      width: 200,
      dataIndex: 'authority',
      search: false,
    },
    {
      title: '权重',
      width: 200,
      dataIndex: 'sort',
      search: false,
    },
    {
      title: '权限类型',
      width: 150,
      align: 'center',
      dataIndex: 'menuType',
      search: false,
      render: (_, record) => (
        // @ts-ignore
        <Tag color={menuTypeMap[record.menuType].color}>{menuTypeMap[record.menuType].text}</Tag>
      ),
    },
    // {
    //   title: '层级',
    //   width: 130,
    //   align: 'center',
    //   dataIndex: 'parentId',
    //   search: false,
    //   render: (_, record) => {
    //     if (record.parentId === -1) {
    //       return '1级';
    //     } else if (record.menuType === 0) {
    //       return '2级';
    //     }
    //     return '3级';
    //   },
    // },
    {
      title: '操作',
      width: 150,
      valueType: 'option',
      render: (_, record) => [renderUpdate(record), renderDelete(record)],
      hideInTable: hideAction,
    },
  ];

  const expandedRowRender = (record: IAuthoritiesListItem, index: number, _count = 0) => {
    /// 根据count判断是哪一级权限
    let count = _count;
    count += 1;
    return (
      <ProTable
        key={index}
        columns={
          columns
          // .filter((item) => count < 2 || item.dataIndex !== 'menuUrl') // 按钮过滤菜单路径
          // .filter((item) => count >= 2 || item.dataIndex !== 'authority') // 二级菜单过滤权限标识
        }
        expandable={{
          expandedRowRender: (r, i) => expandedRowRender(r, i, count),
          rowExpandable: (record) => (record.subMenus?.length ?? 0) > 0,
        }}
        dataSource={record.subMenus?.map((item) => ({ ...item, key: item.id }))}
        headerTitle={false}
        showHeader={false}
        search={false}
        options={false}
        pagination={false}
      />
    );
  };

  return (
    <ProTable<IAuthoritiesListItem>
      {...restProps}
      scroll={{ x: 800 }}
      actionRef={ref}
      search={false}
      columns={columns}
      expandable={
        hideAction
          ? undefined
          : { expandedRowRender: (record, index) => expandedRowRender(record, index) }
      }
      toolBarRender={() => [renderCreat()]}
      request={
        hideAction
          ? (params) => TreeTableArrRequest(params, getAuthoritiesList)
          : (params) => TableArrRequest(params, getAuthoritiesList)
      }
      onLoad={(dataSource) => setMenuData(dataSource)}
    />
  );
};
