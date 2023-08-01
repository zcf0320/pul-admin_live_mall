import type { ActionType, ProColumns, ProTableProps } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';

import { getPermsTree } from '@/api/system';
import type {
  IAddAuthoritiesParams,
  IAuthoritiesListItem,
} from '@/pages/Setting/subAccount/authorities/data';
import {
  TableArrRequest,
  TreeTableArrRequest,
} from '@/pages/Setting/subAccount/authorities/utils/utils';
import { Tag } from 'antd';

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

  const columns: ProColumns<IAuthoritiesListItem>[] = [
    {
      title: '权限名称',
      width: 200,
      dataIndex: 'menuName',
      search: false,
    },
    {
      title: '菜单路径',
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
      title: '权限类型',
      width: 150,
      align: 'center',
      dataIndex: 'menuType',
      search: false,
      render: (_, record) => (
        <Tag color={menuTypeMap[record.menuType as 0 | 1].color}>
          {menuTypeMap[record.menuType as 0 | 1].text}
        </Tag>
      ),
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
            .filter((item) => count < 2 || item.dataIndex !== 'menuUrl') // 按钮过滤菜单路径
            .filter((item) => count >= 2 || item.dataIndex !== 'authority') // 二级菜单过滤权限标识
        }
        expandable={
          count < 2
            ? {
                expandedRowRender: (r, i) => expandedRowRender(r, i, count),
              }
            : {}
        }
        dataSource={record.subMenus.map((item) => ({ ...item, key: item.id }))}
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
      columns={columns.filter((item) => item.dataIndex !== 'authority')}
      expandable={
        hideAction ? {} : { expandedRowRender: (record, index) => expandedRowRender(record, index) }
      }
      request={
        hideAction
          ? (params) => TreeTableArrRequest(params, getPermsTree)
          : (params) => TableArrRequest(params, getPermsTree)
      }
    />
  );
};
