import { useEffect, useState } from 'react';
import { Button, Form, Image, Input, message, Spin, Tooltip } from 'antd';
// import { CheckCircleFilled } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { getWithDrawSetting, setWithDrawSetting } from './services';
import { IFormValues } from './data.d';
import './index.less';

const { TextArea } = Input;
const viewImg = (
  <div className="viewImg">
    <Image src={require('@/assets/withdrawBg.png')} alt="提现示例图" />
  </div>
);

const WithdrawSetting = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const getWithDrawSettings = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data } = await getWithDrawSetting({ keys: ['WITHDRAWAL'] });
      form.setFieldsValue(JSON.parse(data?.WITHDRAWAL));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  // 表单成功的回调
  const onFinish = async (values: IFormValues): Promise<void> => {
    try {
      await form.validateFields();
      await setWithDrawSetting({
        settingList: [{ key: 'WITHDRAWAL', value: JSON.stringify(values) }],
      });
      await getWithDrawSettings();
      message.success('提现设置成功');
    } catch (e) {
      console.error(e);
    }
  };

  // 线下支付
  // const handChangeCheckbox = (e: any, num: number) => {
  //   // console.log(e.target.checked);

  //   if (checkboxData.includes(num)) {
  //     setCheckboxData(checkboxData.filter((v) => v !== num));
  //   } else {
  //     setCheckboxData([...checkboxData, num]);
  //   }
  // };
  //  线上支付
  // const handClickeWeChat = () => {
  //   if (weChat === null) {
  //     setWeChat(true);
  //   } else {
  //     setWeChat(!weChat);
  //   }
  // };
  // const handClickeAlipay = () => {
  //   if (alipay === null) {
  //     setAlipay(true);
  //   } else {
  //     setAlipay(!alipay);
  //   }
  // };

  useEffect(() => {
    getWithDrawSettings();
  }, []);

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Spin spinning={loading}>
        <div className="withdrawalSettings">
          <div className="form">
            <Form
              form={form}
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 800 }}
              onFinish={onFinish}
              autoComplete="off"
              // labelCol: { style: { width: '150px' } },
            >
              <Form.Item
                label="最低提现金额"
                name="minimum"
                rules={[{ required: true, message: '请输入最低提现金额!' }]}
                extra="客户单次提现的最低金额，不能低于1元"
              >
                <Input addonAfter="元" />
              </Form.Item>

              <Form.Item
                label="同一客户单笔提现金额上限"
                name="maximum"
                rules={[{ required: true, message: '请输入单笔提现金额上限!' }]}
              >
                <Input addonAfter="元" />
              </Form.Item>
              <Form.Item
                label="提现服务费比例"
                name="serviceFeeRatio"
                extra="你可以向客户收取提现服务费，客户提现时自动从余额中扣除，填0表示不收取"
                rules={[{ required: true, message: '请输入提现服务费比例!' }]}
              >
                <Input addonAfter="%" />
              </Form.Item>
              <Form.Item
                label="提示信息"
                name="reminder"
                // rules={[{ required: true, message: '请输入提现服务费比例!' }]}
                className="label"
                extra={
                  <Tooltip
                    color="#fff"
                    placement="bottom"
                    title={viewImg}
                    overlayInnerStyle={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px',
                    }}
                  >
                    <Button type="link">查看示例</Button>
                  </Tooltip>
                }
              >
                <TextArea rows={4} showCount maxLength={20} />
              </Form.Item>

              {/* <Form.Item
              label="提现支持账户"
              className="label"
            >
              <div>
                <div className="text-size table-title">线上支付</div>
                <div className="form-table">
                  <div className="table-tr back-f8 tr-border-bottom">
                    <div className="text-size">店铺端口</div>
                    <div className="text-size">微信零钱</div>
                    <div className="text-size tr-border-rig-none">支付宝账户</div>
                  </div>
                  <div className="table-tr">
                    <div className="text-size">小程序商城</div>
                    <div> */}
              {/* <span
                      className={`text-size table-checkbox ${weChat === true ? 'active' : ''}`}
                      onClick={() => handClickeWeChat()}
                    /> */}
              {/* {weChat === true ? (
                        <CheckCircleFilled className="iconChecked" />
                      ) : (
                        <CheckCircleFilled className="iconRedio" />
                      )}
                      {weChat ? '已开启' : '未开启'}
                    </div>
                    <div className="tr-border-rig-none"> */}
              {/* <span
                      onClick={() => handClickeAlipay()}
                      className={`text-size table-checkbox ${alipay === true ? 'active' : ''}`}
                    /> */}
              {/* {alipay === true ? (
                        <CheckCircleFilled className="iconChecked" />
                      ) : (
                        <CheckCircleFilled className="iconRedio" />
                      )}

                      {alipay ? '已开启' : '未开启'}
                    </div>
                  </div>
                </div>
                <div className="text-size table-title">线下支付</div>
                <div className="form-table">
                  <div className="table-tr back-f8 tr-border-bottom">
                    <div className="text-size">银行卡转账</div>
                    <div className="text-size">微信转账</div>
                    <div className="text-size tr-border-rig-none">支付宝转账</div>
                  </div>
                  <div className="table-tr">
                    <div>
                      <Checkbox onChange={(e) => handChangeCheckbox(e, 1)} />
                    </div>
                    <div>
                      <Checkbox onChange={(e) => handChangeCheckbox(e, 2)} />
                    </div>
                    <div className="tr-border-rig-none">
                      <Checkbox onChange={(e) => handChangeCheckbox(e, 3)} />
                    </div>
                  </div>
                </div>
              </div>
            </Form.Item> */}
              {/* <Form.Item
              label="提现申请时间"
              name="upperTime"
              className="label"

            >
              <div>
                <Radio.Group>
                  <Radio value="1"> 任意时间 </Radio>
                  <Radio value="2"> 每周 </Radio>
                  <Radio value="3"> 每月 </Radio>
                </Radio.Group>
              </div>
            </Form.Item> */}
              <Form.Item wrapperCol={{ offset: 11, span: 20 }}>
                <Button type="primary" htmlType="submit">
                  设置
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Spin>
    </PageContainer>
  );
};

export default WithdrawSetting;
