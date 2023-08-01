import { Modal, TablePaginationConfig, message } from 'antd';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { getProductList } from '@/api/product';
import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { importProduct } from '../service';

export interface IProps {
  open: boolean;
  onCancel: () => void;
  liveRoomId: string;
  onOk: () => void;
}

export default function ImportProduct(props: IProps) {
  const { open, onCancel, liveRoomId, onOk } = props;

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const [selectedRowKeys, setSelectRowKeys] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<any[]>();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    pageSize: 10,
    current: 1,
    total: 0,
  });

  const loadData = (params?: any) => {
    setSelectRowKeys([]);
    setEditableRowKeys([]);
    setLoading(true);
    getProductList({
      pageSize: pagination.pageSize!,
      pageNo: pagination.current!,
      ...params,
    })
      .then((res) => {
        setDataSource(res.data.records);
        setPagination((item) => ({ ...item, total: res.data.total }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const search = (params: any) => {
    setPagination((item) => ({ ...item, current: 1 }));
    loadData(params);
  };
  const resetTable = () => {
    setPagination((item) => ({ ...item, current: 1 }));
    loadData();
  };

  const renderAction = (record: any) => {
    const isEdit = editableKeys.includes(record.id);
    return (
      <a
        onClick={() => {
          if (isEdit) {
            setEditableRowKeys([]);
          } else {
            setEditableRowKeys([record.id]);
          }
        }}
      >
        {isEdit ? '取消编辑' : '编辑库存'}
      </a>
    );
  };

  const columns: ProColumns<any>[] = [
    {
      title: '商品id',
      dataIndex: 'id',
      editable: () => false,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      editable: () => false,
    },
    {
      title: '商品图片',
      dataIndex: 'mainPic',
      renderText: (node, record) => record.mainPic[0],
      valueType: 'image',
      width: 80,
      search: false,
      editable: () => false,
    },
    {
      title: '商品价格',
      dataIndex: 'salePrice',
      valueType: 'money',
      width: 100,
      search: false,
      editable: () => false,
    },
    {
      title: '商品库存',
      dataIndex: 'stockCount',
      width: 100,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 80,
      search: false,
      editable: () => false,
      ellipsis: true,
      render(col, item) {
        return <span>{item.status === 0 ? '下架中' : '上架中'}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      editable: () => false,
      render: (node, record) => {
        return [renderAction(record)];
      },
    },
  ];

  const findSelectData = () => {
    return dataSource?.filter((item) => selectedRowKeys.includes(item.id)) ?? [];
  };

  const modalOk = () => {
    importProduct({
      id: liveRoomId,
      goods: findSelectData().map((item) => ({
        id: item.id,
        mainPic: item.mainPic,
        name: item.name,
        price: item.salePrice,
        stockCount: item.stockCount,
      })),
    }).then(() => {
      setSelectRowKeys([]);
      message.success('导入成功');
      onOk();
    });
  };

  return (
    <Modal
      destroyOnClose
      width={1000}
      title="导入商品"
      open={open}
      onCancel={onCancel}
      onOk={modalOk}
    >
      <ProTable
        columns={columns}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange(selectedRowKeys) {
            setSelectRowKeys(selectedRowKeys as string[]);
          },
        }}
        editable={{
          type: 'single',
          editableKeys,
          onChange: (editableKeys: React.Key[], editableRows: any) => {
            console.log('editableKeys', editableKeys, editableRows);
          },
          onValuesChange(record) {
            setDataSource((dataSource) => {
              const result = cloneDeep(dataSource);
              result?.forEach((item) => {
                if (item.id === record.id) {
                  item.stockCount = record.stockCount;
                }
              });
              return result;
            });
          },
        }}
        onSubmit={search}
        onReset={resetTable}
        rowKey={'id'}
        pagination={{
          pageSize: pagination.pageSize,
          current: pagination.current,
          total: pagination.total,
          onChange(page, pageSize) {
            setPagination((item) => ({ ...item, current: page, pageSize: pageSize }));
            loadData();
          },
        }}
        loading={loading}
        dataSource={dataSource}
        // request={(params) => {
        //   return TableRequest({ ...params }, getProductList);
        // }}
      />
    </Modal>
  );
}
