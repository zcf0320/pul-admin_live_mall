import { useEffect, useState } from 'react';
import { useLocation } from '@umijs/max';
import { Card, Checkbox, Typography } from 'antd';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { CheckCircleOutlined } from '@ant-design/icons';

import styles from './index.module.less';

const PromoteOrder = () => {
  const { state }: any = useLocation();
  const [orderDetail, setOrderDetail] = useState<any>({});
  const [activeKey, setActiveKey] = useState<string>('COMMISSION');
  const [isPromotion, setIsPromotion] = useState(false); // 是否未参与推广

  const commissionColumns: ProColumns[] = [
    {
      title: '团长信息',
      dataIndex: 'productName',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '佣金层级',
      dataIndex: 'coverPic',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '基础佣金',
      dataIndex: 'specsName',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '佣金系数',
      dataIndex: 'specsPic',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '实际佣金',
      dataIndex: 'amount',
      ellipsis: true,
      align: 'center',
    },
  ];
  const allowanceColumns: ProColumns[] = [
    {
      title: '合伙人',
      dataIndex: 'productName',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '成员关系',
      dataIndex: 'coverPic',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '直推佣金',
      dataIndex: 'specsName',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '自己团队津贴比例',
      dataIndex: 'specsPic',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '下级团队津贴比例',
      dataIndex: 'amount',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '实际收益',
      dataIndex: 'amount',
      ellipsis: true,
      align: 'center',
    },
  ];

  const productColumns: ProColumns[] = [
    {
      title: '商品信息',
      dataIndex: 'amount',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '单价/数量',
      dataIndex: 'amount',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '优惠/改价',
      dataIndex: 'amount',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '小计',
      dataIndex: 'amount',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '核算金额',
      dataIndex: 'amount',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '商品佣金',
      dataIndex: 'amount',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'amount',
      ellipsis: true,
      align: 'center',
    },
  ];

  const getPromteOrderDetail = async () => {
    const params = {
      id: state?.orderId,
      isPromotion,
    };
    console.log(params);
    setOrderDetail({
      orderDetail: '11010182091029019092',
    });
  };

  useEffect(() => {
    getPromteOrderDetail();
  }, [state?.orderId]);

  const expandedRowRender = () => {
    const columns: any = [
      { title: '佣金层级', dataIndex: 'date', key: 'date', align: 'center' },
      { title: '佣金设置', dataIndex: 'name', key: 'name', align: 'center' },
      {
        title: '团长',
        key: 'state',
        align: 'center',
      },
      { title: '基础佣金', dataIndex: 'upgradeNum', key: 'upgradeNum', align: 'center' },
      {
        title: '佣金系数',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
      },
      {
        title: '实际佣金',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
      },
    ];

    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i.toString(),
        date: '2014-12-24 23:12:00',
        name: 'This is production name',
        upgradeNum: 'Upgraded: 56',
      });
    }
    return (
      <ProTable
        search={false}
        options={false}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    );
  };
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card className={styles.cardHeader}>
        <div className={styles.orderInfo}>
          <div className={styles.orderLeft}>
            <h2>订单信息</h2>
            <div>订单编号：{orderDetail?.orderNo}</div>
            <div>订单类型：自提订单</div>
            <div>订单来源：微信小程序</div>
            <div>付款方式：微信支付-小程序</div>
            <div>创建时间：2023/04/15 21:43:19</div>
            <br />
            <div>买家：微信用户</div>
            <div>买家ID： 16367549124608</div>
          </div>
          <div className={styles.orderRight}>
            <h2>订单状态</h2>
            <div>
              <div className={styles.orderStatus}>
                <div>
                  <CheckCircleOutlined className={styles.orderStatusIcon} />
                </div>
                <div className={styles.orderStatusDetail}>
                  <span>交易完成</span>
                  <span className={styles.orderStatusRemark}>买家已确认收货，本次交易完成</span>
                </div>
              </div>
              <div className={styles.orderAmount}>
                <div className={styles.orderAmountLeft}>
                  <div className={styles.orderAmountTitle}>订单金额：</div>
                  <div className={styles.amountDetail}>
                    <span className={styles.amount}>￥59.90</span>
                    <span className={styles.freight}>(含运费: ￥0.00)</span>
                  </div>
                </div>
                <div className={styles.totalCommission}>
                  总佣金:
                  <span className={styles.commission}>￥6.03</span>
                </div>
              </div>
              <div className={styles.customerStatus}>
                <div className={styles.customer}>
                  <span>团长: 赵玲</span>
                  <span>团长ID: 14613071896576</span>
                </div>
                <div className={styles.customer}>
                  <span>结算状态: 已结算</span>
                  <span>结算时间: 2023/05/22 08:20:40</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card size="small" className={styles.cardBody}>
        <ProTable
          search={false}
          options={false}
          columns={activeKey === 'COMMISSION' ? commissionColumns : allowanceColumns}
          toolbar={{
            menu: {
              type: 'tab',
              activeKey,
              items: [
                {
                  //commission
                  key: 'COMMISSION',
                  label: '团长佣金(￥ 5.99)',
                },
                {
                  //allowance
                  key: 'ALLOWANCE',
                  label: '团队津贴(￥ 0.04)',
                },
              ],
              onChange: (key) => setActiveKey(key as string),
            },
          }}
        />
      </Card>
      <Card size="small" className={styles.cardFooter}>
        <div className={styles.tool}>
          <Typography.Title
            style={{
              margin: '0 21px',
            }}
            level={5}
          >
            订单商品信息
          </Typography.Title>
          <Checkbox onChange={(e) => setIsPromotion(e?.target?.checked)}>
            隐藏未参与推广的商品
          </Checkbox>
        </div>
        <ProTable
          columns={productColumns}
          search={false}
          options={false}
          dataSource={[
            {
              amount: 10,
            },
          ]}
          expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
        />
      </Card>
    </PageContainer>
  );
};

export default PromoteOrder;
