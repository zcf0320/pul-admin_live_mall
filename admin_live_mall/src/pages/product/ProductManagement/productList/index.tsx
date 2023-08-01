import { useEffect, useRef, useState } from 'react';
import { IPalletProduct } from '@/api/type';
import { history } from '@umijs/max';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components';
import { Button, Cascader, Image, message, Modal, Popconfirm, Tag } from 'antd';
import { TableRequest } from '@/pages/utils/tableRequest';
import { getProductList, postDeleteProduct, postUpOrDownProduct } from '@/api/product';
import { getSubPage } from '../Category/service';
import { CopyOutlined } from '@ant-design/icons';
import { copyToClipboard } from '@/pages/utils';

// interface IOptions {
//   value: number;
//   label: string;
//   isLeaf: boolean;
//   selectable: boolean;
//   children: [] | IOptions[];
//   pid: string;
// }

export default function ProductList() {
  const tableActionRef = useRef<ActionType>(null);
  useEffect(() => {}, []);

  const [treeData, setTreeData] = useState<any>([]);
  const [activeKey, setActiveKey] = useState('');

  const statusTabItems = [
    {
      label: '全部',
      key: '',
    },
    {
      label: '私域',
      key: '1',
    },
    {
      label: '直播',
      key: '2',
    },
  ];

  //获取固定格式子分类列的方法
  const getCategoryAsync = async (parentId: string) => {
    const res = await getSubPage({ parentId });
    return res.data
      .filter((item) => !item.isBottom || item.level !== 1)
      .map((v: any) => {
        return {
          key: v.id,
          title: v.name,
          isLeaf: v.isBottom,
          disabled: parentId === '0' && v.isBottom,
        };
      });
  };

  useEffect(() => {
    // getBrandList({ pageNo: 1, pageSize: 10000 }).then((res) => {
    //   setBrandList(res.data.records);
    getCategoryAsync('0').then((res) => {
      setTreeData(res);
    });
  }, []);

  const loadMore = async (selectedOptions: any[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const children = await getCategoryAsync(targetOption.key);
    targetOption.children = children;
    setTreeData([...treeData]);
  };

  const refresh = () => {
    tableActionRef.current?.reload();
  };
  const renderDetail = (record: IPalletProduct) => {
    return (
      <a
        key="detail"
        onClick={() => {
          history.push('/product/productDetail?id=' + record.id);
        }}
      >
        详情
      </a>
    );
  };
  const renderEdit = (record: IPalletProduct) => {
    return (
      <a
        key="edit"
        onClick={() => {
          history.push('/product/addProduct?id=' + record.id);
        }}
      >
        编辑
      </a>
    );
  };

  const renderCopy = (record: IPalletProduct) => {
    return (
      <a
        onClick={() => {
          history.push('/product/addProduct?id=' + record.id + '&type=copy');
        }}
      >
        复制
      </a>
    );
  };

  const renderDelete = (record: IPalletProduct) => {
    return (
      <a
        onClick={() => {
          const deleteModal = Modal.confirm({
            title: (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>是否删除该商品</span>
              </div>
            ),
            onOk: () => {
              postDeleteProduct({ id: record.id }).then(() => {
                message.success('删除成功');
                // refresh();
                deleteModal.destroy();
                refresh();
              });
            },
          });
        }}
      >
        删除
      </a>
    );
  };
  const renderUpAndDown = (record: IPalletProduct) => {
    const currentDown = !record.status; // 当前是否是下架状态
    return (
      <Popconfirm
        title={`是否${currentDown ? '上架' : '下架'}该商品`}
        onConfirm={() => {
          postUpOrDownProduct({
            id: record.id,
            status: currentDown ? 1 : 0,
          }).then(() => {
            message.success(`${currentDown ? '上架' : '下架'}成功`);
            refresh();
          });
        }}
      >
        <a>{currentDown ? '上架' : '下架'}</a>
      </Popconfirm>
    );
  };

  const columns: ProColumns[] = [
    {
      title: '商品标题',
      dataIndex: 'name',
      hideInTable: true,
    },
    {
      title: '商品信息',
      dataIndex: 'name',
      search: false,
      width: 320,
      render: (node, record) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <Image width={80} src={record.mainPic[0]} />
            </div>
            <div style={{ marginLeft: 10 }}>
              {/* <div>
                ID: {record.id}
                <CopyOutlined
                  style={{ color: '#16adff' }}
                  onClick={() => {
                    copyToClipboard(record.id).then(() => {
                      message.success('复制成功');
                    });
                  }}
                />
              </div> */}
              <div>商品名称: {record.name}</div>
              <div>商品卖点: {record.subName}</div>
              <div>商品分类: {record.category1Name + '/' + record.category2Name}</div>
              <div>
                商品标签:
                {record.labelNames?.map((item: any) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'ID信息',
      dataIndex: 'id',
      align: 'center',
      width: 260,
      render: (node, record) => {
        return (
          <div>
            <div>
              商品ID: {record.id}
              <CopyOutlined
                style={{ color: '#16adff' }}
                onClick={() => {
                  copyToClipboard(record.id).then(() => {
                    message.success('复制成功');
                  });
                }}
              />
            </div>
            <div>
              商品编码: {record.goodsCode}
              <CopyOutlined
                style={{ color: '#16adff' }}
                onClick={() => {
                  copyToClipboard(record.goodsCode).then(() => {
                    message.success('复制成功');
                  });
                }}
              />
            </div>
          </div>
        );
      },
    },
    // {
    //   title: '商品名称',
    //   dataIndex: 'name',
    //   align: 'center',
    //   width: 100,
    //   ellipsis: true,
    // },
    // {
    //   title: '主图',
    //   dataIndex: 'mainPic',
    //   align: 'center',
    //   valueType: 'image',
    //   search: false,
    //   width: 100,
    //   ellipsis: true,
    // },
    {
      title: '分类',
      dataIndex: 'category2',
      align: 'center',
      search: {
        transform: (value) => ({
          category1: value[0],
          category2: value[1],
        }),
      },
      renderFormItem() {
        return (
          <Cascader
            options={treeData}
            placeholder="请选择..."
            allowClear
            fieldNames={{
              label: 'title',
              value: 'key',
            }}
            loadData={loadMore}
          />
        );
      },
      hideInTable: true,
    },
    // {
    //   title: '分类',
    //   dataIndex: 'category1Name',
    //   align: 'center',
    //   width: 100,
    //   search: false,
    //   ellipsis: true,
    //   renderText: (text, record) => {
    //     return record.category1Name + '/' + record.category2Name;
    //   },
    //   // search: {
    //   //   transform: (value) => {
    //   //     return {
    //   //       category1: value,
    //   //     };
    //   //   },
    //   // },
    //   // renderFormItem() {
    //   //   return <Select allowClear placeholder="请选择分类" options={categoryOptions} />;
    //   // },
    // },

    {
      title: '价格信息',
      search: false,
      dataIndex: 'salePrice',
      width: 120,
      align: 'center',
      render: (node, record) => {
        return (
          <div>
            <div>销售价: ¥{record.salePrice}</div>
            <div>划线价: ¥{record.marketPrice}</div>
            <div>成本价: ¥{record.costPrice}</div>
          </div>
        );
      },
    },

    // {
    //   title: '销售价',
    //   dataIndex: 'salePrice',
    //   align: 'center',
    //   width: 120,
    //   search: false,
    //   ellipsis: true,
    //   render: (text, item) => {
    //     return <span>¥{item.salePrice}</span>;
    //   },
    // },
    // {
    //   title: '划线价',
    //   dataIndex: 'marketPrice',
    //   align: 'center',
    //   width: 120,
    //   search: false,
    //   ellipsis: true,
    //   render: (text, item) => {
    //     return <span>¥{item.salePrice}</span>;
    //   },
    // },
    // {
    //   title: '是否推荐',
    //   dataIndex: 'isRecommend',
    //   align: 'center',
    //   width: 120,
    //   search: false,
    //   ellipsis: true,
    //   render(col, item) {
    //     return <span>{item.isRecommend ? '是' : '否'}</span>;
    //   },
    // },
    // {
    //   title: '是否虚拟商品',
    //   dataIndex: 'isVirtual',
    //   align: 'center',
    //   width: 120,
    //   search: false,
    //   ellipsis: true,
    //   render(col, item) {
    //     return <span>{item.isVirtual ? '是' : '否'}</span>;
    //   },
    // },
    {
      title: '库存',
      dataIndex: 'stockCount',
      align: 'center',
      width: 120,
      search: false,
      ellipsis: true,
    },
    {
      title: '今日销量',
      dataIndex: 'todaySales',
      align: 'center',
      width: 120,
      search: false,
      ellipsis: true,
    },
    {
      title: '总销量',
      dataIndex: 'sumGmv',
      align: 'center',
      width: 120,
      renderText: (text, record) => record.initialGmv + record.factGmv,
      search: false,
      ellipsis: true,
    },
    {
      title: '创建/修改',
      dataIndex: 'createTime',
      align: 'center',
      width: 240,
      search: false,
      render: (node, record) => {
        return (
          <div>
            <div>创建时间: {record.createTime}</div>
            <div>修改时间: {record.modifyTime}</div>
          </div>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 80,
      search: false,
      ellipsis: true,
      render(col, item) {
        return <span>{item.status === 0 ? '下架中' : '上架中'}</span>;
      },
    },
    {
      width: 140,
      align: 'center',
      title: '操作',
      search: false,
      valueType: 'option',
      fixed: 'right',
      render: (col, item) => [
        renderDetail(item),
        renderEdit(item),
        renderUpAndDown(item),
        <TableDropdown
          menus={[
            {
              key: 'renderCopy',
              name: renderCopy(item),
            },
            {
              key: 'renderDelete',
              name: renderDelete(item),
            },
          ]}
          key={'dropdown'}
        />,
      ],
    },
  ];

  const renderToolbar = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginTop: '20px',
      }}
    >
      <Button
        onClick={() => {
          history.push('/product/addProduct');
        }}
        type="primary"
      >
        添加商品
      </Button>
    </div>
  );

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable
        actionRef={tableActionRef}
        rowKey={'id'}
        toolBarRender={() => [renderToolbar]}
        form={{ span: 6, collapsed: false }}
        style={{ marginTop: '20px' }}
        scroll={{ x: 1000 }}
        columns={columns}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey: activeKey,
            items: statusTabItems,
            onChange: (key) => {
              setActiveKey(key as string);
            },
          },
        }}
        params={{ type: activeKey }}
        request={(params) => {
          // if (params.category1) {
          //   params.category2 = params.category1[1];
          //   params.category3 = params.category1[2];
          //   params.category1 = params.category1[0];
          // }
          return TableRequest({ ...params }, getProductList);
        }}
        // data={productList}
        // rowSelection={
        //   id
        //     ? {
        //         // checkAll: true,
        //         // checkCrossPage: true,
        //         type: 'checkbox',
        //         onChange(selectedRowKeys) {
        //           setSelectIds(selectedRowKeys as string[]);
        //         },
        //       }
        //     : undefined
        // }
      />
    </PageContainer>
  );
}
