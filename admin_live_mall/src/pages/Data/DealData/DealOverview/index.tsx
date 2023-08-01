import { useEffect, useState } from 'react';
import moment from 'moment';
import { getOverviewTodayData } from './services';
import { Button, Space, Spin, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { OverviewDataType } from './data';
import { dataComputer } from '../../utils/computer';
import { PageContainer } from '@ant-design/pro-components';
import './index.less';

const visitors = (
  <div
    style={{
      color: '#000',
      padding: '10px',
    }}
  >
    <div>访客数:</div>
    <div>统计时间内的进店人数，一人多次进店只记一人</div>
  </div>
);
const pageView = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>浏览量:</div>
    <div>今天内，店内所有页面被访问次数的汇总，一人访问多次记为多次</div>
  </div>
);
const paymentOrders = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>支付订单数:</div>
    <div>今天成功付款的订单数</div>
    <div>(货到付款订单交易完成后计入付款订单，不剔除退款订单)</div>
  </div>
);
const paymentAmount = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>支付金额:</div>
    <div>今天成功付款订单的金额汇总</div>
    <div>(货到付款订单交易完成后计入支付金额，不剔除退款金额)</div>
  </div>
);
const refundedAmount = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>成功退款金额:</div>
    <div>今天成功退款的订单金额汇总</div>
  </div>
);
const turnover = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>营业额:</div>
    <div>营业额 = 支付金额 - 成功退款金额</div>
  </div>
);
const customerUnitPrice = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>客单价:</div>
    <div>客单价 = 支付金额 / 支付客户数</div>
  </div>
);
const paidCustomers = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>支付客户数:</div>
    <div>今天成功付款订单的客户数，一人多次付款只记一人</div>
    <div>(货到付款订单交易完成后计入，不剔除退款订单)</div>
  </div>
);
const DealOverview = () => {
  const [loading, setLoading] = useState(false); //加载loading
  const [toDay, setToDay] = useState<OverviewDataType>(); //今日
  const [yesterDay, setYesterDay] = useState<OverviewDataType>(); //昨日
  const [dealData, setDealData] = useState({
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
  // 获取数据
  const getOverviewData = () => {
    setLoading(true);
    getOverviewTodayData()
      .then((res) => {
        setToDay(res.data?.today);
        setDealData(dataComputer(res.data?.today, res.data?.yesterday));
        setYesterDay(res.data?.yesterday);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 刷新
  const handReload = () => {
    getOverviewData();
  };
  useEffect(() => {
    getOverviewData();
  }, []);
  return (
    <PageContainer
      header={{
        breadcrumb: undefined,
      }}
    >
      <div className="DealOverview">
        {/* <div className="header-title">今日概况</div> */}
        <div className="update-time">
          <span>今日数据更新时间：{moment().format('YYYY-MM-DD HH:mm:ss')}</span>
          <Button type="link" onClick={() => handReload()}>
            刷新
          </Button>
        </div>

        <Space style={{ width: '100%' }}>
          <Spin spinning={loading} style={{ width: '100%' }}>
            <div className="real-data">
              <div className="real-header-title">实时数据</div>
              <div className="real-time">
                <div className="real-table">
                  <div className="real-tr">
                    <div className="real-th">
                      <div className="flow real-left">
                        流量
                        <img src={require('@/assets/datapage_1.png')} alt="" />
                      </div>
                    </div>

                    <div className="real-right">
                      <div className="real-th reacl-th-content">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>访客数</span>
                            <Tooltip
                              placement="top"
                              color="#fff"
                              title={visitors}
                              overlayInnerStyle={{ width: '400px' }}
                            >
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </div>
                          <div className="flex mar-30">
                            <span>{toDay?.uv ?? '-'}</span>
                            <span></span>
                          </div>
                          <div className="flex col-ccc">
                            <span>昨日全天</span>
                            <span>{yesterDay?.uv ?? '-'}</span>
                          </div>
                          <div className="flex mt-30 col-ccc">
                            <span>占昨日全天</span>
                            <span>{dealData?.uv ?? '-'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="real-th reacl-th-content">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>浏览量</span>

                            <Tooltip
                              overlayInnerStyle={{ width: '450px' }}
                              placement="top"
                              color="#fff"
                              title={pageView}
                            >
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </div>
                          <div className="flex mar-30">
                            <span>{toDay?.pv ?? '-'}</span>
                            <span></span>
                          </div>
                          <div className="flex col-ccc">
                            <span>昨日全天</span>
                            <span>{yesterDay?.pv ?? '-'}</span>
                          </div>
                          <div className="flex mt-30 col-ccc">
                            <span>占昨日全天</span>
                            <span>{dealData?.pv ?? '-'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="real-th reacl-th-content reacl-th-none"></div>
                      <div className="real-th reacl-th-content reacl-th-none"></div>
                      <div className="real-th reacl-th-content reacl-th-none"></div>
                    </div>
                  </div>
                  <div className="real-tr">
                    <div className="real-th">
                      <div className=" transaction real-left">
                        成交
                        <img src={require('@/assets/datapage_2.png')} alt="" />
                      </div>
                    </div>

                    <div className="real-right">
                      <div className="real-th reacl-th-content">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>支付订单数</span>

                            <Tooltip
                              overlayInnerStyle={{ width: '400px' }}
                              placement="top"
                              color="#fff"
                              title={paymentOrders}
                            >
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </div>
                          <div className="flex mar-30">
                            <span>{toDay?.payedNum ?? '-'}</span>
                            <span></span>
                          </div>
                          <div className="flex col-ccc">
                            <span>昨日全天</span>
                            <span>{yesterDay?.payedNum ?? '-'}</span>
                          </div>
                          <div className="flex mt-30 col-ccc">
                            <span>占昨日全天</span>
                            <span>{dealData?.payedNum ?? '-'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="real-th reacl-th-content">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>支付金额(元)</span>
                            <Tooltip
                              overlayInnerStyle={{ width: '400px' }}
                              placement="top"
                              color="#fff"
                              title={paymentAmount}
                            >
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </div>
                          <div className="flex mar-30">
                            <span>{toDay?.totalAmount ?? '-'}</span>
                            <span></span>
                          </div>
                          <div className="flex col-ccc">
                            <span>昨日全天</span>
                            <span>{yesterDay?.totalAmount ?? '-'}</span>
                          </div>
                          <div className="flex mt-30 col-ccc">
                            <span>占昨日全天</span>
                            <span>{dealData?.totalAmount ?? '-'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="real-th reacl-th-content">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>成功退款金额(元)</span>
                            <Tooltip placement="top" color="#fff" title={refundedAmount}>
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </div>
                          <div className="flex mar-30">
                            <span>{toDay?.refundAmount ?? '-'}</span>
                            <span></span>
                          </div>
                          <div className="flex col-ccc">
                            <span>昨日全天</span>
                            <span>{yesterDay?.refundAmount ?? '-'}</span>
                          </div>
                          <div className="flex mt-30 col-ccc">
                            <span>占昨日全天</span>
                            <span>{dealData?.refundAmount ?? '-'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="real-th reacl-th-content">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>营业额(元)</span>
                            <Tooltip placement="top" color="#fff" title={turnover}>
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </div>
                          <div className="flex mar-30">
                            <span>{toDay?.turnover ?? '-'}</span>
                            <span></span>
                          </div>
                          <div className="flex col-ccc">
                            <span>昨日全天</span>
                            <span>{yesterDay?.turnover ?? '-'}</span>
                          </div>
                          <div className="flex mt-30 col-ccc">
                            <span>占昨日全天</span>
                            <span>{dealData?.turnover ?? '-'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="real-th boder-rig reacl-th-content ">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>客单价(元)</span>
                            <Tooltip placement="top" color="#fff" title={customerUnitPrice}>
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </div>
                          <div className="flex mar-30">
                            <span>{toDay?.unitAmount ?? '-'}</span>
                            <span></span>
                          </div>
                          <div className="flex col-ccc">
                            <span>昨日全天</span>
                            <span>{yesterDay?.unitAmount ?? '-'}</span>
                          </div>
                          <div className="flex mt-30 col-ccc">
                            <span>占昨日全天</span>
                            <span>{dealData?.unitAmount ?? '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="real-tr border-none">
                    <div className="real-th">
                      <div className=" customer real-left">
                        客户
                        <img src={require('@/assets/datapage_3.png')} alt="" />
                      </div>
                    </div>
                    <div className="real-right">
                      <div className="real-th reacl-th-content">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>新增客户数</span>
                          </div>
                          <div className="flex mar-30">
                            <span>{toDay?.regMemberNum ?? '-'}</span>
                            <span></span>
                          </div>
                          <div className="flex col-ccc">
                            <span>昨日全天</span>
                            <span>{yesterDay?.regMemberNum ?? '-'}</span>
                          </div>
                          <div className="flex mt-30 col-ccc">
                            <span>占昨日全天</span>
                            <span>{dealData?.regMemberNum ?? '-'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="real-th reacl-th-content">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>支付客户数</span>
                            <Tooltip
                              overlayInnerStyle={{ width: '400px' }}
                              placement="top"
                              color="#fff"
                              title={paidCustomers}
                            >
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </div>
                          <div className="flex mar-30">
                            <span>{toDay?.payedUserNum ?? '-'}</span>
                            <span></span>
                          </div>
                          <div className="flex col-ccc">
                            <span>昨日全天</span>
                            <span>{yesterDay?.payedUserNum ?? '-'}</span>
                          </div>
                          <div className="flex mt-30 col-ccc">
                            <span>占昨日全天</span>
                            <span>{dealData?.payedUserNum ?? '-'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="real-th reacl-th-content reacl-th-none"></div>
                      <div className="real-th reacl-th-content reacl-th-none"></div>
                      <div className="real-th reacl-th-content reacl-th-none"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Spin>
        </Space>
      </div>
    </PageContainer>
  );
};

export default DealOverview;
