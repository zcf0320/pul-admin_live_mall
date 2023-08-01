import { Button, Card, Form, InputNumber, Radio, Space, message } from 'antd';

import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import FormItem from 'antd/es/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import styles from './index.module.less';
import { edit, getSetting } from './service';

export default function PageSpecification() {
  const [radio1, setRadio1] = useState(1);
  const [radio2, setRadio2] = useState(1);
  // const [radio3, setRadio3] = useState(1);

  const [customSales, setCustomSales] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);

  const formRef = useRef<FormInstance>(null);

  useEffect(() => {
    getSetting().then((res) => {
      if (res.data) {
        setRadio1(res.data.showSalesVolume);
        setRadio2(res.data.showStockCount);
        formRef.current?.setFieldsValue(res.data);
      }
    });
  }, []);

  const submit = () => {
    formRef.current?.validateFields().then((values) => {
      edit({
        ...values,
        showSalesVolume: radio1,
        showStockCount: radio2,
      }).then(() => {
        message.success('保存成功');
      });
    });
  };

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      {/* <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        scroll={{ x: 1000 }}
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [newAdd()]}
        request={(params) => TableRequest(params, getPage)}
      /> */}
      <Card>
        <Form ref={formRef}>
          <div>
            商品销量展示:
            <span style={{ marginLeft: 20 }}>
              <Radio.Group
                value={radio1}
                onChange={(e) => {
                  formRef.current?.validateFields(['salesVolume']);
                  setRadio1(e.target.value);
                }}
              >
                <Space direction="vertical">
                  <Radio value={1}>所有商品都要展示</Radio>
                  <Radio value={2}>所有商品都不展示</Radio>
                  <Radio className={styles['radio-group-container']} value={3}>
                    <div style={{ display: 'flex' }}>
                      <span style={{ lineHeight: '30px' }}>销量大于</span>
                      <FormItem
                        style={{ marginBottom: 0 }}
                        rules={[{ required: radio1 === 3, message: '请输入商品销量' }]}
                        name={'salesVolume'}
                        // noStyle
                      >
                        <InputNumber<number>
                          value={customSales}
                          disabled={radio1 !== 3}
                          onChange={setCustomSales}
                          style={{ marginInline: 10 }}
                        ></InputNumber>
                      </FormItem>
                      <span style={{ lineHeight: '30px' }}>的商品展示</span>
                    </div>
                  </Radio>
                </Space>
              </Radio.Group>
            </span>
          </div>
          <div style={{ display: 'flex', marginTop: 40 }}>
            剩余件数展示:
            <span style={{ marginLeft: 20, display: 'flex', flexDirection: 'column' }}>
              <Radio.Group
                value={radio2}
                onChange={(e) => {
                  formRef.current?.validateFields(['stockCount']);
                  setRadio2(e.target.value);
                }}
              >
                <Space direction="vertical">
                  <Radio value={1}>所有商品都要展示</Radio>
                  <Radio value={2}>所有商品都不展示</Radio>
                  <Radio className={styles['radio-group-container']} value={3}>
                    <div style={{ display: 'flex' }}>
                      <span style={{ lineHeight: '30px' }}>库存少于</span>
                      <FormItem
                        name={'stockCount'}
                        style={{ marginBottom: 0 }}
                        rules={[{ required: radio2 === 3, message: '请输入库存数量' }]}
                      >
                        <InputNumber
                          value={stock}
                          disabled={radio2 !== 3}
                          onChange={setStock}
                          style={{ marginInline: 10 }}
                        ></InputNumber>
                      </FormItem>
                      <span style={{ lineHeight: '30px' }}>的商品展示</span>
                    </div>
                  </Radio>
                </Space>
              </Radio.Group>
              <span style={{ marginTop: 30, color: '#666', fontSize: 14 }}>
                促销活动指定了活动库存的，活动剩余库存显示不受此设置影响
              </span>
              <Button onClick={submit} style={{ width: 100, marginTop: 40 }} type="primary">
                保存设置
              </Button>
            </span>
          </div>
          {/* <div style={{ display: 'flex', marginTop: 40 }}>
          购买记录展示:
          <span style={{ marginLeft: 20, display: 'flex', flexDirection: 'column' }}>
            <Radio.Group
              value={radio3}
              onChange={(e) => {
                setRadio3(e.target.value);
              }}
            >
              <Space direction="vertical">
                <Radio value={1}>支付完成展示</Radio>
                <Radio value={2}>订单完成展示</Radio>
                <Radio value={3}>不展示</Radio>
              </Space>
            </Radio.Group>
            <span style={{ marginTop: 10, color: '#666', fontSize: 14 }}>
              促销活动指定了活动库存的，活动剩余库存显示不受此设置影响
            </span>
            <span style={{ marginTop: 0, color: '#666', fontSize: 14 }}>
              订单完成展示，完成订单的购买记录会显示在商品详情页 <a>示例</a>
            </span>

          </span>
        </div> */}
        </Form>
      </Card>
    </PageContainer>
  );
}
