// import { useRef } from 'react';

// import { Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import styles from './index.module.less';
// const FormItem = Form.Item;
// const { RangePicker } = DatePicker;
// const clientTagList = [
//   { value: '1', label: '店铺劵' },
//   { value: '2', label: '商品劵' },
// ];
const CouponData = () => {
  return (
    <div className={styles.CouponData}>
      <div className={styles.CouponHeaderData}>
        <div className={styles.CouponDataChildren}>
          <span className={styles.textFize}>领取张数</span>
          <span className={styles.mgt10}>
            <b className={styles.colorBlue}>9</b>张
          </span>
        </div>
        <div className={styles.CouponDataChildren}>
          <span className={styles.textFize}>使用张数</span>
          <span className={styles.mgt10}>
            <b className={styles.colorBlue}>9</b>张
          </span>
        </div>
        <div className={styles.CouponDataChildren} style={{ border: 'none' }}>
          <span className={styles.textFize}>成交金额</span>
          <span className={styles.mgt10}>
            <b style={{ color: 'red' }}>¥</b>
            <b className={styles.colorRed}>9</b>
          </span>
        </div>
      </div>
      <div className={styles.formTable}>
        {/* <Card style={{ marginBottom: 20 }}>
          <Row gutter={[18, 20]} wrap={true}>
            <Col span={8}>
              <FormItem label="创建时间" name="customerTime">
                <RangePicker showTime />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="客户昵称" name="userName">
                <Input placeholder="请输入客户昵称" />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="客户标签" name="labelIds">
                <Select placeholder="请选择客户标签" options={clientTagList} allowClear />
              </FormItem>
            </Col>
          </Row>
        </Card> */}
      </div>
    </div>
  );
};

export default CouponData;
