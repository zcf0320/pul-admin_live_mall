import { Button, Image, message, Modal } from 'antd';
import { useRef, useState } from 'react';

import { TableRequest } from '@/pages/utils/tableRequest';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import type { TableListItem } from './data';
import { add, deleteAnchor, getPage } from './service';
import SelectUserModal from '../../Marketing/LuckyBag/components/SelectUserModal';
import { ITotalCustomerTabCom } from '@/pages/Customer/TotalCustomer/data';

export default function LiveList() {
  const ref = useRef<ActionType>();

  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const [selectUserModalOpen, setSelectUserModalOpen] = useState(false);
  const [selectUser, setSelectUser] = useState<ITotalCustomerTabCom[]>([]);

  const reloadTable = () => {
    ref.current?.reload();
  };

  const renderDelete = (record: TableListItem) => {
    return (
      <a
        onClick={() => {
          console.log('record', record);
          Modal.confirm({
            title: '清退',
            content: `是否清退：${record.userName}`,
            onOk: () => {
              deleteAnchor({
                id: record.id,
              }).then(() => {
                message.success('清退成功');
                reloadTable();
              });
            },
          });
        }}
      >
        清退
      </a>
    );
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '主播ID',
      dataIndex: 'id',
      // width: 200,

      ellipsis: true,
      align: 'center',
    },
    {
      title: '主播信息',
      dataIndex: 'type',
      // width: 90,
      render: (node, record) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <Image width={40} height={40} src={record.headImage} />
            </div>
            <div style={{ marginLeft: 10 }}>
              <div>{record.userName}</div>
              <div>{record.phone}</div>
            </div>
          </div>
        );
      },
    },
    // {
    //   title: '手机号',
    //   dataIndex: 'cover',
    //   width: 90,
    //   search: false,
    //   ellipsis: true,
    //   align: 'center',
    //   valueType: 'image',
    // },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      align: 'center',
      valueType: 'option',
      render: (_, record: TableListItem) => [renderDelete(record)],
    },
  ];

  const renderAdd = () => {
    return (
      <Button
        type="primary"
        onClick={() => {
          setSelectUserModalOpen(true);
        }}
      >
        添加主播
      </Button>
    );
  };

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        toolBarRender={() => [renderAdd()]}
        scroll={{ x: 1000 }}
        search={false}
        request={(params) => TableRequest(params, getPage)}
      />
      <Modal
        footer={null}
        open={addressModalOpen}
        onCancel={() => {
          setAddressModalOpen(false);
        }}
      ></Modal>
      {/* <ModalForm
        modalProps={{ destroyOnClose: true }}
        onOpenChange={setEditModalOpen}
        open={editModalOpen}
        onFinish={async (values) => {}}
        title="新增主播"
      ></ModalForm> */}
      <SelectUserModal
        selectRows={selectUser}
        type="radio"
        open={selectUserModalOpen}
        onCancel={() => {
          setSelectUserModalOpen(false);
        }}
        onOk={async (selectRows) => {
          // setSelectUser(selectRows);
          await add({
            userId: selectRows[0].id,
          });
          message.success('添加成功');
          setSelectUserModalOpen(false);
          reloadTable();
          console.log('selectRows', selectRows);

          // setSelectUserModalOpen(false);
        }}
      ></SelectUserModal>
    </PageContainer>
  );
}
