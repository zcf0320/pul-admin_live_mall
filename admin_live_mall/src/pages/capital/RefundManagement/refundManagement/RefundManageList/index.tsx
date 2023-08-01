import { FC, useRef, useState } from 'react';
import { Form, Input, message, Modal } from 'antd';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import ModalRefund from '../modalRefund';
import { refundManageList } from '../services';
import {
  postAgreeRefund,
  postDisAgreeRefundOrReturnGoods,
} from '@/pages/Order/OrderManagement/AfterSaleOrderList/service';
import { TableListItem } from '@/pages/Order/OrderManagement/AfterSaleOrderList/data';

interface IProps {
  activeIndex: string;
}

const refundStateEnum = {
  1: '商家已同意退货申请,待买家退货',
  2: '申请退款待商家处理',
  3: '商家拒绝退款,待买家处理',
  4: '商家拒绝退货退款,待买家处理',
  5: '平台介入,售后处理中',
  6: '买家已退货,待商家确认收获',
  7: '退款到账中',
  8: '退款成功',
  9: '退款关闭,商家拒绝',
  10: '退款关闭,买家取消',
};

const Index: FC<IProps> = (props: IProps) => {
  const { activeIndex = '1' } = props || {};
  const tableRef = useRef<ActionType>();
  // const [time, setTime] = useState<string[]>();
  const [modalFlag, setModalFlag] = useState<boolean>(false);
  const [refundReason, setRefundReason] = useState<string>('');
  const [refundModalOpen, setRefundModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<TableListItem>();

  // 同意退款
  const renderAgreeRefund = (item: TableListItem) => {
    // if (![1, 2].includes(item.afterSaleType) || item.afterSaleStatus !== 1) return;
    // if (item.afterSaleStatus !== 1) return;
    return (
      <a
        key="1"
        onClick={() => {
          Modal.confirm({
            title: '同意退款',
            content: '确定同意退款吗？',
            onOk: () => {
              postAgreeRefund({
                orderId: item.orderId,
              }).then(() => {
                message.success('同意退款成功');
                tableRef.current?.reload();
              });
            },
          });
        }}
      >
        同意退款
      </a>
    );
  };
  const renderDisAgreeRefund = (item: TableListItem) => {
    // if (![2].includes(item.afterSaleType) || item.afterSaleStatus !== 1) return;
    if (item.afterSaleStatus !== 1) return;
    return (
      <a
        key="2"
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
  const pendColumns: ProColumns[] = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      align: 'center',
    },
    {
      title: '提交时间',
      dataIndex: 'applyStartTime',
      valueType: 'dateTimeRange',
      align: 'center',
      hideInTable: true,
      search: {
        transform: (record) => {
          return {
            startTime: record[0],
            endTime: record[1],
          };
        },
      },
    },
    {
      title: '支付方式',
      dataIndex: 'payMethod',
      align: 'center',
      valueEnum: {
        WECHAT_APPLET: '微信小程序支付',
        WECHAT_MP: '微信公众号支付',
        WECHAT_H5: '微信支付-H5',
        WECHAT_JSAPI: '微信支付-JSAPI',
        ALIPAY: '支付宝',
        OFFLINE: '线下',
      },
    },
    {
      title: '收款人',
      dataIndex: 'username',
      align: 'center',
      render: (text, record) => {
        const { userName, userId, phone } = record || {};
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span>昵称：{userName ?? '-'}</span>
              <span>ID：{userId ?? '-'}</span>
              <span>手机号：{phone ?? '-'}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '业务类型',
      dataIndex: 'type',
      align: 'center',
      search: false,
      valueEnum: {
        1: '申请退款',
        2: '申请退货',
      },
    },
    {
      title: '售后维权单号',
      dataIndex: 'afterSaleNo',
      align: 'center',
      search: false,
    },
    {
      title: '退款金额',
      dataIndex: 'refundMoney',
      align: 'center',
      search: false,
    },

    {
      title: '提交时间',
      dataIndex: 'applyStartTime',
      align: 'center',
      search: false,
    },
    {
      title: '退款状态',
      dataIndex: 'refundState',
      align: 'center',
      search: false,
      valueEnum: refundStateEnum,
    },
    activeIndex === '1'
      ? {
          title: '操作',
          valueType: 'option',
          fixed: 'right',
          align: 'center',
          search: false,
          width: 140,
          render: (_, record) => [renderAgreeRefund(record), renderDisAgreeRefund(record)],
        }
      : {
          search: false,
        },
  ];

  const getRefundedList = async (params: IParams): Promise<any> => {
    try {
      const {
        data: { records = [], total = 0 },
      } = await refundManageList(params);
      return {
        data: records,
        success: true,
        total: total,
      };
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="pendingprocessing">
      <ProTable
        className="mt20"
        columns={pendColumns}
        options={false}
        actionRef={tableRef}
        search={{
          labelWidth: 'auto',
          span: 8,
          collapsed: false,
          collapseRender: () => null,
        }}
        rowKey="id"
        scroll={{ x: 1200 }}
        // rowSelection={isPending ? rowSelection : false}
        params={{ afterSaleStatus: activeIndex }}
        request={(params) => {
          return getRefundedList(params as IParams);
        }}
      />
      <ModalRefund modalFlag={modalFlag} setModalFlag={() => setModalFlag(false)} />

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
            message.success('已拒绝退款');
            setRefundReason('');
            setRefundModalOpen(false);
            tableRef.current?.reload();
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
          />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default Index;
