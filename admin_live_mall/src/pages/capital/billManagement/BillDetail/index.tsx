import { FC, memo, useEffect, useState } from 'react';
import { Button, Card, Col, Form, message, Row, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useLocation } from '@umijs/max';
import {
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { billDetailList, exportBillDetailList } from './service';
import { IRequestParams, TableListItem } from './data';
import {
  getFormatDayTime,
  getSubtractDayTime,
  todayEndTime,
} from '@/pages/utils/getSubtractDayTime';
import { payMethods } from '@/pages/capital/billManagement/BillAccount';
import { exportExcelBlob } from '@/pages/utils/export';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';
import styles from './index.module.less';

const formatText = 'YYYY-MM-DD HH:mm:ss';
const tabKeys = [
  {
    key: 'all',
    label: '全部',
  },
  {
    key: 'add',
    label: '收入',
  },
  {
    // expenditure
    key: 'reduce',
    label: '支出',
  },
];
const timeArr: { title: string; dayNum: number }[] = [
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

const BillDetail: FC = () => {
  const [form] = Form.useForm();
  const { state }: any = useLocation();
  const [requestParams, setRequestParams] = useState<IRequestParams>({
    pageNo: 1,
    pageSize: 10,
    startTime: state?.startTime,
    endTime: state?.endTime,
  });
  const [activeKey, setActiveKey] = useState<string>('all');
  const [activeTimeObj, setActiveTimeObj] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [billList, setBillList] = useState<TableListItem[]>([]);
  const [billDetail, setBillDetail] = useState<IBillDetail>({
    addCount: 0,
    addTotal: '',
    reduceCount: 0,
    reduceTotal: '',
  });
  const [total, setTotal] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [showExportModel, setShowExportModel] = useState(false);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '入账时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '交易类型',
      dataIndex: 'type',
      align: 'center',
      render: (_, record) => (
        <span style={{ color: record.type === 'add' ? 'green' : 'red' }}>
          {record.type === 'add' ? '收入' : '支出'}
        </span>
      ),
    },
    {
      title: '业务单号 | 支付流水号',
      align: 'center',
      search: false,
      render: (_, record) => (
        <div>
          <div>业务单号：{record?.orderNo}</div>
          <div>支付流水号：{record?.transactionId}</div>
        </div>
      ),
    },
    {
      title: '支付方式',
      dataIndex: 'payMethod',
      search: false,
      align: 'center',
      valueEnum: () => {
        let obj: any = {};
        payMethods.forEach(({ value, label }) => {
          obj[value] = label;
        });
        return obj;
      },
    },
    {
      title: '收支金额',
      dataIndex: 'amount',
      search: false,
      align: 'center',
      render: (_, record) => (
        <span style={{ color: record.type === 'add' ? 'green' : 'red' }}>
          {`${record.type === 'add' ? '+' : '-'}${record.amount}元`}
        </span>
      ),
    },
    {
      title: '交易对象',
      search: false,
      align: 'center',
      render: (_, record) => {
        const { userId = '', userName = '', phone = '' } = record || {};
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div>昵称：{userName || '-'}</div>
              <div>ID：{userId || '-'}</div>
              <div>手机号：{phone || '-'}</div>
            </div>
          </div>
        );
      },
    },
  ];

  // 获取表单参数
  const getFormValues = (): IRequestParams => {
    const { entryTime = [] } = form.getFieldsValue() || {};
    const params = {
      ...form.getFieldsValue(),
      startTime: getFormatDayTime(entryTime?.[0], formatText),
      endTime: getFormatDayTime(entryTime?.[1], formatText),
    };
    delete params?.entryTime;
    return params;
  };

  const getBillDetailList = async (): Promise<void> => {
    try {
      setLoading(true);
      const {
        data: {
          page: { records = [], total = 0 },
          summary = {},
        },
      } = await billDetailList(requestParams);
      setBillList(records);
      setBillDetail(summary);
      setTotal(total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  // 获取当前日期对应的时间类型，如今天返回0 ，昨天返回1，近七天返回7
  const getDayNumValue = (entryTime: string[]): number | undefined => {
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
    let currentDayNum;
    currentTimeArr?.forEach((time) => {
      if (time?.timeArr?.[0] === entryTime[0] && time?.timeArr?.[1] === entryTime[1]) {
        currentDayNum = time.dayNum;
      }
    });
    return currentDayNum;
  };

  // form表单值改变时触发
  const onFormLayoutChange = (value: { entryTime: string[] }) => {
    if (value.entryTime?.length) {
      setActiveTimeObj({
        entryTime: getDayNumValue(value.entryTime),
      });
    }
  };

  // 搜索
  const onQueryList = () => {
    setRequestParams({
      ...requestParams,
      ...getFormValues(),
      pageNo: 1,
    });
    setRefresh(!refresh);
  };
  // 重置
  const onReset = () => {
    form.resetFields();
    setRequestParams({
      pageSize: requestParams.pageSize,
      pageNo: 1,
    });
    setActiveTimeObj({});
    setRefresh(!refresh);
  };

  const onExportList = async (excludeColumnFieldNames: string[]) => {
    setRefresh(!refresh);
    exportExcelBlob(
      `对账明细列表-${dayjs().format('YYYY-MM-DD HH_mm')}`,
      await exportBillDetailList({
        ...getFormValues(),
        // ...requestParams,
        excludeColumnFieldNames,
      }),
    );
    message.success('导出成功！');
  };

  const onChangePage = (pageNo: number, pageSize: number): void => {
    setRequestParams({
      ...requestParams,
      pageNo,
      pageSize,
    });
    setRefresh(!refresh);
  };

  const onChangeKey = (key: string) => {
    setActiveKey(key);
    setRequestParams({
      ...requestParams,
      type: key === 'all' ? undefined : key,
      pageNo: 1,
    });
    setRefresh(!refresh);
  };

  useEffect(() => {
    if (state?.endTime) {
      const { startTime = '', endTime = '' } = state || {};
      form.setFieldValue('entryTime', [dayjs(startTime), dayjs(endTime)]);
      setRefresh(!refresh);
      setActiveTimeObj({
        entryTime: getDayNumValue([startTime, endTime]),
      });
    }
  }, [state]);

  useEffect(() => {
    getBillDetailList();
  }, [activeKey, refresh]);

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
      form.setFieldValue(timeType, [currentTime.startTime, currentTime.endTime]);
    };
    return (
      <div className={styles.timeSelectBtn}>
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
  const BillBoard: FC = () => {
    return (
      <div className={styles.billBoard}>
        <div className={styles.billDetail}>
          <p className={styles.amountText}>
            <span>总收入(元)</span>
            <Tooltip
              placement="top"
              title="统计时间内，当前支付方式的总收入，货到付款订单在交易完成后计入收
                入(需结合你的实际账号进行对账)"
              className={styles.toolTip}
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </p>
          <p className={styles.amountInfo}>
            <span className={styles.amount}>{billDetail?.addTotal ?? '-'}</span>
            <span className={styles.transactNum}>{billDetail?.addCount ?? '-'} 笔</span>
          </p>
        </div>
        <div className={styles.billDetail}>
          <p className={styles.amountText}>
            <span>总支出(元)</span>
            <Tooltip
              placement="top"
              title="统计时间内，当前支付方式的总支出(需结合你的实际账号进行对账)"
              className={styles.toolTip}
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </p>
          <p className={styles.amountInfo}>
            <span className={styles.amount}>{billDetail?.reduceTotal ?? '-'}</span>
            <span className={styles.transactNum}>{billDetail?.reduceCount ?? '-'} 笔</span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card>
        <ProForm layout="inline" form={form} onValuesChange={onFormLayoutChange} submitter={false}>
          <Row gutter={[20, 20]}>
            <Col span={8}>
              <ProFormSelect
                label="支付类型"
                name="payMethod"
                options={payMethods}
                placeholder="请选择支付类型"
              />
            </Col>
            {/*<Col span={8}>*/}
            {/*  <ProFormSelect*/}
            {/*    label="交易类型"*/}
            {/*    name="tradeType"*/}
            {/*    options={[*/}
            {/*      {*/}
            {/*        value: 'add',*/}
            {/*        label: '收入',*/}
            {/*      },*/}
            {/*      {*/}
            {/*        value: 'reduce',*/}
            {/*        label: '支出',*/}
            {/*      },*/}
            {/*    ]}*/}
            {/*  />*/}
            {/*</Col>*/}
            {/*<Col span={16}>*/}
            {/*  <div className={styles.timePicker}>*/}
            {/*    <ProFormDateTimeRangePicker*/}
            {/*      width="lg"*/}
            {/*      label="结算时间"*/}
            {/*      name="settlementTime"*/}
            {/*      allowClear*/}
            {/*      placeholder={['开始时间', '结束时间']}*/}
            {/*    />*/}
            {/*    <TimeSelect timeType="settlementTime" />*/}
            {/*  </div>*/}
            {/*</Col>*/}
            <Col span={8}>
              <ProFormText label="单号" name="orderNo" placeholder="支付流水号/业务单号" />
            </Col>
            <Col span={16}>
              <div className={styles.timePicker}>
                <ProFormDateTimeRangePicker
                  width="lg"
                  label="入账时间"
                  name="entryTime"
                  allowClear
                  placeholder={['开始时间', '结束时间']}
                />
                <TimeSelect timeType="entryTime" />
              </div>
            </Col>
            <Col span={24}>
              <div key="buttons" className={styles.buttons}>
                <Button htmlType="button" key="search" type="primary" onClick={onQueryList}>
                  筛选
                </Button>
                <Button htmlType="button" key="reset" onClick={onReset}>
                  重置
                </Button>
                <Button
                  htmlType="button"
                  key="export"
                  // onClick={onExportBillDetail}
                  onClick={() => setShowExportModel(true)}
                >
                  导出
                </Button>
                {/*<Button htmlType="button" key="search3">*/}
                {/*  查看已导出列表*/}
                {/*</Button>*/}
              </div>
            </Col>
          </Row>
        </ProForm>
      </Card>
      <Card className={styles.mt20}>
        <BillBoard />
      </Card>
      <br />
      <ProTable<TableListItem>
        options={false}
        search={false}
        columns={columns}
        scroll={{ x: 1000, y: billList?.length > 5 ? '34vh' : undefined }}
        rowKey="id"
        loading={loading}
        toolbar={{
          menu: {
            type: 'tab',
            items: tabKeys,
            activeKey,
            onChange: (key: any) => {
              onChangeKey(key);
            },
          },
        }}
        dataSource={billList}
        pagination={{
          ...requestParams,
          total,
          onChange: onChangePage,
        }}
      />
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.ReconciliationToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </PageContainer>
  );
};

export default BillDetail;
