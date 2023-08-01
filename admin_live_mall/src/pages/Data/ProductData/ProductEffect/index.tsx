import { useEffect, useState } from 'react';
import type { DatePickerProps } from 'antd';
import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select, Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { getGoodsEffectData } from './services';
import './index.less';
import { PageContainer } from '@ant-design/pro-components';

interface DataType {
  key: React.Key;
  name: string;
  chinese: number;
  math: number;
  english: number;
}

type LayoutType = Parameters<typeof Form>[0]['layout'];
// const { Option } = Select;
const ProductEffect = () => {
  const [form] = Form.useForm();
  const [checkForm] = Form.useForm();
  // const [formLayout, setFormLayout] = useState<LayoutType>('inline');
  const [selectTime, setSelectTime] = useState('');
  const [time, setTime] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  //   选择自然日
  const handleChangeTime = (value: string) => {
    console.log(`selected ${value}`);
    setSelectTime(value);
    console.log(selectTime, '77777777');
  };
  //   选择日期
  const onChangeTime: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
    setTime(dateString);
    console.log(time);
  };
  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    // setFormLayout(layout);
    console.log(layout);
  };
  // 商品分类
  const handleClassification = (value: string) => {
    // debugger;
    console.log(value);
  };
  // 状态筛选
  const handleChangeType = (value: string) => {
    console.log(value);
  };
  // 确认
  const handOk = () => {
    console.log({ ...form.getFieldsValue(), selectTime, time }, '000000');
  };
  // 重置
  const handLoread = () => {
    form.resetFields();
    setSelectTime('');
    setTime('');
  };
  let obj = {} as any;
  const handCheckbox = (e: CheckboxChangeEvent, num: number) => {
    console.log(checkForm.getFieldsValue());
    console.log(e.target.checked, num);

    // if (num === 1) {
    //   obj.visitors = e.target.checked;
    // } else if (num === 2) {
    //   obj.volume = e.target.checked;
    // } else if (num === 3) {
    //   obj.buyers = e.target.checked;
    // } else if (num === 4) {
    //   obj.purchases = e.target.checked;
    // } else if (num === 5) {
    //   obj.payers = e.target.checked;
    // } else if (num === 6) {
    //   obj.orders = e.target.checked;
    // } else if (num === 7) {
    //   obj.quantity = e.target.checked;
    // } else if (num === 8) {
    //   obj.goods = e.target.checked;
    // } else if (num === 9) {
    //   obj.rate = e.target.checked;
    // } else if (num === 10) {
    //   obj.application = e.target.checked;
    // } else if (num === 11) {
    //   obj.refund = e.target.checked;
    // } else if (num === 12) {
    //   obj.refundedOrders = e.target.checked;
    // } else if (num === 13) {
    //   obj.amount = e.target.checked;
    // } else if (num === 14) {
    //   obj.refundRate = e.target.checked;
    // }
    switch (num) {
      case 1:
        obj.visitors = e.target.checked;
        break;
      case 2:
        obj.volume = e.target.checked;
        break;
      case 3:
        obj.buyers = e.target.checked;
        break;
      case 4:
        obj.purchases = e.target.checked;
        break;
      case 5:
        obj.payers = e.target.checked;
        break;
      case 6:
        obj.orders = e.target.checked;
        break;
      case 7:
        obj.quantity = e.target.checked;
        break;
      case 8:
        obj.goods = e.target.checked;
        break;
      case 9:
        obj.rate = e.target.checked;
        break;
      case 10:
        obj.application = e.target.checked;
        break;
      case 11:
        obj.refund = e.target.checked;
        break;
      case 12:
        obj.refundedOrders = e.target.checked;
        break;
      case 13:
        obj.amount = e.target.checked;
        break;
      case 14:
        obj.refundRate = e.target.checked;
        break;
      default:
        break;
    }
    console.log(obj);
  };

  // const formItemLayout =
  //   formLayout === 'horizontal' ? { labelCol: { span: 4 }, wrapperCol: { span: 14 } } : null;

  // const buttonItemLayout =
  //   formLayout === 'horizontal' ? { wrapperCol: { span: 14, offset: 4 } } : null;
  const columns: ColumnsType<DataType> = [
    {
      title: '商品信息',
      dataIndex: 'name',
      fixed: 'left',
      width: 100,
    },
    {
      title: '访客数',
      dataIndex: 'chinese',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
      width: 100,
    },
    {
      title: '加购人数',
      dataIndex: 'math',
      sorter: {
        compare: (a, b) => a.math - b.math,
        multiple: 2,
      },
      width: 100,
    },
    {
      title: '加购件数',
      dataIndex: 'english',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
      width: 100,
    },
    {
      title: '支付人数',
      dataIndex: 'english',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
      width: 100,
    },
    {
      title: '支付件数',
      dataIndex: 'english',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
      width: 100,
    },
    {
      title: '单品转化率',
      dataIndex: 'english',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
      width: 100,
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      chinese: 98,
      math: 60,
      english: 70,
    },
    {
      key: '2',
      name: 'Jim Green',
      chinese: 98,
      math: 66,
      english: 89,
    },
    {
      key: '3',
      name: 'Joe Black',
      chinese: 98,
      math: 90,
      english: 70,
    },
    {
      key: '4',
      name: 'Jim Red',
      chinese: 88,
      math: 99,
      english: 89,
    },
    {
      key: '5',
      name: 'John Brown',
      chinese: 98,
      math: 60,
      english: 70,
    },
    {
      key: '6',
      name: 'Jim Green',
      chinese: 98,
      math: 66,
      english: 89,
    },
    {
      key: '7',
      name: 'Joe Black',
      chinese: 98,
      math: 90,
      english: 70,
    },
    {
      key: '8',
      name: 'Jim Red',
      chinese: 88,
      math: 99,
      english: 89,
    },
    {
      key: '9',
      name: 'Joe Black',
      chinese: 98,
      math: 90,
      english: 70,
    },
    {
      key: '10',
      name: 'Jim Red',
      chinese: 88,
      math: 99,
      english: 89,
    },
    {
      key: '11',
      name: 'Jim Red',
      chinese: 88,
      math: 99,
      english: 89,
    },
  ];
  // 表格
  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };
  // 查看示例
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };
  // 获取数据
  const getEffectData = () => {
    getGoodsEffectData()
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getEffectData();
  }, []);
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className="ProductEffect">
        <div className="ProductEffect-content">
          <div className="ProductEffect-form">
            <Form
              // {...formItemLayout}
              // layout={formLayout}
              form={form}
              // initialValues={{ layout: formLayout }}
              onValuesChange={onFormLayoutChange}
              // style={{ maxWidth: formLayout === 'inline' ? 'none' : 600 }}
            >
              <Row gutter={[35, 0]}>
                <Col span={10}>
                  <Form.Item name="time" label="时间筛选">
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                      }}
                    >
                      <Select
                        // defaultValue="lucy"
                        style={{ width: '30%', margin: '0 20px 0 0px' }}
                        onChange={handleChangeTime}
                        options={[
                          { value: 'jack', label: 'Jack' },
                          { value: 'lucy', label: '自然日' },
                          { value: 'Yiminghe', label: 'yiminghe' },
                        ]}
                      />
                      <DatePicker style={{ width: '70%' }} onChange={onChangeTime} />
                    </div>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name="classification" label="商品分类">
                    <Select
                      onChange={handleClassification}
                      placeholder="不选则显示全部"
                      options={[
                        { value: '1', label: '1' },
                        { value: '2', label: '2' },
                        { value: '3', label: '3' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="type" label="状态筛选">
                    <Select
                      // defaultValue="lucy"
                      // style={{ width: 220 }}
                      onChange={handleChangeType}
                      placeholder="不选则显示全部"
                      options={[
                        { value: '00', label: '00' },
                        // { value: 'lucy', label: '自然日' },
                        // { value: 'Yiminghe', label: 'yiminghe' },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col span={10}>
                  <Form.Item name="name" label="商品名称" style={{ margin: '0px 0 0 0' }}>
                    <Input style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={14}></Col>
              </Row>
            </Form>

            <div className="form-producteffect-btn">
              <Button type="primary" className="btn-ok" onClick={() => handOk()}>
                筛选
              </Button>
              <Button onClick={() => handLoread()}>重置</Button>
            </div>
          </div>
          <div className="ProductEffect-screen">
            <div className="ProductEffect-screen-filter">
              <div className="ProductEffect-screen-check">
                <span className="sales-target">销售指标:</span>

                <Checkbox onChange={(e) => handCheckbox(e, 1)}>访客数</Checkbox>

                <Checkbox onChange={(e) => handCheckbox(e, 2)}>浏览量</Checkbox>

                <Checkbox onChange={(e) => handCheckbox(e, 3)}>加购人数</Checkbox>

                <Checkbox onChange={(e) => handCheckbox(e, 4)}>加购件数</Checkbox>
              </div>
              <div className="ProductEffect-screen-check">
                <span className="sales-target"></span>
                <Checkbox onChange={(e) => handCheckbox(e, 5)}>支付人数</Checkbox>
                <Checkbox onChange={(e) => handCheckbox(e, 6)}>支付订单数</Checkbox>
                <Checkbox onChange={(e) => handCheckbox(e, 7)}>支付件数</Checkbox>
                <Checkbox onChange={(e) => handCheckbox(e, 8)}>商品实付金额</Checkbox>
                <Checkbox onChange={(e) => handCheckbox(e, 9)}>单品转化率</Checkbox>
              </div>
              <div className="ProductEffect-screen-check">
                <span className="sales-target">售后指标:</span>
                <Checkbox onChange={(e) => handCheckbox(e, 10)}>申请退款订单数</Checkbox>
                <Checkbox onChange={(e) => handCheckbox(e, 11)}>申请退款人数</Checkbox>
                <Checkbox onChange={(e) => handCheckbox(e, 12)}>成功退款订单数</Checkbox>
                <Checkbox onChange={(e) => handCheckbox(e, 13)}>成功退款金额</Checkbox>
                <Checkbox onChange={(e) => handCheckbox(e, 14)}>退款率</Checkbox>
              </div>
              <div className="ProductEffect-screen-check ProductEffect-screen-btn">
                <span className="sales-target"></span>
                <Button style={{ margin: '0 20px 0 0' }}>导出报表</Button>
                {/*<Button>查看已导出列表</Button>*/}
                <Button type="link" onClick={() => showModal()}>
                  指标说明
                </Button>
              </div>
            </div>
          </div>
          <Modal
            title="指标说明"
            open={isModalOpen}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            width={750}
            footer={null}
          >
            <div
              className="modal-list"
              style={{ height: '500px', overflowY: 'scroll', margin: '20px 0' }}
            >
              <div>
                <h4>访客数</h4>
                <p>统计时间内，访问过该商品详情页的人数，一人多次访问只记一人</p>
              </div>
              <div>
                <h4>浏览量</h4>
                <p>统计时间内，该商品详情页被访问的次数汇总，一人多次访问记为多次</p>
              </div>
              <div>
                <h4>加购人数</h4>
                <p>统计时间内，将该商品加入过购物车的人数，一人多次加入只记一人</p>
              </div>
              <div>
                <h4>加购件数</h4>
                <p>统计时间内，该商品加入购物车的累计件数</p>
              </div>
              <div>
                <h4>支付人数</h4>
                <p>
                  统计时间内，包含该商品订单成功付款的人数，一人多次付款只记一人(货到付款订单交易完成后计入，不剔除退款订单)
                </p>
              </div>
              <div>
                <h4>支付订单数</h4>
                <p>
                  统计时间内，包含该商品订单成功付款的订单数(货到付款订单交易完成后计入，不剔除退款订单)
                </p>
              </div>
              <div>
                <h4>支付件数</h4>
                <p>
                  统计时间内，成功付款订单包含的该商品的总件数(货到付款订单交易完成后计入，不剔除退款订单)
                </p>
              </div>
              <div>
                <h4>商品实付金额</h4>
                <p>
                  统计时间内，成功付款的订单，分摊到该商品的实际付款金额的汇总(货到付款订单交易完成后计入，不剔除退款金额)
                </p>
              </div>
              <div>
                <h4>单品转化率</h4>
                <p>统计时间内，商品支付人数 / 商品访客数 * 100%</p>
              </div>
              <div>
                <h4>申请退款订单数</h4>
                <p>统计时间内，该商品发起退款申请的订单数</p>
              </div>
              <div>
                <h4>申请退款人数</h4>
                <p>统计时间内，该商品发起退款申请的人数，一人多次发起退款只记一人</p>
              </div>
              <div>
                <h4>成功退款订单数</h4>
                <p>统计时间内，该商品成功退款的订单数</p>
              </div>
              <div>
                <h4>成功退款人数</h4>
                <p>统计时间内，该商品成功退款的人数，一人多次退款只记一人</p>
              </div>
              <div>
                <h4>成功退款金额</h4>
                <p>统计时间内，该商品成功退款的总金额</p>
              </div>
              <div>
                <h4>退款率</h4>
                <p>商品退款率 = 申请退款订单数 / 支付订单数 * 100%</p>
              </div>
            </div>
          </Modal>
          <div className="table">
            <Table columns={columns} dataSource={data} onChange={onChange} scroll={{ x: 1200 }} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProductEffect;
