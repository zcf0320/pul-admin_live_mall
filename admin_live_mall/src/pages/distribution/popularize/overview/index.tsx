import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { history } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import { QuestionCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import { DatePicker, Form, Select, Spin, Tooltip } from 'antd';

import { getSubtractDayTime, todayEndTime } from '@/pages/utils/getSubtractDayTime';

import { teamSituation } from './service';
import './index.less';

const promoteOrders = (
  <div style={{ color: '#000' }}>
    <div>今日新增客户数:</div>
    <div>所有团长直接发展的新客户数(含已成为团长的客户)</div>
  </div>
);
const selectProductTime = [
  { value: 'today', label: '今日', num: 0 },
  { value: 'lastDay', label: '昨日', num: 1 },
  { value: 'sevenDay', label: '近7天', num: 7 },
  { value: 'thirtyDay', label: '近30天', num: 30 },
  { value: 'custom', label: '自定义' },
  { value: 'natureDay', label: '自然日' },
  { value: 'month', label: '自然月' },
];
const { RangePicker } = DatePicker;
const datePickerArr = ['today', 'lastDay', 'natureDay'];
const rangePickerArr = ['sevenDay', 'thirtyDay', 'custom'];
const timeArr = ['custom', 'natureDay', 'month'];
const payment = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>支付统计:</div>
    <div>付款成功的推广订单，才会产生推广佣金(含标记收款的订单)</div>
  </div>
);
const refund = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>退款统计:</div>
    <div>结算前发生退款的推广订单，其佣金核算会减去相应的退款金额</div>
  </div>
);
const ordersPlaced = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>下单人数:</div>
    <div>统计时间内，产生推广订单的客户数，一人多次下单记为一人(不去除已退款订单)</div>
  </div>
);
const ordersTransactions = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>下单笔数:</div>
    <div>统计时间内，新产生的推广订单的笔数(不去除已退款订单)</div>
  </div>
);
const orderAmount = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>下单金额:</div>
    <div>统计时间内，新产生的推广订单的金额汇总(不去除已退款订单)</div>
  </div>
);
const payers = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>支付人数:</div>
    <div>统计时间内，推广订单成功付款的客户数，一人多次付款记为一人(不去除已退款订单)</div>
  </div>
);

const paymentOrders = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>支付订单数:</div>
    <div>统计时间内，成功付款的推广订单数(不去除已退款订单)</div>
  </div>
);

const paymentAmount = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>支付金额:</div>
    <div>统计时间内，成功付款的推广订单的金额汇总(不去除已退款订单)</div>
  </div>
);

const totalCommissionText = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>总佣金:</div>
    <div>
      在统计时间内成功付款的推广订单，当前可结算的佣金总额(含待结
      算和已结算)，结算前发生退款的订单，会重新核算佣金
    </div>
  </div>
);

const refunds = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>退款人数:</div>
    <div>统计时间内，推广订单已同意退款的客户数，一人多次退款记为一人</div>
  </div>
);
const refundFrequency = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>退款次数:</div>
    <div>统计时间内，推广订单同意退款的总次数，一个订单退了多次就记为多次</div>
  </div>
);
const refundAmount = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>退款金额:</div>
    <div>统计时间内，推广订单同意退款的金额汇总</div>
  </div>
);

const formatText = 'YYYY-MM-DD HH:mm:ss';
const Overview = () => {
  const [timeForm] = Form.useForm();
  const [time, setTime] = useState<string | string[] | any>();
  const [selectName, setSelectName] = useState<string>('今日');
  const [dateType, setDateType] = useState<string>('datePicker');
  const [loading, setLoading] = useState(false); //加载loading
  const [teamSituationInfo, setTeamSituationInfo] = useState<ITeamSituationInfo | undefined>();
  const FormTime = (props: { dateType: string }) => {
    //   选择日期
    const onChangeTime = (date: any, dateString: string[] | string) => {
      if (typeof dateString !== 'string') {
        const [startTime, endTime] = dateString;
        setTime([
          dayjs(startTime).startOf('day').format(formatText),
          dayjs(endTime).endOf('day').format(formatText),
        ]);
      } else {
        setTime([
          dayjs(dateString as string)
            .startOf('day')
            .format(formatText),
          dayjs(dateString as string)
            .endOf(dateType === 'month' ? 'month' : 'day')
            .format(formatText),
        ]);
      }
    };

    return (
      <Form form={timeForm} style={{ margin: '25px 0 0 0' }}>
        <Form.Item name="time" initialValue={dayjs()}>
          {props?.dateType === 'datePicker' || props?.dateType === 'month' ? (
            <DatePicker
              style={{ width: 200 }}
              onChange={(date, dateString) => onChangeTime(date, dateString)}
              picker={props?.dateType === 'month' ? 'month' : undefined}
            />
          ) : (
            <RangePicker style={{ width: 300 }} onChange={onChangeTime} />
          )}
        </Form.Item>
      </Form>
    );
  };
  //   选择自然日
  const handleChangeTime = async (value: string) => {
    setSelectName(value === 'today' ? '今日' : '');
    if (datePickerArr.includes(value)) {
      setDateType('datePicker');
    } else if (rangePickerArr.includes(value)) {
      setDateType('rangePicker');
    } else {
      setDateType('month');
    }
    timeForm.resetFields();
    const subtractDayNum = selectProductTime.find((item) => item.value === value)?.num;
    if (subtractDayNum !== undefined) {
      const { startTime = '' } = getSubtractDayTime(subtractDayNum);
      timeForm.setFieldValue(
        'time',
        datePickerArr.includes(value) ? dayjs(startTime) : [dayjs(startTime), dayjs(todayEndTime)],
      );
      setTime(
        datePickerArr.includes(value)
          ? [
              dayjs(startTime).startOf('day').format(formatText),
              dayjs(startTime).endOf('day').format(formatText),
            ]
          : [dayjs(startTime).format(formatText), dayjs(todayEndTime).format(formatText)],
      );
    }
    if (timeArr.includes(value)) {
      setTime('');
      timeForm.setFieldValue('time', '');
    }
  };

  // 获取概览详情
  const getTeamSituation = async () => {
    try {
      setLoading(true);
      const params = {
        startTime: time?.[0],
        endTime: time?.[1],
      };
      if (!params.endTime) return;
      const {
        data: { statistics = {}, summary = {} },
      } = await teamSituation(params);
      setTeamSituationInfo({
        ...statistics,
        ...summary,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { startTime = '', endTime = '' } = getSubtractDayTime(0, formatText);
    setTime([startTime, endTime]);
  }, []);

  useEffect(() => {
    getTeamSituation();
  }, [time]);

  const {
    totalCommission = 0,
    totalOrderAmount = 0,
    totalOrderUsers = 0,
    totalOrders = 0,
    totalPaidOrders = 0,
    totalPaymentAmount = 0,
    totalPaymentUsers = 0,
    totalRefundAmount = 0,
    totalRefundUsers = 0,
    totalRefunds = 0,
    countProduct = 0,
    countTeam = 0,
    countTeamToday = 0,
    countUserToday = 0,
  } = teamSituationInfo || {};

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className="Overview">
        <div className="footer-tab">
          <div className="footer-tab-conter">
            <div
              className="tab-content text-color"
              onClick={() => {
                history.push('/distribution/popularize/Product');
              }}
            >
              <div className="text-weight text-size">{countProduct}</div>
              <div>
                推广商品
                <RightCircleOutlined />
              </div>
            </div>
            <div
              className="tab-content text-color"
              onClick={() => {
                history.push('/distribution/popularize/PopularizeList', {
                  startTime: time?.[0],
                  endTime: time?.[1],
                });
              }}
            >
              <div className="text-weight text-size">{countTeam}</div>
              <div>
                团长总数
                <RightCircleOutlined />
              </div>
            </div>
            <div className="tab-content ">
              <div className="text-size text-weight">{countTeamToday}</div>
              <div>今日新增团长数</div>
            </div>

            <div className="tab-content border-rig-none">
              <div className="text-weight text-size">{countUserToday}</div>
              <div>
                今日新增客户数
                <Tooltip
                  title={promoteOrders}
                  color="#fff"
                  overlayInnerStyle={{ padding: '20px', width: '300px' }}
                >
                  <QuestionCircleOutlined
                    style={{ color: 'rgba(0,0,0,.65)', margin: '0 0 0 10px' }}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        <div className="real-data">
          <div className="real-header-title">
            <div>
              <span>推广订单</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Select
                defaultValue={selectName}
                style={{ width: 120, margin: '0  20px' }}
                onChange={handleChangeTime}
                options={selectProductTime}
              />

              <FormTime dateType={dateType} />
            </div>
          </div>
          {/* <Space style={{ width: '100%' }}> */}
          <Spin spinning={loading} style={{ width: '100%' }}>
            <div className="real-time">
              <div className="real-table">
                <div className="real-tr">
                  <div className="real-th real-left overview">下单统计</div>
                  <div className="real-right">
                    <div className="real-th boder-rig reacl-th-content">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            下单人数
                            <Tooltip
                              overlayInnerStyle={{ width: '400px' }}
                              placement="top"
                              color="#fff"
                              title={ordersPlaced}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                          <span className="flex-num">{totalOrderUsers}</span>
                        </div>
                      </div>
                    </div>
                    <div className="real-th boder-rig reacl-th-content backrgba">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            下单笔数
                            <Tooltip
                              overlayInnerStyle={{ width: '400px' }}
                              placement="top"
                              color="#fff"
                              title={ordersTransactions}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                          <span className="flex-num">{totalOrders}</span>
                        </div>
                      </div>
                    </div>
                    <div className="real-th boder-rig reacl-th-content">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            下单金额
                            <Tooltip
                              overlayInnerStyle={{ width: '400px' }}
                              placement="top"
                              color="#fff"
                              title={orderAmount}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                          <span className="flex-num">¥{totalOrderAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="real-tr">
                  <div className="real-th real-left traffic ">
                    <div>
                      支付统计
                      <Tooltip
                        overlayInnerStyle={{ width: '450px' }}
                        placement="top"
                        color="#fff"
                        title={payment}
                      >
                        <QuestionCircleOutlined className="table-icon" />
                      </Tooltip>
                    </div>
                  </div>
                  <div className="real-right">
                    <div className="real-th boder-rig reacl-th-content">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            支付人数
                            <Tooltip
                              overlayInnerStyle={{ width: '400px' }}
                              placement="top"
                              color="#fff"
                              title={payers}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                          <span className="flex-num">{totalPaymentUsers}</span>
                        </div>
                      </div>
                    </div>
                    <div className="real-th boder-rig reacl-th-content backrgba">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            支付订单数
                            <Tooltip
                              overlayInnerStyle={{ width: '470px' }}
                              placement="top"
                              color="#fff"
                              title={paymentOrders}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                          <span className="flex-num">{totalPaidOrders}</span>
                        </div>
                      </div>
                    </div>
                    <div className="real-th boder-rig reacl-th-content">
                      <div className="real-table-td-content">
                        <div className="flex ">
                          <span>
                            支付金额
                            <Tooltip
                              overlayInnerStyle={{ width: '500px' }}
                              placement="top"
                              color="#fff"
                              title={paymentAmount}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                          <span className="flex-num">¥{totalPaymentAmount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="real-th boder-rig reacl-th-content backrgba">
                      <div className="real-table-td-content">
                        <div className="flex flex-boder-rig">
                          <span>
                            总佣金
                            <Tooltip
                              overlayInnerStyle={{ width: '380px' }}
                              placement="top"
                              color="#fff"
                              title={totalCommissionText}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                          <span className="flex-num">¥{totalCommission}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="real-tr border-none">
                  <div className="real-th real-left conversion">
                    <div>
                      退款统计
                      <Tooltip
                        overlayInnerStyle={{ width: '450px' }}
                        placement="top"
                        color="#fff"
                        title={refund}
                      >
                        <QuestionCircleOutlined className="table-icon" />
                      </Tooltip>
                    </div>
                  </div>
                  <div className="real-right">
                    <div className="real-th boder-rig reacl-th-content">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            退款人数
                            <Tooltip
                              overlayInnerStyle={{ width: '500px' }}
                              placement="top"
                              color="#fff"
                              title={refunds}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                          <span className="flex-num">{totalRefundUsers}</span>
                        </div>
                      </div>
                    </div>
                    <div className="real-th boder-rig reacl-th-content backrgba">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            退款次数
                            <Tooltip
                              overlayInnerStyle={{ width: '450px' }}
                              placement="top"
                              color="#fff"
                              title={refundFrequency}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                          <span className="flex-num">{totalRefunds}</span>
                        </div>
                      </div>
                    </div>
                    <div className="real-th boder-rig reacl-th-content">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            退款金额
                            <Tooltip
                              overlayInnerStyle={{ width: '400px' }}
                              placement="top"
                              color="#fff"
                              title={refundAmount}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                          <span className="flex-num">¥{totalRefundAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Spin>
          {/* </Space> */}
        </div>
      </div>
    </PageContainer>
  );
};

export default Overview;
