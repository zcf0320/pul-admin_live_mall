import { FC, memo, useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Tooltip,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import dayjs from 'dayjs';

import {
  getFormatDayTime,
  getSubtractDayTime,
  todayEndTime,
} from '@/pages/utils/getSubtractDayTime';

import { exportSettlementList, getSettlementList } from './services';
import { exportExcelBlob } from '@/pages/utils/export';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';
import './index.less';

const { RangePicker } = DatePicker;
const timeArr = [
  {
    title: '今天',
    dayNum: 0,
  },
  {
    title: '昨天',
    dayNum: 1,
  },
  {
    title: '近7天',
    dayNum: 7,
  },
  {
    title: '近30天',
    dayNum: 30,
  },
];
const tabList = [
  {
    key: 'ALL',
    label: '全部',
  },
  {
    key: 'TOBESETTLED',
    label: '待结算',
  },
  {
    key: 'SETTLED',
    label: '已结算',
  },
];
const formatText = 'YYYY-MM-DD HH:mm:ss';

const SettlementList = () => {
  const [form] = Form.useForm();
  const [requestParams, setRequestParams] = useState<ISettlementRequestParams>({
    pageNo: 1,
    pageSize: 10,
  });
  const [total, setTotal] = useState<number>(0);
  const [activeKey, setActiveKey] = useState<string>('ALL');
  const [settlementDetail, setSettlementDetail] = useState<ISettlementDetail>({
    settledAmount: '0',
    settledCount: 0,
    toBeSettledAmount: '0',
    toBeSettledCount: 0,
  });
  const [settlementList, setSettlementList] = useState<ISettlementList[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false); // 刷新列表
  const [activeTimeObj, setActiveTimeObj] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [showExportModel, setShowExportModel] = useState(false);
  // 获取表单参数
  const getFormValues = () => {
    const { entryTime = [] } = form.getFieldsValue() || {};
    const params = {
      ...form.getFieldsValue(),
      startTime: getFormatDayTime(entryTime?.[0], formatText),
      endTime: getFormatDayTime(entryTime?.[1], formatText),
    };
    delete params?.entryTime;
    delete params?.settlementTime;
    return params;
  };

  // 获取结算列表数据
  const getSettlement = async (): Promise<void> => {
    try {
      setLoading(true);
      const {
        data: {
          settlementPage: { records = [], total = 0 },
          summary,
        },
      } = await getSettlementList(requestParams);
      setSettlementList(
        records.map((item: ISettlementList, index: number) => ({
          ...item,
          rowKey: item.orderNo + index,
        })),
      );
      setSettlementDetail(summary);
      setTotal(total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  //   切换
  const handClickTab = (key: string) => {
    setActiveKey(key);
    setRequestParams({
      ...requestParams,
      settleFlag: key === 'ALL' ? undefined : key === 'SETTLED',
    });
    setRefresh(!refresh);
  };

  // 确认
  const onQueryList = () => {
    const params = {
      ...requestParams,
      ...getFormValues(),
      pageNo: 1,
    };
    setRequestParams(params);
    setRefresh(!refresh);
  };
  // 重置
  const onReset = () => {
    form.resetFields();
    setRequestParams({
      pageNo: 1,
      pageSize: requestParams.pageSize,
    });
    setActiveTimeObj({});
    setRefresh(!refresh);
  };

  const onExportList = async (excludeColumnFieldNames: string[]) => {
    setRefresh(!refresh);
    exportExcelBlob(
      `结算列表-${dayjs().format('YYYY-MM-DD HH_mm')}`,
      await exportSettlementList({ ...getFormValues(), excludeColumnFieldNames }),
    );
    message.success('导出成功！');
  };
  // 获取当前日期对应的时间类型，如今天返回0 ，昨天返回1，近七天返回7
  const getDayNumValue = (entryTime: string[]) => {
    const currentTimeArr = timeArr.map(({ dayNum }) => {
      return {
        dayNum,
        timeArr: [
          getFormatDayTime(getSubtractDayTime(dayNum).startTime, formatText),
          getFormatDayTime(
            dayNum !== 1 ? todayEndTime : getSubtractDayTime(dayNum).endTime,
            formatText,
          ),
        ],
      };
    });
    let currentDayNum = null;
    currentTimeArr?.forEach((time) => {
      if (time?.timeArr?.[0] === entryTime[0] && time?.timeArr?.[1] === entryTime[1]) {
        currentDayNum = time.dayNum;
      }
    });
    return currentDayNum;
  };

  // 时间
  const onChangeTime = (e: any, dayTime: string[]) => {
    const [startTime, endTime] = dayTime || [];
    setRequestParams({
      ...requestParams,
      startTime,
      endTime,
    });
    if (dayTime?.length) {
      setActiveTimeObj({
        entryTime: getDayNumValue(dayTime),
      });
    }
  };
  // form表单值改变时触发
  const onFormLayoutChange = (value: any) => {
    if (value.entryTime?.length) {
      setActiveTimeObj({
        entryTime: getDayNumValue(value.entryTime),
      });
    }
  };

  const columns: ProColumns<ISettlementList>[] = [
    {
      title: '业务单号 | 结算流水号',
      align: 'center',
      width: 300,
      ellipsis: true,
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <div>单号：{record?.orderNo ?? '-'}</div>
            <div>流水号：{record?.serialNumber ?? '-'}</div>
          </div>
        </div>
      ),
    },
    {
      title: '入账时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 200,
    },
    {
      title: '结算状态',
      dataIndex: 'settleFlag',
      align: 'center',
      width: 150,
      render: (text, record) => {
        return (
          <>
            <Badge color={record?.settleFlag ? 'green' : 'red'} className="mr10" />
            <span>{record?.settleFlag ? '已结算' : '待结算' || '-'}</span>
          </>
        );
      },
    },
    {
      title: '结算类型',
      dataIndex: 'settleType',
      align: 'center',
      width: 200,
      valueEnum: {
        TEAM: '团长佣金',
        PARTNER: '合伙人佣金',
        TRAINING: '培训津贴',
      },
    },
    {
      title: '结算金额',
      dataIndex: 'settledAmount',
      align: 'center',
      width: 150,
      render: (_, record) => (
        <span style={{ color: record?.settleFlag ? 'green' : 'red' }}>
          ¥ {record?.settledAmount ?? '-'}
        </span>
      ),
    },
    {
      title: '结算时间',
      dataIndex: 'settleTime',
      align: 'center',
      width: 200,
    },
    {
      title: '交易对象',
      align: 'center',
      width: 200,
      ellipsis: true,
      render: (_, record) => {
        const { name = '' } = record || {};
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div>昵称：{name ?? '-'}</div>
              {/*<div>ID：{userId || '-'}</div>*/}
              {/*<div>手机号：{phone || '-'}</div>*/}
            </div>
          </div>
        );
      },
    },
    {
      title: '金额明细',
      dataIndex: 'payPrice',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return (
          <div className="flexColumn">
            <span>支付金额：¥{record?.payPrice ?? '-'}</span>
            <span>结算金额：¥{record?.settledAmount ?? '-'}</span>
          </div>
        );
      },
    },
    {
      title: '佣金',
      dataIndex: 'commissionRate',
      width: 200,
      align: 'center',
      render: (text, record) => {
        return (
          <div className="flexColumn">
            <span>预估佣金：¥{record?.estimatedCommission ?? '-'}</span>
            <span>实际佣金：¥{record?.realCommission ?? '-'}</span>
            <span>佣金比例：{record?.commissionRate * 100 ?? '-'}%</span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getSettlement();
  }, [refresh]);

  // 设置当前选择的时间
  const TimeSelect: FC<{ timeType: string }> = memo((props: any) => {
    const { timeType = '' } = props || {};
    const setCurrentTime = (dayNum: number, timeType: string) => {
      let currentTime = null;
      currentTime = getSubtractDayTime(dayNum);
      if (dayNum !== 1) {
        currentTime = {
          startTime: getFormatDayTime(currentTime.startTime, formatText),
          endTime: getFormatDayTime(todayEndTime, formatText),
        };
      }
      // 回显当前的结算时间
      form.setFieldValue(timeType, [dayjs(currentTime.startTime), dayjs(currentTime.endTime)]);
    };

    return (
      <div className="timeSelectBtn">
        {timeArr.map(({ title, dayNum }) => {
          return (
            <span
              onClick={() => {
                setCurrentTime(dayNum, timeType);
                setActiveTimeObj({
                  ...activeTimeObj,
                  [timeType]: dayNum,
                });
              }}
              key={dayNum}
              style={{
                color: dayNum === activeTimeObj?.[timeType] ? '#2e75f5' : '#333',
              }}
            >
              {title}
            </span>
          );
        })}
      </div>
    );
  });

  const {
    settledAmount = 0,
    settledCount = 0,
    toBeSettledAmount = 0,
    toBeSettledCount = 0,
  } = settlementDetail || {};
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className="settlementList">
        <div className="settlementList-main">
          <div className="settlementList-content">
            <div className="settlementList-form">
              <Form form={form} onValuesChange={onFormLayoutChange}>
                <Row gutter={[20, 0]}>
                  <Col span={8}>
                    <Form.Item name="orderNo" label="业务单号">
                      <Input placeholder="业务单号" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="serialNumber" label="结算流水号">
                      <Input placeholder="结算流水号" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="settleFlag" label="结算状态">
                      <Select
                        // style={{ width: 320 }}
                        // onChange={handleClassification}
                        allowClear
                        placeholder="请选择结算状态"
                        options={[
                          { value: false, label: '待结算' },
                          { value: true, label: '已结算' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={16} className="form-time">
                    <Form.Item name="entryTime" label="结算时间">
                      <RangePicker
                        // style={{ width: '100%' }}
                        showTime
                        onChange={onChangeTime}
                      />
                    </Form.Item>
                    <TimeSelect timeType="entryTime" />
                  </Col>
                </Row>
              </Form>

              <div className="settlement-form-btn">
                <Button type="primary" className="btn-ok" onClick={onQueryList}>
                  筛选
                </Button>
                <Button onClick={onReset}>重置</Button>
                <Button
                  // onClick={onExportSettlement}
                  onClick={() => setShowExportModel(true)}
                >
                  导出
                </Button>
                {/*<Button>查看已导出列表</Button>*/}
              </div>
            </div>
            <Card>
              <div className="billBoard">
                <div className="billDetail">
                  <p className="amountText">
                    <span>待结算金额(元)</span>
                    <Tooltip
                      placement="top"
                      title="统计时间内，当前支付方式的总收入，货到付款订单在交易完成后计入收
                入(需结合你的实际账号进行对账)"
                      className="toolTip"
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </p>
                  <p className="amountInfo">
                    <span className="amount">{toBeSettledAmount ?? '0.00'}</span>
                    <span className="transactNum">{toBeSettledCount ?? '-'} 笔</span>
                  </p>
                </div>
                <div className="billDetail">
                  <p className="amountText">
                    <span>已结算金额(元)</span>
                    <Tooltip
                      placement="top"
                      title="统计时间内，当前支付方式的总支出(需结合你的实际账号进行对账)"
                      className="toolTip"
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </p>
                  <p className="amountInfo">
                    <span className="amount">{settledAmount ?? '0.00'}</span>
                    <span className="transactNum">{settledCount ?? '-'} 笔</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <ProTable<ISettlementList>
          loading={loading}
          columns={columns}
          scroll={{ x: 1000, y: settlementList?.length > 5 ? '35vh' : undefined }}
          search={false}
          options={false}
          rowKey="rowKey"
          dataSource={settlementList}
          toolbar={{
            menu: {
              type: 'tab',
              activeKey,
              items: tabList,
              onChange: (key) => {
                handClickTab(key as string);
              },
            },
          }}
          pagination={{
            total,
            pageSize: requestParams.pageSize,
            current: requestParams.pageNo,
            onChange: (pageNo, pageSize) => {
              setRequestParams({
                ...requestParams,
                pageNo,
                pageSize,
              });
              setRefresh(!refresh);
            },
          }}
        />
        <ExportFieldsModel
          showExportModel={showExportModel}
          setShowExportModel={setShowExportModel}
          fieldType={ExportTypeClassName.SettlementToExcel}
          setSelectFields={(values) => onExportList(values)}
        />
      </div>
    </PageContainer>
  );
};

export default SettlementList;
