import { ActionType, ProTable } from '@ant-design/pro-components';
import { editStatus, getSubPage, remove } from '../service';
import { useEffect, useRef } from 'react';
import { TableListItem } from '../data';
import { message, Modal } from 'antd';

interface IProps {
  record: TableListItem;
  reloadCount: number;
  editCategory: (record: TableListItem) => void;
}

export default function SubTable(props: IProps) {
  const { record, reloadCount, editCategory } = props;
  const actionRef = useRef<ActionType>();

  const reloadTable = () => {
    actionRef.current?.reload();
  };

  useEffect(() => {
    reloadTable();
  }, [reloadCount]);

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

  //编辑
  const alterLabel = (record: any) => (
    <a
      key="alter"
      onClick={() => {
        editCategory(record);
        // setModalVisit(true);
        // console.log(record);
        // setIsEdit(record);
      }}
    >
      编辑
    </a>
  );

  return (
    <ProTable
      actionRef={actionRef}
      columns={[
        {
          title: '分类名称',
          // width: 230,
          dataIndex: 'name',
          ellipsis: true,
        },
        {
          title: '分类图标',
          // width: 230,
          dataIndex: 'icon',
          valueType: 'image',
          // dataIndex: 'name',
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'status',
          search: false,
          ellipsis: true,
          valueEnum: {
            0: '未启用',
            1: '已启用',
          },
        },
        { title: '商品数量', dataIndex: 'productCount' },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          valueType: 'option',
          render: (text, subRecord: any) => [
            alterLabel(subRecord),
            enableAndDisableCategory(subRecord),
            deleteLabel(subRecord),
          ],
        },
      ]}
      params={{
        parentId: record.id,
      }}
      headerTitle={false}
      search={false}
      options={false}
      // dataSource={data}
      request={async (params) => {
        const result = (await getSubPage({ parentId: params.parentId + '', showHidden: true }))
          .data;
        return {
          success: true,
          data: result,
        };
      }}
      pagination={false}
    />
  );
}
