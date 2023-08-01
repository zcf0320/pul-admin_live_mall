import { useEffect, useState } from 'react';
import { Button, Space, Spin, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getOverviewGoodsData } from './services';
import { OverviewGoodsDataType } from './data';
import { PageContainer } from '@ant-design/pro-components';
import './index.less';
import dayjs from 'dayjs';

const shelves = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>在架商品数:</div>
    <div>当前时间，状态为出售中的商品数量</div>
  </div>
);
const visited = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>被访商品数:</div>
    <div>统计时间内，商品详情页访问次数大于0的商品数量</div>
  </div>
);
const visitors = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>商品访客数:</div>
    <div>统计时间内，访问过任何商品详情页的人数，一人多次访问只记一人</div>
  </div>
);
const views = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>商品浏览量:</div>
    <div>统计时间内，所有商品详情页被访问的次数汇总，一人多次访问记为多次</div>
  </div>
);
const purchased = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>加购商品数:</div>
    <div>统计时间内，加入过购物车的商品数量，一个商品多人或多次加入只记一个</div>
  </div>
);
const ordered = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>下单商品数:</div>
    <div>统计时间内，成功下单的商品数量，一个商品多次下单只记一个</div>
  </div>
);
const paid = (
  <div style={{ color: '#000', padding: '10px' }}>
    <div>支付商品数:</div>
    <div>统计时间内，成功付款订单的商品数量，一个商品多次付款只记一个</div>
    <div>(货到付款订单商品交易完成后计入，不剔除退款订单)</div>
  </div>
);
// const selectProductTime = [
//   { value: 'today', label: '今日', num: 0 },
//   { value: 'lastDay', label: '昨日', num: 1 },
//   { value: 'sevenDay', label: '近7天', num: 7 },
//   { value: 'thrityDay', label: '近30天', num: 30 },
//   { value: 'custom', label: '自定义' },
//   { value: 'natureDay', label: '自然日' },
//   { value: 'month', label: '自然月' },
// ];
// const { RangePicker } = DatePicker;
// const datePickerArr = ['today', 'lastDay', 'natureDay'];
// const rangePickerArr = ['sevenDay', 'thrityDay', 'custom']; // 'natureMonth'
// const timeArr = ['custom', 'natureDay', 'month'];
const ProductOverview = () => {
  //const [selectName, setSelectName] = useState<string>('今日');
  //const [time, setTime] = useState<string | string[] | any>();
  const [toDay, setToDay] = useState<OverviewGoodsDataType>();
  // const [dateType, setDateType] = useState<string>('datePicker');
  const [loading, setLoading] = useState(false); //加载loading
  //const [timeForm] = Form.useForm();
  //   选择自然日
  // const handleChangeTime = (value: string) => {
  //   console.log(`selected ${value}`);
  //   setSelectName(value === 'today' ? '今日' : '');
  //   if (datePickerArr.includes(value)) {
  //     setDateType('datePicker');
  //   } else if (rangePickerArr.includes(value)) {
  //     setDateType('rangePicker');
  //   } else {
  //     setDateType('month');
  //   }
  //   timeForm.resetFields();
  //   const subtractDayNum = selectProductTime.find((item) => item.value === value)?.num;
  //   if (subtractDayNum !== undefined) {
  //     const { startTime = '' } = getSubtractDayTime(subtractDayNum);
  //     timeForm.setFieldValue(
  //       'time',
  //       datePickerArr.includes(value) ? dayjs(startTime) : [dayjs(startTime), dayjs(todayEndTime)],
  //     );
  //     setTime(
  //       datePickerArr.includes(value)
  //         ? dayjs(startTime).format('YYYY/MM/DD')
  //         : [dayjs(startTime).format('YYYY/MM/DD'), dayjs(todayEndTime).format('YYYY/MM/DD')],
  //     );
  //   }
  //   if (timeArr.includes(value)) {
  //     setTime('');
  //   }
  // };
  //
  // const FormTime = (props: { dateType: string }) => {
  //   //   选择日期
  //   const onChangeTime = (date: any, dateString: string[] | string) => {
  //     setTime(dateString);
  //   };
  //   return (
  //     <Form form={timeForm} style={{ margin: '25px 0 0 0' }}>
  //       <Form.Item name="time">
  //         {props?.dateType === 'datePicker' || props?.dateType === 'month' ? (
  //           <DatePicker
  //             style={{ width: 200 }}
  //             onChange={onChangeTime}
  //             picker={props?.dateType === 'month' ? 'month' : undefined}
  //           />
  //         ) : (
  //           <RangePicker style={{ width: 300 }} onChange={onChangeTime} />
  //         )}
  //       </Form.Item>
  //     </Form>
  //   );
  // };

  // 获取数据
  const getGoodsData = () => {
    setLoading(true);
    getOverviewGoodsData()
      .then((res) => {
        setToDay(res.data?.today);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getGoodsData();
  }, []);
  // useEffect(() => {
  //   if (selectName === '今日') {
  //     const { startTime = '' } = getSubtractDayTime(0);
  //     timeForm.setFieldValue('time', dayjs(startTime));
  //   }
  // }, []);
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className="ProductOverview">
        {/* <div className="header-title">商品概览</div> */}

        <div className="real-data">
          <div className="real-header-title">
            <div>商品概览</div>
            <div className="update-time">
              <span>今日数据更新时间：{dayjs().format('YYYY-MM-DD HH:mm:ss')}</span>
              <Button type="link" onClick={() => getGoodsData()}>
                刷新
              </Button>
            </div>
            {/*<div style={{ display: 'flex', alignItems: 'center' }}>*/}
            {/*  <Select*/}
            {/*    defaultValue={selectName}*/}
            {/*    style={{ width: 120, margin: '0  20px' }}*/}
            {/*    onChange={handleChangeTime}*/}
            {/*    options={selectProductTime}*/}
            {/*  />*/}

            {/*  <FormTime dateType={dateType} />*/}
            {/*</div>*/}

            {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div></div>
            </div> */}
          </div>
          <Space style={{ width: '100%' }}>
            <Spin spinning={loading} style={{ width: '100%' }}>
              <div className="real-time">
                <div className="real-table">
                  <div className="real-tr">
                    <div className="real-th real-left overview">
                      <img src={require('@/assets/datagoods_1.png')} alt="" />
                      <div>商品概况</div>
                    </div>
                    <div className="real-right">
                      <div className="real-th boder-rig reacl-th-content">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>
                              在架商品数
                              <Tooltip
                                overlayInnerStyle={{ width: '400px' }}
                                placement="top"
                                color="#fff"
                                title={shelves}
                              >
                                <QuestionCircleOutlined className="table-icon" />
                              </Tooltip>
                            </span>
                          </div>
                          <div className="flex ma-15">
                            <span>{toDay?.onSell ?? '-'}</span>
                            {/* <span></span> */}
                          </div>
                          {/* <div className=" col-ccc">
                        <span>较前一日</span>
                        <span>0</span>
                      </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="real-tr">
                    <div className="real-th real-left traffic ">
                      <img src={require('@/assets/datagoods_2.png')} alt="" />
                      <div>商品流量</div>
                    </div>
                    <div className="real-right">
                      <div className="real-th reacl-th-content">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>
                              被访商品数
                              <Tooltip
                                overlayInnerStyle={{ width: '400px' }}
                                placement="top"
                                color="#fff"
                                title={visited}
                              >
                                <QuestionCircleOutlined className="table-icon" />
                              </Tooltip>
                            </span>
                          </div>
                          <div className="flex ma-15">
                            <span>{toDay?.num ?? '-'}</span>
                          </div>
                          {/* <div className=" col-ccc">
                        <span>较前一日</span>
                        <span>0</span>
                      </div> */}
                        </div>
                      </div>
                      <div className="real-th reacl-th-content">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>
                              商品访客数
                              <Tooltip
                                overlayInnerStyle={{ width: '470px' }}
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
                          </div>
                          {/* <div className=" col-ccc">
                        <span>较前一日</span>
                        <span>0</span>
                      </div> */}
                        </div>
                      </div>
                      <div className="real-th boder-rig reacl-th-content">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>
                              商品浏览量
                              <Tooltip
                                overlayInnerStyle={{ width: '500px' }}
                                placement="top"
                                color="#fff"
                                title={views}
                              >
                                <QuestionCircleOutlined className="table-icon" />
                              </Tooltip>
                            </span>
                          </div>
                          <div className="flex ma-15">
                            <span>{toDay?.pv ?? '-'}</span>
                          </div>
                          {/* <div className=" col-ccc">
                        <span>较前一日</span>
                        <span>0</span>
                      </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="real-tr border-none">
                    <div className="real-th real-left conversion">
                      <img src={require('@/assets/datagoods_3.png')} alt="" />
                      <div>商品转化</div>
                    </div>
                    <div className="real-right">
                      <div className="real-th reacl-th-content">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>
                              加购商品数
                              <Tooltip
                                overlayInnerStyle={{ width: '500px' }}
                                placement="top"
                                color="#fff"
                                title={purchased}
                              >
                                <QuestionCircleOutlined className="table-icon" />
                              </Tooltip>
                            </span>
                          </div>
                          <div className="flex ma-15">
                            <span>{toDay?.addCartCount ?? '-'}</span>
                          </div>
                          {/* <div className=" col-ccc">
                        <span>较前一日</span>
                        <span>0</span>
                      </div> */}
                        </div>
                      </div>
                      <div className="real-th reacl-th-content">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>
                              下单商品数
                              <Tooltip
                                overlayInnerStyle={{ width: '450px' }}
                                placement="top"
                                color="#fff"
                                title={ordered}
                              >
                                <QuestionCircleOutlined className="table-icon" />
                              </Tooltip>
                            </span>
                          </div>
                          <div className="flex ma-15">
                            <span>{toDay?.placeCount ?? '-'}</span>
                            {/* <span></span> */}
                          </div>
                          {/* <div className=" col-ccc">
                        <span>较前一日</span>
                        <span>0</span>
                      </div> */}
                        </div>
                      </div>
                      <div className="real-th boder-rig reacl-th-content">
                        <div className="real-table-td-content">
                          <div className="flex">
                            <span>
                              支付商品数
                              <Tooltip
                                overlayInnerStyle={{ width: '500px' }}
                                placement="top"
                                color="#fff"
                                title={paid}
                              >
                                <QuestionCircleOutlined className="table-icon" />
                              </Tooltip>
                            </span>
                          </div>
                          <div className="flex ma-15">
                            <span>{toDay?.payCount ?? '-'}</span>
                          </div>
                          {/* <div className=" col-ccc">
                        <span>较前一日</span>
                        <span>0</span>
                      </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Spin>
          </Space>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProductOverview;
