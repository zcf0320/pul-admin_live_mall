import { useRef, useState } from 'react';

import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Form, Input, message, Modal, Tooltip } from 'antd';
import type { TableListItem } from './data';
import { TableRequest } from '@/pages/utils/tableRequest';
import {
  getPage,
  postAgreeRefund,
  postAgreeReturnGoods,
  postConfirmReceive,
  postDisAgreeRefundOrReturnGoods,
} from './service';

export enum OrderStatus {
  'CLOSE' = 'CLOSE',
  'WAIT_PAY' = 'WAIT_PAY',
  'TO_SHIP' = 'TO_SHIP',
  'TO_RECEIVE' = 'TO_RECEIVE',
  'FINISH' = 'FINISH',
}

export const orderStatusObject: { [key: string]: string } = {
  CLOSE: '已关闭',
  WAIT_PAY: '待付款',
  TO_SHIP: '待发货',
  TO_RECEIVE: '待收货',
  FINISH: '已完成',
};

export default function PageSpecification() {
  const ref = useRef<ActionType>();
  const [currentItem, setCurrentItem] = useState<TableListItem>();
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [activeKey, setActiveKey] = useState('1');

  const reloadTable = () => {
    ref.current?.reload();
  };

  const renderDetail = (item: TableListItem) => {
    return (
      <a
        onClick={() => {
          setCurrentItem(item);
          setDetailModalOpen(true);
        }}
      >
        详情
      </a>
    );
  };

  const renderAgreeRefund = (item: TableListItem) => {
    if (![1, 2].includes(item.afterSaleType) || item.afterSaleStatus !== 1) return;
    return (
      <a
        onClick={() => {
          Modal.confirm({
            title: '同意退款',
            content: '确定同意退款吗？',
            onOk: () => {
              postAgreeRefund({
                orderId: item.orderId,
              }).then(() => {
                message.success('同意退款成功');
                reloadTable();
              });
            },
          });
        }}
      >
        同意退款
      </a>
    );
  };

  const [refundReason, setRefundReason] = useState('');
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  const renderDisAgreeRefund = (item: TableListItem) => {
    if (![2].includes(item.afterSaleType) || item.afterSaleStatus !== 1) return;
    return (
      <a
        style={{ color: 'red' }}
        onClick={() => {
          setRefundModalOpen(true);
          setCurrentItem(item);
        }}
      >
        拒绝退款
      </a>
    );
  };

  const renderReturnGoods = (item: TableListItem) => {
    if (![3, 4].includes(item.afterSaleType) || item.afterSaleStatus !== 1) return;
    return (
      <a
        onClick={() => {
          Modal.confirm({
            title: '同意退货',
            content: '确定同意退货吗？',
            onOk: () => {
              // TODO
              postAgreeReturnGoods({
                orderId: item.orderId,
              }).then(() => {
                message.success('同意退货成功');
                reloadTable();
              });
            },
          });
        }}
      >
        同意退货
      </a>
    );
  };

  const renderSeeReturnGoods = (item: TableListItem) => {
    if ([5].includes(item.afterSaleType) && item.afterSaleStatus === 2)
      return (
        <a
          onClick={() => {
            Modal.confirm({
              title: '同意退货',
              okText: '确认收货',
              content: '物流单号：' + item.logisticsNo,
              onOk: () => {
                // TODO
                postConfirmReceive({
                  orderId: item.orderId,
                }).then(() => {
                  message.success('确认收货成功');
                  reloadTable();
                });
              },
            });
          }}
        >
          确认物流
        </a>
      );
    return null;
  };

  const renderDisReturnGoods = (item: TableListItem) => {
    if (![4].includes(item.afterSaleType) || item.afterSaleStatus !== 1) return;
    return (
      <a
        style={{ color: 'red' }}
        onClick={() => {
          Modal.confirm({
            title: '拒绝退货',
            content: '确定拒绝退货吗？',
            onOk: () => {
              // TODO
              postDisAgreeRefundOrReturnGoods({
                orderId: item.orderId,
              }).then(() => {
                message.success('拒绝退货');
                reloadTable();
              });
            },
          });
        }}
      >
        拒绝退货
      </a>
    );
  };

  //常量列表
  const columns: ProColumns<TableListItem>[] = [
    // { title: '商品名称', dataIndex: 'id', hideInTable: true },
    { title: '订单编号', dataIndex: 'orderNo' },
    {
      title: '申请时间',
      dataIndex: 'applyStartTime',
      // search: false,
      valueType: 'dateTimeRange',
      colSize: 2,
      search: {
        transform: (value) => ({
          applyStartTime: value[0],
          applyEndTime: value[1],
        }),
      },
      render: (_, record) => {
        return (
          <Tooltip title={record.applyStartTime}>
            <span>{record.applyStartTime}</span>
          </Tooltip>
        );
      },
      ellipsis: true,
    },
    {
      title: '商品数量',
      dataIndex: 'productNum',
      ellipsis: true,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '售后类型',
      dataIndex: 'afterSaleType',
      ellipsis: true,
      align: 'center',
      valueEnum: {
        1: '待发货退款',
        2: '已发货退款',
        3: '退货退款',
        4: '退货待买家发货',
        5: '退货待商家退货',
        6: '商家已收货，退款中',
        7: '退款中',
        8: '退款成功',
        9: '拒绝退款',
      },
    },
    // {
    //   title: '售后状态',
    //   dataIndex: 'afterSaleStatus',
    //   ellipsis: true,
    //   align: 'center',
    //   // 1.商家已同意退货申请,待买家退货 2.申请退款待商家处理 3.商家拒绝退款,待买家处理 4.商家拒绝退货退款,待买家处理 5.平台介入,售后处理中 6.买家已退货,待商家确认收获 7.退款到账中 8.退款成功 9.退款关闭,商家拒绝 10.退款关闭,买家取消,可用
    //   valueEnum: {
    //     1: '商家已同意退货申请,待买家退货',
    //     2: '申请退款待商家处理',
    //     3: '商家拒绝退款,待买家处理',
    //     4: '商家拒绝退货退款,待买家处理',
    //     5: '平台介入,售后处理中',
    //     6: '买家已退货,待商家确认收获',
    //     7: '退款到账中',
    //     8: '退款成功',
    //     9: '退款关闭,商家拒绝',
    //     10: '退款关闭,买家取消',
    //   },
    // },
    {
      title: '备注',
      dataIndex: 'afterSaleReason',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '拒绝原因',
      dataIndex: 'refuseReason',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      // align: 'center',
      valueType: 'option',
      render: (_: any, record: any) => [
        renderAgreeRefund(record),
        renderDisAgreeRefund(record),
        renderReturnGoods(record),
        renderDisReturnGoods(record),
        renderSeeReturnGoods(record),
      ],
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        scroll={{ x: 1000 }}
        search={{
          span: 6,
          collapsed: false,
          labelWidth: 'auto',
          collapseRender: () => undefined,
        }}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey: activeKey,
            items: [
              {
                key: '1',
                label: <span>待处理</span>,
              },
              {
                key: '2',
                label: <span>处理中</span>,
              },
              {
                key: '3',
                label: <span>已完成</span>,
              },
            ],
            onChange: (key) => {
              setActiveKey(key as string);
              console.log('key', key);
              reloadTable();
            },
          },
        }}
        request={(params) => {
          return TableRequest({ ...params, afterSaleStatus: activeKey }, getPage);
        }}
      ></ProTable>
      <Modal
        onOk={() => {
          if (!refundReason) {
            message.error('请输入退款原因');
            return;
          }
          postDisAgreeRefundOrReturnGoods({
            orderId: currentItem?.orderId,
            refuseReason: refundReason,
          }).then(() => {
            message.success('拒绝退款');
            reloadTable();
            setRefundReason('');
            setRefundModalOpen(false);
          });
        }}
        title="拒绝退款"
        open={refundModalOpen}
        onCancel={() => {
          setRefundReason('');
          setRefundModalOpen(false);
        }}
      >
        <Form.Item required label="退款原因">
          <Input
            onChange={(e) => {
              setRefundReason(e.target.value);
            }}
            value={refundReason}
          ></Input>
        </Form.Item>
      </Modal>
    </PageContainer>
  );
}
