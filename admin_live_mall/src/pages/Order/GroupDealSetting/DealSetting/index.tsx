import { Button, Card, InputNumber, message } from 'antd';

import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { edit, getData } from './service';

export default function PageSpecification() {
  const [afterSalesTime, setAfterSalesTime] = useState<number | null>(null);
  const [cancelTime, setCancelTime] = useState<number | null>(null);
  const [confirmTime, setConfirmTime] = useState<number | null>(null);
  const [autoSettlementTime, setAutoSettlementTime] = useState<number | null>(null);

  useEffect(() => {
    getData().then((res) => {
      if (res.data) {
        setAfterSalesTime(res.data.afterSalesTime);
        setCancelTime(res.data.cancelTime);
        setConfirmTime(res.data.confirmTime);
        setAutoSettlementTime(res.data.autoSettlementTime);
      }
    });
  }, []);

  const confirm = () => {
    if (!cancelTime) return message.error('请输入待付款订单取消时间');
    if (!afterSalesTime) return message.error('订单完成后可申请售后的时间');
    if (!confirmTime) return message.error('发货后自动确认收货时间');
    if (!autoSettlementTime) return message.error('请输入订单结算时间');
    return edit({
      afterSalesTime,
      cancelTime,
      confirmTime,
      autoSettlementTime,
    }).then(() => {
      message.success('编辑成功');
    });
  };

  const width = 240;

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className={styles.dot} style={{ width: width, textAlign: 'right' }}>
            待付款订单取消时间:
          </span>
          <span style={{ marginLeft: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              下单完成后
              <InputNumber<number>
                value={cancelTime}
                onChange={setCancelTime}
                style={{ marginInline: 10, width: 120 }}
                addonAfter="分"
              ></InputNumber>
              内未付款，订单自动取消
            </div>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
          <span className={styles.dot} style={{ width: width, textAlign: 'right' }}>
            发货后自动确认收货时间:
          </span>
          <span style={{ marginLeft: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              订单发货后
              <InputNumber<number>
                value={confirmTime}
                onChange={setConfirmTime}
                style={{ marginInline: 10, width: 120 }}
                addonAfter="天"
              ></InputNumber>
              内未收货，订单自动确认收货
            </div>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
          <span className={styles.dot} style={{ width: width, textAlign: 'right' }}>
            订单完成后可申请售后的时间:
          </span>
          <span style={{ marginLeft: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              订单完成后
              <InputNumber<number>
                value={afterSalesTime}
                onChange={setAfterSalesTime}
                style={{ marginInline: 10, width: 120 }}
                addonAfter="天"
              ></InputNumber>
              内可申请售后维权
            </div>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
          <span className={styles.dot} style={{ width: width, textAlign: 'right' }}>
            订单结算时间:
          </span>
          <span style={{ marginLeft: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              订单完成后
              <InputNumber<number>
                value={autoSettlementTime}
                onChange={setAutoSettlementTime}
                style={{ marginInline: 10, width: 120 }}
                addonAfter="天"
              ></InputNumber>
              后，订单自动结算
            </div>
          </span>
        </div>

        <Button
          onClick={confirm}
          style={{ width: 100, marginTop: 40, marginLeft: width + 20 }}
          type="primary"
        >
          保存设置
        </Button>
      </Card>
    </PageContainer>
  );
}
