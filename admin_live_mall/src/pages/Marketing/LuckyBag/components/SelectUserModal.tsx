import { Modal } from 'antd';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { TableRequest } from '@/pages/utils/tableRequest';
import { useEffect, useState } from 'react';
import { ITotalCustomerTabCom } from '@/pages/Customer/TotalCustomer/data';
import { getClients } from '@/pages/Customer/TotalCustomer/services';

interface IProps {
  onOk: (selectRows: ITotalCustomerTabCom[]) => void;
  onCancel: () => void;
  open: boolean;
  selectRows: ITotalCustomerTabCom[];
  type?: 'radio' | 'checkbox';
}

export default function SelectUserModal(props: IProps) {
  const { open, onCancel, onOk, selectRows, type = 'radio' } = props;

  const [tempSelectRows, setTempSelectRows] = useState<ITotalCustomerTabCom[]>([]);

  useEffect(() => {
    if (open && selectRows) {
      setTempSelectRows(selectRows);
    }
  }, [open, selectRows]);

  const submit = () => {
    onOk(tempSelectRows);
  };

  const columns: ProColumns<any>[] = [
    {
      title: '用户头像',
      dataIndex: 'headImage',
      valueType: 'image',
      width: 100,
      search: false,
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      // width: 120,
      // search: false,
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      // width: 120,
      search: false,
    },
  ];

  return (
    <Modal destroyOnClose width={'80%'} open={open} onCancel={onCancel} onOk={submit}>
      <ProTable
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        columns={columns}
        rowKey={'id'}
        scroll={{ y: 300 }}
        form={{ span: 6, collapsed: false }}
        rowSelection={{
          type: type,
          selectedRowKeys: tempSelectRows.map((item) => item.id),
          onChange: (selectRowKeys, selectRows) => {
            setTempSelectRows(selectRows);
          },
        }}
        request={(params) => {
          return TableRequest({ ...params }, getClients);
        }}
      ></ProTable>
    </Modal>
  );
}
