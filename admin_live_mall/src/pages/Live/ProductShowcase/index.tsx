import { Button, Card, message, Modal, Spin } from 'antd';
import { fetchDetail } from '../LiveList/service';
import { useEffect, useRef, useState } from 'react';
import { TableListItem as LiveListItem } from '../LiveList/data';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import queryString from 'query-string';
import ImportProduct from './components/ImportProduct';
import { TableRequest } from '@/pages/utils/tableRequest';
import { getPage, postCancelExplain, postDelete, postExplain } from './service';
import { TableListItem } from './data';

export default function ProductShowcase() {
  const [loading, setLoading] = useState(true);

  const params = queryString.parse(location.search);

  const [showcaseRecord, setShowcaseRecord] = useState<LiveListItem>();

  const [importModalOpen, setImportModalOpen] = useState(false);

  const actionRef = useRef<ActionType>();

  const loadData = () => {
    fetchDetail({
      id: params.id,
    })
      .then((res) => {
        setShowcaseRecord(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const reloadTable = () => {
    actionRef.current?.reload();
  };

  const renderExplain = (record: TableListItem) => {
    const isExplain = record.status === '讲解中';
    return (
      <a
        onClick={() => {
          const params = {
            goodsId: record.productId,
            liveRoomId: showcaseRecord?.id,
          };
          if (!isExplain) {
            postExplain(params).then(() => {
              message.success('开始讲解');
              reloadTable();
            });
          } else {
            postCancelExplain(params).then(() => {
              message.success('取消讲解成功');
              reloadTable();
            });
          }
        }}
      >
        {isExplain ? '取消讲解' : '讲解'}
      </a>
    );
  };

  const renderDelete = (record: TableListItem) => {
    const isExplain = record.status === '讲解中';
    return (
      <a
        onClick={() => {
          Modal.confirm({
            title: '删除',
            content: !isExplain
              ? `是否删除：${record.goodsName}`
              : '该商品在讲解中，删除商品后将从直播间下架',
            onOk: async () => {
              await postDelete({ id: record.id });
              message.success('删除成功');
              reloadTable();
            },
          });
        }}
      >
        删除
      </a>
    );
  };

  const columns: ProColumns<any>[] = [
    {
      title: '商品id',
      dataIndex: 'productId',
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
    },
    {
      title: '商品状态',
      dataIndex: 'status',
    },
    {
      title: '点击人数',
      dataIndex: 'click',
    },
    {
      title: '商品价格',
      dataIndex: 'price',
      valueType: 'money',
    },
    {
      title: '直播库存',
      dataIndex: 'stock',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (node, record) => [renderExplain(record), renderDelete(record)],
    },
  ];

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card>
        {!loading && showcaseRecord ? (
          <div>
            <div style={{ display: 'flex' }}>
              <img
                style={{ width: 200, height: 150, objectFit: 'contain' }}
                src={showcaseRecord.cover}
              />
              <div style={{ marginLeft: 20 }}>
                <div style={{ fontSize: 16 }}>{showcaseRecord.name}</div>
                <div style={{ marginTop: 10 }}>
                  开播时间：{showcaseRecord.startTime}/{showcaseRecord.endTime}
                </div>
                <div style={{ marginTop: 10, display: 'flex' }}>
                  <span>主播：{showcaseRecord.playerNickname}</span>
                  <span style={{ marginLeft: 10 }}>微信号：{showcaseRecord.playerAccount}</span>
                  <span style={{ marginLeft: 10 }}>状态：{showcaseRecord.liveStatus}</span>
                </div>
              </div>
            </div>
            {/* <div style={{ marginTop: 10 }}>
              <Button type="primary">导入商品</Button>
            </div> */}
            <div>
              <ProTable
                actionRef={actionRef}
                search={false}
                columns={columns}
                toolBarRender={() => {
                  return [
                    <Button
                      onClick={() => {
                        setImportModalOpen(true);
                      }}
                      key="button"
                      type="primary"
                    >
                      导入商品
                    </Button>,
                  ];
                }}
                params={{ id: params.id! }}
                request={(params) => TableRequest(params, getPage)}
              ></ProTable>
            </div>
          </div>
        ) : (
          <Spin />
        )}
      </Card>
      <ImportProduct
        onOk={() => {
          setImportModalOpen(false);
          actionRef.current?.reload();
        }}
        open={importModalOpen}
        onCancel={() => {
          setImportModalOpen(false);
        }}
        liveRoomId={params.id as string}
      />
    </PageContainer>
  );
}
