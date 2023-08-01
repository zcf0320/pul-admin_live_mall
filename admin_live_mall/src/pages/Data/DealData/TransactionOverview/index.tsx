import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Button, Spin, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { getOverviewTradeData } from './services';
import { tranComputerDataType, transactionDataType } from './data';
import { dataComputer } from '../../utils/computer';
import './index.less';

const visitors = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>访客数:</div>
    <div>统计时间内的进店人数，一人多次进店只记一人</div>
  </div>
);
const people = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>下单人数:</div>
    <div>统计时间内，成功下单的客户数，一人多次下单只记一人(不剔除退款订单)</div>
  </div>
);
const transactions = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>下单笔数:</div>
    <div>统计时间内，新创建的订单笔数(不剔除退款订单)</div>
  </div>
);
const amount = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>下单金额:</div>
    <div>统计时间内，新创建订单的金额汇总(不剔除退款金额)</div>
  </div>
);
const payers = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>支付人数:</div>
    <div>统计时间内，成功付款订单的客户数，一人多次付款只记一人</div>
    <div>(货到付款订单交易完成后计入，不剔除退款订单)</div>
  </div>
);
const paymentOrders = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>支付订单数:</div>
    <div>统计时间内，成功付款的订单数</div>
    <div>(货到付款订单交易完成后计入付款订单，不剔除退款订单)</div>
  </div>
);
const paymentAmount = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>支付金额:</div>
    <div>统计时间内，成功付款订单的金额汇总</div>
    <div>(货到付款订单交易完成后计入支付金额，不剔除退款金额)</div>
  </div>
);
const quantity = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>支付件数:</div>
    <div>统计时间内，成功付款订单包含的商品数量汇总</div>
    <div>(货到付款订单交易完成后计入，不剔除退款订单)</div>
  </div>
);

const customerUnitPrice = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>客单价:</div>
    <div> 客单价 = 支付金额 / 支付人数</div>
  </div>
);
// const selectTimeType = [
//   { value: '1', label: '自然日' },
//   { value: '2', label: '自然月' },
//   { value: '3', label: '自定义' },
// ];
// const { RangePicker } = DatePicker;

const TransactionOverview = () => {
  //const [selectType, setSelectType] = useState('');
  const [selectTime] = useState('1');
  const [toDay, setToDay] = useState<transactionDataType | undefined>(); //今日
  const [loading, setLoading] = useState(false); //加载loading
  const [selectTimeText, setSelectTimeText] = useState<string>('日'); // 切换时间
  const [flagText, setFlagText] = useState<boolean>(true); //隐藏文字开关
  const [transactionData, setTransactionData] = useState<tranComputerDataType>({
    payedNum: '',
    payedUserNum: '',
    pv: '',
    refundAmount: '',
    regMemberNum: '',
    totalAmount: '',
    turnover: '',
    unitAmount: '',
    uv: '',
  });

  // const [time, setTime] = useState<string[] | string>();
  // 选择类型
  // const handleChange = (value: string) => {
  //   console.log(`selected ${value}`);
  //   setSelectType(value);
  //   console.log(selectType);
  // };
  // //   选择自然日
  // const handleChangeTime = (value: string) => {
  //   console.log(`selected ${value}`);
  //   setSelectTime(value);
  // };
  // //   选择日期
  // const onChangeTime = (date: any, dateString: string | string[], type: string) => {
  //   if (type === 'day') {
  //     setTime(dateString);
  //   } else if (type === 'month') {
  //     setTime(dateString);
  //   } else if (type === 'picker') {
  //     setTime(dateString);
  //   }
  // };

  const getComputer = (fisterNum: string = '', lastNum: string = '') => {
    if (Number(fisterNum) === 0 && Number(lastNum) === 0) {
      return 0;
    }
    return ((Number(lastNum) / Number(fisterNum)) * 100).toFixed(2);
  };
  // 获取数据
  const getTradeData = () => {
    setLoading(true);
    getOverviewTradeData()
      .then((res) => {
        const {
          data: { today = {}, yesterday = {} },
        } = res;
        setToDay(today);

        // 比例计算
        setTransactionData(dataComputer(today, yesterday));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getTradeData();
  }, []);
  useEffect(() => {
    if (selectTime === '1') {
      setSelectTimeText('日');
      setFlagText(true);
    } else if (selectTime === '2') {
      setSelectTimeText('月');
      setFlagText(true);
    } else if (selectTime === '3') {
      setFlagText(!flagText);
    }
  }, [selectTime]);

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className="TransactionOverview">
        <Spin spinning={loading} style={{ width: '100%' }}>
          <div className="real-data">
            <div className="real-header-title">
              <div>交易概况</div>
              <div className="update-time">
                <span>今日数据更新时间：{dayjs().format('YYYY-MM-DD HH:mm:ss')}</span>
                <Button type="link" onClick={() => getTradeData()}>
                  刷新
                </Button>
              </div>
              {/*<div>*/}
              {/*  <Select*/}
              {/*    defaultValue="lucy"*/}
              {/*    style={{ width: 120 }}*/}
              {/*    onChange={handleChange}*/}
              {/*    options={[*/}
              {/*      { value: 'jack', label: 'Jack' },*/}
              {/*      { value: 'lucy', label: 'Lucy' },*/}
              {/*      { value: 'Yiminghe', label: 'yiminghe' },*/}
              {/*    ]}*/}
              {/*  />*/}
              {/*  <Select*/}
              {/*    defaultValue="自然日"*/}
              {/*    style={{ width: 120, margin: '0 20px 0 20px' }}*/}
              {/*    onChange={handleChangeTime}*/}
              {/*    options={selectTimeType}*/}
              {/*  />*/}
              {/*  /!* <DatePicker onChange={onChange} picker="month" /> *!/*/}
              {/*  {flagText ? (*/}
              {/*    <DatePicker*/}
              {/*      style={{ width: 200 }}*/}
              {/*      onChange={(date, dateString) =>*/}
              {/*        onChangeTime(date, dateString, selectTimeText === '日' ? 'day' : 'month')*/}
              {/*      }*/}
              {/*      picker={selectTimeText === '日' ? undefined : 'month'}*/}
              {/*    />*/}
              {/*  ) : (*/}
              {/*    <RangePicker*/}
              {/*      onChange={(date, dateString) => onChangeTime(date, dateString, 'picker')}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*</div>*/}
            </div>

            <div className="real-time">
              <div className="real-table">
                <div className="real-tr">
                  <div className="real-right">
                    <div className="real-th boder-rig reacl-th-content">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            访客数
                            <Tooltip
                              overlayInnerStyle={{ width: '400px' }}
                              placement="top"
                              color="#fff"
                              title={visitors}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                        </div>
                        <div className="flex ma-15">
                          <span>{toDay?.uv ?? '-'}</span>
                          {/* <span></span> */}
                        </div>
                        {flagText ? (
                          <div className=" col-ccc">
                            <span>较前一{selectTimeText}</span>
                            <span>{transactionData?.uv ?? '-'}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="real-tr">
                  <div className="real-right">
                    <div className="real-th reacl-th-content">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            下单人数
                            <Tooltip
                              overlayInnerStyle={{ width: '500px' }}
                              placement="top"
                              color="#fff"
                              title={people}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                        </div>
                        <div className="flex ma-15">
                          <span>{toDay?.payedUserNum ?? '-'}</span>
                        </div>
                        {flagText ? (
                          <div className=" col-ccc">
                            <span>较前一{selectTimeText}</span>
                            <span>{transactionData?.payedUserNum ?? '-'}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="real-th reacl-th-content">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            下单笔数
                            <Tooltip
                              overlayInnerStyle={{ width: '400px' }}
                              placement="top"
                              color="#fff"
                              title={transactions}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                        </div>
                        <div className="flex ma-15">
                          <span>{toDay?.payedNum ?? '-'}</span>
                        </div>
                        {flagText ? (
                          <div className=" col-ccc">
                            <span>较前一{selectTimeText}</span>
                            <span>{transactionData?.payedNum ?? '-'}</span>
                          </div>
                        ) : null}
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
                              title={amount}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                        </div>
                        <div className="flex ma-15">
                          <span>{toDay?.totalAmount ?? '-'}</span>
                        </div>
                        {flagText ? (
                          <div className=" col-ccc">
                            <span>较前一{selectTimeText}</span>
                            <span>{transactionData?.totalAmount ?? '-'}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="real-tr border-none">
                  <div className="real-right">
                    <div className="real-th reacl-th-content">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            支付人数
                            <Tooltip
                              overlayInnerStyle={{ width: '420px' }}
                              placement="top"
                              color="#fff"
                              title={payers}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                        </div>
                        <div className="flex ma-15">
                          <span>{toDay?.payedUserNum ?? '-'}</span>
                        </div>
                        {flagText ? (
                          <div className=" col-ccc">
                            <span>较前一{selectTimeText}</span>
                            <span>{transactionData?.payedUserNum ?? '-'}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="real-th reacl-th-content">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            支付订单数
                            <Tooltip
                              overlayInnerStyle={{ width: '400px' }}
                              placement="top"
                              color="#fff"
                              title={paymentOrders}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                        </div>
                        <div className="flex ma-15">
                          <span>{toDay?.payedNum ?? '-'}</span>
                          {/* <span></span> */}
                        </div>
                        {flagText ? (
                          <div className=" col-ccc">
                            <span>较前一{selectTimeText}</span>
                            <span>{transactionData?.payedNum ?? '-'}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="real-th reacl-th-content">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            支付金额(元)
                            <Tooltip
                              overlayInnerStyle={{ width: '400px' }}
                              placement="top"
                              color="#fff"
                              title={paymentAmount}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                        </div>
                        <div className="flex ma-15">
                          <span>{toDay?.totalAmount ?? '-'}</span>
                        </div>
                        {flagText ? (
                          <div className=" col-ccc">
                            <span>较前一{selectTimeText}</span>
                            <span>{transactionData?.totalAmount ?? '-'}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="real-th reacl-th-content">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            支付件数
                            <Tooltip
                              overlayInnerStyle={{ width: '400px' }}
                              placement="top"
                              color="#fff"
                              title={quantity}
                            >
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                        </div>
                        <div className="flex ma-15">
                          <span>{toDay?.payedNum ?? '-'}</span>
                        </div>
                        {flagText ? (
                          <div className=" col-ccc">
                            <span>较前一{selectTimeText}</span>
                            <span>{transactionData?.payedNum ?? '-'}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="real-th boder-rig reacl-th-content ">
                      <div className="real-table-td-content">
                        <div className="flex">
                          <span>
                            客单价(元)
                            <Tooltip placement="top" color="#fff" title={customerUnitPrice}>
                              <QuestionCircleOutlined className="table-icon" />
                            </Tooltip>
                          </span>
                        </div>
                        <div className="flex ma-15">
                          <span>{toDay?.unitAmount ?? '-'}</span>
                        </div>
                        {flagText ? (
                          <div className=" col-ccc">
                            <span>较前一{selectTimeText}</span>
                            <span>{transactionData?.unitAmount ?? '-'}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="data-img">
                <img src={require('@/assets/datacenter.png')} alt="" />
                <div className="visility">访客</div>
                <div className="order">下单</div>
                <div className="pay">付款</div>
                <div className="rate-1">
                  <div>转化率</div>
                  <span>0%</span>
                </div>
                <div className="rate-2">
                  <div>转化率</div>
                  <span>0%</span>
                </div>
                <div className="rate-3">
                  <div>转化率</div>
                  <span>{getComputer(toDay?.uv, toDay?.payedUserNum)}%</span>
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </div>
    </PageContainer>
  );
};

export default TransactionOverview;
