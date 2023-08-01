import { Modal } from 'antd';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { TableRequest } from '@/pages/utils/tableRequest';
import { getProductList } from '@/api/product';
import { useEffect, useState } from 'react';
import { IProduct } from '@/api/type';

interface IProps {
  onOk: (selectRows: IProduct[]) => void;
  onCancel: () => void;
  open: boolean;
  selectRows: IProduct[];
  type?: 'radio' | 'checkbox';
  params?: Record<string, string | number>;
}

export default function SelectProductModal(props: IProps) {
  const { open, onCancel, onOk, selectRows, type = 'radio', params = {} } = props;

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
      title: '商品图片',
      dataIndex: 'mainPic',
      renderText: (node, record) => record.mainPic[0],
      valueType: 'image',
      width: 100,
      search: false,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '价格',
      dataIndex: 'salePrice',
      valueType: 'money',
      width: 120,
      search: false,
    },
    // {
    //   title: '上架时间',
    //   dataIndex: 'createTime',
    //   width: 120,
    //   search: false,
    // },
  ];

  return (
    <Modal destroyOnClose width={'80%'} open={open} onCancel={onCancel} onOk={submit}>
      <ProTable
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        columns={columns}
        rowKey={'id'}
        scroll={{ y: 300 }}
        form={{ span: 6, collapsed: false }}
        params={params}
        rowSelection={{
          type: type,
          selectedRowKeys: tempSelectRows.map((item) => item.id),
          onChange: (selectRowKeys, selectRows) => {
            setTempSelectRows(selectRows);
          },
        }}
        request={(params) => {
          return TableRequest({ ...params }, getProductList);
        }}
      ></ProTable>
    </Modal>
  );
}
