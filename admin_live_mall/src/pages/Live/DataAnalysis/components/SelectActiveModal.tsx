import { Modal } from 'antd';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { TableRequest } from '@/pages/utils/tableRequest';
import { useEffect, useState } from 'react';
import { IProduct } from '@/api/type';
import { getPage as pageLuckBag, getPage as getSignIn } from '@/pages/Marketing/LuckyBag/service';

interface IProps {
  onOk: (selectRows: IProduct[]) => void;
  onCancel: () => void;
  open: boolean;
  selectRows: IProduct[];
  type: 'DIRECT_GET' | 'SIGN';
}

export default function SelectProductModal(props: IProps) {
  const { open, onCancel, onOk, selectRows, type } = props;

  const [tempSelectRows, setTempSelectRows] = useState<IProduct[]>([]);

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
      title: '活动id',
      dataIndex: 'id',
    },
    {
      title: '活动名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      search: false,
      ellipsis: true,
      valueEnum: {
        true: '已绑定',
        false: '未绑定',
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 160,
      search: false,
      ellipsis: true,
      align: 'center',
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
          selectedRowKeys: tempSelectRows.map((item) => item.id),
          onChange: (selectRowKeys, selectRows) => {
            setTempSelectRows(selectRows);
          },
        }}
        request={(params) => {
          return TableRequest({ ...params }, type === 'DIRECT_GET' ? pageLuckBag : getSignIn);
        }}
      ></ProTable>
    </Modal>
  );
}
