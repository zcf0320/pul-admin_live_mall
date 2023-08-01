import { ProTable, ProColumns } from '@ant-design/pro-components';
import { IProduct } from '@/api/type';
import { useState } from 'react';
import { Button } from 'antd';

interface IProps {
  selectRows: IProduct[];
  removeOne: (productId: string) => void;
  removeMultiple?: (productIds: string[]) => void;
}

export default function SelectedProductTable(props: IProps) {
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
      ellipsis: true,
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
