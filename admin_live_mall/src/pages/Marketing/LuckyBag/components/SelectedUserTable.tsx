import { ProColumns, ProTable } from '@ant-design/pro-components';
import { IProduct } from '@/api/type';
import { useState } from 'react';
import { Button } from 'antd';
import { ITotalCustomerTabCom } from '@/pages/Customer/TotalCustomer/data';

interface IProps {
  selectRows: ITotalCustomerTabCom[];
  removeOne: (productId: string) => void;
  removeMultiple?: (productIds: string[]) => void;
}

export default function SelectedUserTable(props: IProps) {
  const { selectRows, removeOne, removeMultiple } = props;

  const [selectRowKeys, setSelectRowKeys] = useState<string[]>([]);

  const renderRemove = (record: IProduct) => {
    return (
      <Button
        type="link"
        onClick={() => {
          removeOne(record.id);
        }}
      >
        撤出
      </Button>
    );
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
      search: false,
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      // width: 120,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      render: (node, record) => {
        return [renderRemove(record)];
      },
    },
  ];

  return (
    <div>
      <ProTable
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        columns={columns}
        rowKey={'id'}
        search={false}
        rowSelection={{
          selectedRowKeys: selectRowKeys,
          onChange: (selectRowKeys) => {
            setSelectRowKeys(selectRowKeys as string[]);
          },
        }}
        dataSource={selectRows}
        // request={(params) => {
        //   return TableRequest({ ...params }, getProductList);
        // }}
      ></ProTable>
      {removeMultiple ? (
        <div>
          参与商品最多可选择1000个sku 已选 ({selectRowKeys.length}/1000)
          <Button
            onClick={() => {
              removeMultiple(selectRowKeys);
              setSelectRowKeys([]);
            }}
            type="link"
          >
            批量撤出
          </Button>
        </div>
      ) : null}
    </div>
  );
}
