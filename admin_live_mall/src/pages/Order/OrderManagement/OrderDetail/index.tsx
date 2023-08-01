import { Card, Typography } from 'antd';
import {
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { getDetail } from '@/pages/Order/OrderManagement/OrderList/service';
import { TableListItem, TableListItemDetail } from '@/pages/Order/OrderManagement/OrderList/data';
import { orderStatusObject } from '@/pages/Order/OrderManagement/OrderList';
import { useLocation } from '@umijs/max';

const OrderDetail = () => {
  const { state }: any = useLocation();
  const [currentDetail, setCurrentDetail] = useState<TableListItemDetail>();
  const descColumns: ProDescriptionsItemProps<TableListItem>[] = [
    { title: '订单号', dataIndex: 'orderNo', ellipsis: true },
    // { title: '购买人手机号', dataIndex: 'userPhone', ellipsis: true },
    { title: '总价', dataIndex: 'totalPrice', ellipsis: true },
    { title: '买家手机号', dataIndex: 'phone', ellipsis: true },
    { title: '买家姓名', dataIndex: 'userName', ellipsis: true },
    { title: '收货人', dataIndex: 'receiveName', ellipsis: true },
    { title: '收货手机号', dataIndex: 'receivePhone', ellipsis: true },
    { title: '运费', dataIndex: 'freight', ellipsis: true },
    // {
    //   title: '是否虚拟商品',
    //   dataIndex: 'isVirtual',
    //   ellipsis: true,
    //   renderText: (text) => (text ? '是' : '否'),
    // },
    { title: '购买数量', dataIndex: 'buyCount', ellipsis: true },
    { title: '下单时间', dataIndex: 'orderTime', ellipsis: true },
    { title: '支付时间', dataIndex: 'payTime', ellipsis: true },
    {
      title: '收货地址',
      dataIndex: 'receiveAddress',

      // ellipsis: true,
      renderText: (_, record) => {
        if (record.isVirtual) return '';
        return (
          record.receiveProvince +
          record.receiveCity +
          record.receiveArea +
          record.receiveStreet +
          record.receiveAddress
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      // ellipsis: true,
      renderText: (_, record) => orderStatusObject[record.status],
    },
    { title: '备注', dataIndex: 'remark', ellipsis: true },
  ];
  const orderItemColumns: ProColumns[] = [
    {
      title: '商品名称',
      dataIndex: 'productName',
      ellipsis: true,
    },
    {
      title: '商品图片',
      dataIndex: 'coverPic',
      ellipsis: true,
      valueType: 'image',
    },
    {
      title: '规格名称',
      dataIndex: 'specsName',
      ellipsis: true,
    },
    {
      title: '规格图片',
      dataIndex: 'specsPic',
      ellipsis: true,
      valueType: 'image',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      ellipsis: true,
    },
    {
      title: '购买数量',
      dataIndex: 'num',
      ellipsis: true,
    },
  ];

  useEffect(() => {
    getDetail({ id: state?.orderId }).then((res) => {
      setCurrentDetail(res.data);
    });
  }, [state?.orderId]);

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card style={{ height: '82vh' }}>
        {currentDetail ? (
          <>
            <ProDescriptions column={3} columns={descColumns} dataSource={currentDetail} />
            {/*<ProDescriptions column={3} columns={descColumns} dataSource={state?.currentItem} />*/}
            <div>
              <Typography.Title
                style={{
                  marginTop: '20px',
                }}
                level={5}
              >
                订单商品信息
              </Typography.Title>
              <div>
                {state?.orderId ? (
                  <ProTable
                    rowKey="id"
                    search={false}
                    toolBarRender={false}
                    scroll={{ x: 1000 }}
                    dataSource={currentDetail?.orderItems}
                    columns={orderItemColumns}
                    pagination={false}
                  />
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </Card>
    </PageContainer>
  );
};

export default OrderDetail;
