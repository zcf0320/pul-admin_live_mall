import { Col, Divider, Row, message } from 'antd';
import { useEffect, useState } from 'react';
import { IDeliverCompany } from '../data';
import { changeCompanyStatus, getDeliverCompany, getSelectedDeliverCompany } from '../service';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styles from '../index.less';

export default function DeliverCompony() {
  const [selectedCompany, setSelectedCompany] = useState<IDeliverCompany[]>([]);
  const [company, setCompany] = useState<IDeliverCompany[]>([]);

  const loadData = () => {
    getDeliverCompany().then((res) => {
      setCompany(res.data);
    });
    getSelectedDeliverCompany().then((res) => {
      setSelectedCompany(res.data);
    });
  };

  const addClick = (record: IDeliverCompany) => {
    changeCompanyStatus({
      id: record.id,
    }).then(() => {
      message.success('添加成功');
      loadData();
    });
  };
  const deleteClick = (record: IDeliverCompany) => {
    changeCompanyStatus({
      id: record.id,
    }).then(() => {
      message.success('删除成功');
      loadData();
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h3 style={{ marginBottom: 0 }}>已选快递</h3>
        <span>（快递订单发货时可选用已添加的快递公司）</span>
      </div>
      <Divider />
      <div>
        <Row gutter={20}>
          {selectedCompany.map((item) => {
            return (
              <Col style={{ marginTop: 20 }} key={item.id} span={4}>
                <div
                  className={styles['company-container']}
                  style={{ border: '1px solid #f5f5f5', borderRadius: 10, position: 'relative' }}
                >
                  <div style={{ paddingBlock: 20 }}>
                    <img
                      src={item.deliveryLogo}
                      style={{ width: '100%', height: 58, objectFit: 'contain' }}
                    />
                  </div>
                  <div className={styles['company-name']}>{item.deliveryName}</div>
                  <div
                    className={styles['hover-popover']}
                    onClick={() => {
                      deleteClick(item);
                    }}
                  >
                    <DeleteOutlined style={{ color: 'white' }} color="white" />
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
        <h3 style={{ marginBottom: 0 }}>可选快递</h3>
      </div>
      <Divider />
      <div>
        <Row gutter={20}>
          {company.map((item) => {
            return (
              <Col style={{ marginTop: 20 }} key={item.id} span={4}>
                <div
                  className={styles['company-container']}
                  style={{ border: '1px solid #f5f5f5', borderRadius: 10, position: 'relative' }}
                >
                  <div style={{ paddingBlock: 20 }}>
                    <img
                      src={item.deliveryLogo}
                      style={{ width: '100%', height: 58, objectFit: 'contain' }}
                    />
                  </div>
                  <div className={styles['company-name']}>{item.deliveryName}</div>
                  <div
                    className={styles['hover-popover']}
                    onClick={() => {
                      addClick(item);
                    }}
                  >
                    <PlusOutlined style={{ color: 'white' }} color="white" />
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
