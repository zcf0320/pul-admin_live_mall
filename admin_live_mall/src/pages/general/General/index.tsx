import { FC, useEffect, useState } from 'react';
import { Button, Card, Popover, Spin, Tag } from 'antd';
import { history } from '@umijs/max';
import useStore from '@/hooks/useStore';

import styles from './index.module.less';
import { generalDataSource } from '@/pages/general/General/services';
import dayjs from 'dayjs';

// 常用功能icon
const commonlyUsedIcons = [
  {
    title: '客户查询',
    iconUrl: require('@/assets/generalIcon/user.png'),
    link: '/Customer/TotalCustomer',
  },
  {
    title: '商品管理',
    iconUrl: require('@/assets/generalIcon/shop.png'),
    link: '/product/ProductManagement/productList',
  },
  {
    title: '订单查询',
    iconUrl: require('@/assets/generalIcon/order.png'),
    link: '/Order/OrderManagement/OrderList',
  },
  {
    title: '售后管理',
    iconUrl: require('@/assets/generalIcon/after-sales.png'),
    link: '/Order/OrderManagement/AfterSaleOrderList',
  },
  {
    title: '资金总览',
    iconUrl: require('@/assets/generalIcon/amont.png'),
    link: '/capital/billManagement/BillDetail',
  },
  {
    title: '提现',
    iconUrl: require('@/assets/generalIcon/withdrawal.png'),
    link: '/capital/withdrawalManagement/withdrawalApplication',
  },
];
const General: FC = () => {
  const store = useStore();
  const [generalData, setGeneralData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const { storeLogo, storeName } = useStore();

  // 获取概览数据信息
  const getGeneralData = async () => {
    try {
      setLoading(true);
      const {
        timestamp = new Date().valueOf(),
        data: { lastMonthTotal = 0, monthTotal = 0, today, yesterday },
      } = await generalDataSource();
      const updateTime = dayjs(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss');
      setGeneralData({ lastMonthTotal, monthTotal, today, yesterday, updateTime });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGeneralData();
  }, []);

  const { lastMonthTotal = '', monthTotal = '', today, yesterday, updateTime } = generalData || {};
  return (
    <div>
      <Card className={styles.generalHeader}>
        <div className={styles.generalContainer}>
          <div className={styles.flex}>
            <div className={styles.logo}>
              <img src={storeLogo ?? '/logo.png'} alt="logo" />
            </div>
            <div className={styles.generalInfo}>
              <div className={styles.generalName}>{storeName}</div>
              {store?.storeInfo?.tradeStatus ? (
                <Tag color="#87d068">营业中</Tag>
              ) : (
                <Tag color="#d8d8d8">休息中</Tag>
              )}
            </div>
          </div>
          {store.storeInfo?.qrCode && (
            <div className={styles.flex}>
              <Popover
                placement="left"
                title=""
                content={
                  <div className={styles.qrcode}>
                    <img src={store.storeInfo?.qrCode} alt="" />
                  </div>
                }
                trigger="click"
              >
                <div className={styles.visitStore}>
                  <span>访问店铺</span>
                </div>
              </Popover>
            </div>
          )}
        </div>
      </Card>
      <Card
        className={styles.generalContent}
        title={
          <div className={styles.storeData}>
            <span className={styles.dataTitle}>店铺数据</span>
            <span className={styles.updateTime}>更新时间：{updateTime || ''}</span>
            <Button type="link" onClick={() => getGeneralData()}>
              刷新
            </Button>
          </div>
        }
      >
        <div className={styles.dataBoard}>
          <Spin className={styles.loading} size="large" spinning={loading}>
            <div className={styles.storeData}></div>
            <div className={styles.storeBoard}>
              <div className={styles.storeLeft}>
                <div className={styles.dataItem}>
                  <span className={styles.dataTitle}>今日订单数</span>
                  <span className={styles.dataNum}>{today?.orders ?? 0}</span>
                  <span className={styles.dataYesterday}>昨日 {yesterday?.orders ?? 0}</span>
                </div>
                <div className={styles.dataItem}>
                  <span className={styles.dataTitle}>今日成交额 (元)</span>
                  <span className={styles.dataNum}>{today?.totalAmount ?? 0}</span>
                  <span className={styles.dataYesterday}>昨日 {yesterday?.totalAmount ?? 0}</span>
                </div>
                <div className={styles.dataItem}>
                  <span className={styles.dataTitle}>今日下单用户数</span>
                  <span className={styles.dataNum}>{today?.createOrderUserNum ?? 0}</span>
                  <span className={styles.dataYesterday}>
                    昨日 {yesterday?.createOrderUserNum ?? 0}
                  </span>
                </div>
                <div className={styles.dataItem}>
                  <span className={styles.dataTitle}>今日访客数 UV</span>
                  <span className={styles.dataNum}>{today?.uv ?? 0}</span>
                  <span className={styles.dataYesterday}>昨日 {yesterday?.uv ?? 0}</span>
                </div>
                <div className={styles.dataItem}>
                  <span className={styles.dataTitle}>今日转化率</span>
                  <span className={styles.dataNum}>{today?.conversionRate ?? 0}%</span>
                  <span className={styles.dataYesterday}>
                    昨日 {yesterday?.conversionRate ?? 0}%
                  </span>
                </div>
                <div className={styles.dataItem}>
                  <span className={styles.dataTitle}>今日浏览 PV</span>
                  <span className={styles.dataNum}>{today?.pv ?? 0}</span>
                  <span className={styles.dataYesterday}>昨日 {yesterday?.pv ?? 0}</span>
                </div>
                <div className={styles.dataItem}>
                  <span className={styles.dataTitle}>待发货订单</span>
                  <span className={styles.dataNum}>{today?.unShipmentOrders ?? 0}</span>
                  <span className={styles.dataYesterday}>
                    昨日 {yesterday?.unShipmentOrders ?? 0}
                  </span>
                </div>
                <div className={styles.dataItem}>
                  <span className={styles.dataTitle}>待付款订单</span>
                  <span className={styles.dataNum}>{today?.unPayOrders ?? 0}</span>
                  <span className={styles.dataYesterday}>昨日 {yesterday?.unPayOrders ?? 0}</span>
                </div>
                <div className={styles.dataItem}>
                  <span className={styles.dataTitle}>售后订单</span>
                  <span className={styles.dataNum}>{today?.afterSaleOrders ?? 0}</span>
                  <span className={styles.dataYesterday}>
                    昨日 {yesterday?.afterSaleOrders ?? 0}
                  </span>
                </div>
              </div>
              <div className={styles.storeRight}>
                <div>
                  <div className={styles.dataItemTop}>
                    <span className={styles.dataTitle}>总成交额(元)</span>
                    <span className={styles.dataNum}>{monthTotal ?? 0}</span>
                  </div>
                  <div className={styles.dataItemBottom}>
                    <span className={styles.dataTitle}>本月累计成交金额(元)</span>
                    <span className={styles.dataNum}>{monthTotal ?? 0}</span>
                    <span className={styles.dataYesterMonth}>上月同期 {lastMonthTotal ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </Card>
      <Card title="常用功能">
        <div className={styles.generalFooter}>
          {commonlyUsedIcons?.map(({ title, iconUrl, link }) => {
            return (
              <div key={title} className={styles.IconItem} onClick={() => history.push(link)}>
                <img src={iconUrl} alt={title} />
                <div className={styles.IconTitle}>{title}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default General;
