import { useRef, useState } from 'react';
import { Button, DatePicker, Form, Tooltip } from 'antd';
import { getSubtractDayTime, todayEndTime } from '@/pages/utils/getSubtractDayTime';
import dayjs from 'dayjs';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { SettlementDataType, TableListItem } from './data';
import { getPageList } from './services';
import { history } from '@umijs/max';
import './index.less';

const { RangePicker } = DatePicker;

const items = [
  {
    name: '昨天',
    time: 1,
  },
  {
    name: '近七天',
    time: 7,
  },
  {
    name: '近30天',
    time: 30,
  },
];
const promoteOrders = (
  <div style={{ color: '#000' }}>
    <div>统计时间内，店铺已结算给所有角色的所有收益之和</div>
  </div>
);
const totalCommission = (
  <div style={{ color: '#000' }}>
    <div>统计时间内，店铺已结算佣金的平均佣金比例 = 结算总佣金 / 结算订单额 * 100%</div>
  </div>
);

const Statistics = () => {
  const [time, setTime] = useState<any>(['', '']);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [tableActiveIndex, setTableActiveIndex] = useState<number>(1);
  const [timeType, setTimeType] = useState<number>(1);
  const [settlementData, setSettlementData] = useState<SettlementDataType>({
    commissionTotal: '',
    orderAmount: '',
    orderCount: 0,
    perCapitaIncome: '',
    userCount: 0,
  });
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '结算时间',
      width: 120,
      dataIndex: timeType === 1 ? 'settleDay' : 'settleMonthly',
    },
    {
      title: '结算订单数',
      dataIndex: 'orderCount',
      width: 80,
    },
    {
      title: '结算订单额',
      width: 80,
      dataIndex: 'orderAmount',
    },
    {
      title: '结算总佣金',
      width: 80,
      dataIndex: 'commissionTotal',
    },
    {
      title: '结算人数',
      width: 80,
      dataIndex: 'userCount',
    },
    {
      title: '人均收益',
      width: 80,
      dataIndex: 'perCapitaIncome',
    },
    {
      title: '操作',
      width: 80,
      dataIndex: 'option',
      render: (text, record) => [
        <a
          key="link"
          onClick={() => {
            history.push('/distribution/earningReport/SettlementDetails', {
              time:
                timeType === 1
                  ? { dayTime: record?.settleDay, type: 'day' }
                  : { dayTime: record?.settleMonthly, type: 'month' },
            });
          }}
        >
          详情
        </a>,
      ],
    },
  ];
  //   时间回调
  const handChangeTime = (e: any, day: string[]) => {
    setTime(day);
  };
  //   筛选
  const handScreen = () => {
    actionRef.current?.reload();
  };

  //  设置时间
  const setFormTime = (timeNum: number) => {
    setActiveIndex(timeNum);
    let currentTime = null;
    currentTime = getSubtractDayTime(timeNum);
    if (timeNum !== 1) {
      currentTime = {
        ...currentTime,
        endTime: todayEndTime,
      };
    }
    setTime([
      dayjs(currentTime.startTime).format('YYYY-MM-DD HH:mm:ss'),
      dayjs(currentTime.endTime).format('YYYY-MM-DD HH:mm:ss'),
    ]);
    form.setFieldValue('time', [dayjs(currentTime.startTime), dayjs(currentTime.endTime)]);
  };
  const getComputer = (fisterNum: string = '', lastNum: string = '') => {
    if (Number(fisterNum) === 0 && Number(lastNum) === 0) {
      return 0;
    }
    return ((Number(fisterNum) / Number(lastNum)) * 1).toFixed(2);
  };
  return (
    <div className="Statistics">
      <div className="main">
        <div className="main-form">
          <div className="form-time">
            <Form name="basic" initialValues={{ remember: true }} autoComplete="off" form={form}>
              <Form.Item
                label="结算时间"
                name="time"
                // rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <RangePicker onChange={(e, day) => handChangeTime(e, day)} showTime />
              </Form.Item>
            </Form>
            <div>
              {items.length &&
                items.map((v, i) => {
                  return (
                    <span
                      style={{ margin: '0 10px' }}
                      key={i}
                      className={`${activeIndex === v.time ? 'active' : ''}`}
                      onClick={() => setFormTime(v.time)}
                    >
                      {v.name}
                    </span>
                  );
                })}
            </div>
          </div>
          <div className="settlement-form-btn">
            <Button type="primary" onClick={() => handScreen()}>
              筛选
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setActiveIndex(0);
                setTime(['', '']);
                setTimeType(1);
                actionRef.current?.reload();
              }}
            >
              重置
            </Button>
          </div>
        </div>
      </div>
      <div className="footer-tab">
        <div className="footer-tab-conter">
          <div className="tab-content">
            <div>结算订单数(笔)</div>
            <div className="text-weight text-size">{settlementData?.orderCount}</div>
          </div>
          <div className="tab-content">
            <div>结算订单额(元)</div>
            <div className="text-weight text-size">{settlementData?.orderAmount}</div>
          </div>
          <div className="tab-content ">
            <div>结算总佣金(元)</div>
            <div className="flex-icon">
              <span className="text-size text-weight">{settlementData?.commissionTotal}</span>
              <Tooltip
                title={promoteOrders}
                color="#fff"
                overlayInnerStyle={{ padding: '20px', width: '400px' }}
              >
                <QuestionCircleOutlined
                  style={{ color: 'rgba(0,0,0,.65)', margin: '0 0 0 10px' }}
                />
              </Tooltip>
            </div>
            <div className="flex-icon">
              <span className="text-size">
                {getComputer(settlementData?.commissionTotal, settlementData?.orderAmount)}%
              </span>
              <Tooltip
                title={totalCommission}
                color="#fff"
                overlayInnerStyle={{ padding: '20px', width: '400px' }}
              >
                <QuestionCircleOutlined
                  style={{ color: 'rgba(0,0,0,.65)', margin: '0 0 0 10px' }}
                />
              </Tooltip>
            </div>
          </div>
          <div className="tab-content">
            <div>结算人数(人)</div>
            <div className="text-weight text-size">{settlementData?.userCount}</div>
          </div>
          <div className="tab-content border-rig-none">
            <div>人均受益(元)</div>
            <div className="text-weight text-size">{settlementData?.perCapitaIncome}</div>
          </div>
        </div>
      </div>
      <div className="table-content">
        <ProTable<TableListItem>
          request={async (params) => {
            const res = await getPageList({
              endTime: time?.[1] !== '' ? dayjs(time?.[1]).format('YYYY-MM-DD HH:mm:ss') : '',
              pageNo: params?.current || 1,
              pageSize: params?.pageSize || 20,
              queryType: timeType,
              startTime: time?.[0] !== '' ? dayjs(time?.[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            });
            const { data } = res;
            setSettlementData({
              commissionTotal: data?.commissionTotal,
              orderAmount: data?.orderAmount,
              orderCount: data?.orderCount,
              perCapitaIncome: data?.perCapitaIncome,
              userCount: data?.userCount,
            });
            return Promise.resolve({
              data: data?.settlementList?.records,
              success: true,
              total: data?.settlementList?.total,
            });
          }}
          // rowKey="settleDay"
          pagination={{
            showSizeChanger: true,
          }}
          scroll={{ x: 1000 }}
          columns={columns}
          search={false}
          dateFormatter="string"
          options={false}
          headerTitle="结算列表"
          actionRef={actionRef}
          toolBarRender={() => [
            <Button
              key="show"
              className={`${tableActiveIndex === 1 ? 'active' : ''}`}
              onClick={() => {
                setTableActiveIndex(1);
                setTimeType(1);
                actionRef.current?.reload();
              }}
            >
              按天
            </Button>,
            <Button
              key="out"
              className={`${tableActiveIndex === 2 ? 'active' : ''}`}
              onClick={() => {
                setTableActiveIndex(2);
                setTimeType(2);
                actionRef.current?.reload();
              }}
            >
              按月
            </Button>,
          ]}
        />
      </div>
    </div>
  );
};

export default Statistics;
