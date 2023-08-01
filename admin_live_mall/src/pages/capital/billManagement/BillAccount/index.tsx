import { FC, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { history } from '@umijs/max';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, DatePicker, Form, Select, Tooltip } from 'antd';
import { payMethodList } from '@/pages/capital/billManagement/BillAccount/service';
import { getFormatDayTime } from '@/pages/utils/getSubtractDayTime';

import styles from './index.module.less';

// 对账单
const FormItem = Form.Item;
const currentMonth = dayjs().format('YYYY-MM');
const formatText = 'YYYY-MM-DD HH:mm:ss';

export const payMethods = [
  {
    value: 'WECHAT_MP',
    label: '微信小程序支付',
  },
  {
    value: 'WECHAT_APPLET',
    label: '微信公众号支付',
  },
  {
    value: 'WECHAT_H5',
    label: '微信支付-H5',
  },
  {
    value: 'WECHAT_JSAPI',
    label: '微信支付-JSAPI',
  },
  {
    value: 'ALIPAY',
    label: '支付宝支付',
  },
  {
    value: 'OFFLINE',
    label: '线下支付',
  },
];
const getTimeObject = (time: Dayjs | string): { startTime: string; endTime: string } => {
  const startTime: string = dayjs(time).format('YYYY-MM-DD');
  const addDays: number = dayjs(time).daysInMonth() - 1;
  let endTime: string = dayjs(startTime).add(addDays, 'days').format('YYYY-MM-DD');
  if (dayjs(endTime).isAfter(dayjs())) {
    endTime = dayjs().format('YYYY-MM-DD');
  }
  return {
    startTime,
    endTime,
  };
};

const BillAccount: FC = () => {
  const [form] = Form.useForm();
  const [requestParams, setRequestParams] = useState<IRequestParams>({
    pageNo: 1,
    pageSize: 10,
    total: 0,
  });
  const [total, setTotal] = useState<number>(0);
  const [billAccountDetail, setBillAccountDetail] = useState<IBillAccountDetail>({
    totalExpenditure: 0,
    totalIncome: 0,
    totalIncomeCount: 0,
    totalExpenditureCount: 0,
  });
  const [billAccountList, setBillAccountList] = useState<IBillAccountList[]>([]);
  //const [showExportModel, setShowExportModel] = useState<boolean>(false);

  // 获取账单列表
  const getBillAmountList = async (): Promise<any> => {
    try {
      const { month, payMethod = '' } = form.getFieldsValue() || {};
      const params: {
        payMethod: string;
        month: string;
      } = {
        payMethod,
        month: dayjs(month).format('YYYY-MM'),
      };
      const {
        data: {
          detailsPage: { records = [], total = 0 },
          totalExpenditure = 0,
          totalIncome = 0,
          totalIncomeCount = 0,
          totalExpenditureCount = 0,
        },
      } = await payMethodList(params);
      setBillAccountDetail({
        totalExpenditure,
        totalIncome,
        totalIncomeCount,
        totalExpenditureCount,
      });
      setTotal(total);
      setBillAccountList(
        records?.map((item: IRequestParams, index: number) => ({
          ...item,
          key: (item.payMethod as string) + index,
        })),
      );
      // setRequestParams({
      //   ...requestParams,
      //   total,
      // });
    } catch (e) {
      console.error(e);
    }
  };

  // const onExportBillAccount = () => {
  //   setRequestParams({
  //     ...requestParams,
  //     pageNo: 1,
  //   });
  // };

  const columns: ProColumns[] = [
    {
      title: '日期',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '支付方式',
      dataIndex: 'payMethod',
      align: 'center',
      render: (payMethod) => {
        const payMethodLabel = payMethods.find((item) => item.value === payMethod)?.label;
        return <span>{payMethodLabel}</span>;
      },
    },
    {
      title: '收入',
      dataIndex: 'pay',
      align: 'center',
      render: (_, record) => (
        <>
          <div className={styles.income}>
            <span className={styles.incomeAmount}>+ ¥{record.incomeAmount ?? '-'}元</span>
            <span className={styles.amountNum}>{record.incomeCount ?? '-'}笔</span>
          </div>
        </>
      ),
    },
    {
      title: '支出',
      dataIndex: 'expenditureAmount',
      align: 'center',
      render: (_, record) => (
        <>
          <div className={styles.expenditure}>
            <span className={styles.expenditureAmount}>- ¥{record.expenditureAmount ?? '-'}元</span>
            <span className={styles.amountNum}>{record?.expenditureCount ?? '-'}笔</span>
          </div>
        </>
      ),
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          <div className={styles.option}>
            <Button
              type="link"
              onClick={() => {
                const startTime = getFormatDayTime(
                  dayjs(record?.createDate).startOf('day'),
                  formatText,
                );
                const endTime = getFormatDayTime(
                  dayjs(record?.createDate).endOf('day'),
                  formatText,
                );
                history.push('/capital/billManagement/BillDetail', {
                  startTime,
                  endTime,
                });
              }}
            >
              明细
            </Button>
            {/*<Button type="link" onClick={() => setShowExportModel(true)}>*/}
            {/*  导出*/}
            {/*</Button>*/}
            {/*<Button type="link" onClick={onExportBillAccount}>*/}
            {/*  导出*/}
            {/*</Button>*/}
            {/*<Button type="link">查看已生成报表</Button>*/}
          </div>
        </>
      ),
    },
  ];

  const onChangeFormValues = (
    _: any,
    { payMethod, month }: { payMethod: string; month: string },
  ): void => {
    const currentMonth = dayjs(month).format('YYYY-MM');
    setRequestParams({
      ...requestParams,
      ...getTimeObject(currentMonth),
      payMethod,
      payMethodLabel: payMethods.find((item) => item.value === payMethod)?.label,
      month: currentMonth,
    });
  };

  useEffect(() => {
    // getPayMethodList();
    getBillAmountList();
  }, [requestParams]);

  useEffect(() => {
    form.setFieldsValue({ pay: payMethods[0]?.value });
  }, [payMethods]);

  useEffect(() => {
    setRequestParams({
      ...requestParams,
      ...getTimeObject(currentMonth),
      pay: payMethods[0]?.value,
      payMethod: payMethods[0]?.label,
      payMethodLabel: payMethods[0]?.label,
    });
  }, [payMethods]);

  const BillBoard: FC = () => {
    return (
      <div className={styles.billBoard}>
        <div className={styles.billDetail}>
          <p>{requestParams?.payMethodLabel}</p>
          <p>
            {requestParams.startTime} ~ {requestParams.endTime}
          </p>
        </div>
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
            <span className={styles.amount}>{billAccountDetail?.totalIncome || '0.00'}</span>
            <span className={styles.transactNum}>
              {billAccountDetail?.totalIncomeCount ?? '-'} 笔
            </span>
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
            <span className={styles.amount}>{billAccountDetail?.totalExpenditure || '0.00'}</span>
            <span className={styles.transactNum}>
              {billAccountDetail?.totalExpenditureCount ?? '-'} 笔
            </span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProCard size="small">
        <Form
          layout="inline"
          className={styles.form}
          form={form}
          initialValues={{
            month: dayjs(currentMonth, 'YYYY-MM'),
            payMethod: payMethods[0].value,
          }}
          onValuesChange={onChangeFormValues}
        >
          <FormItem label="月份筛选" name="month" className={styles.formItem}>
            <DatePicker
              placeholder="请选择月份"
              className={styles.datePicker}
              picker="month"
              allowClear={false}
              disabledDate={(value) => value > dayjs().endOf('month')}
            />
          </FormItem>
          <FormItem label="支付方式" name="payMethod" className={styles.formItem}>
            <Select placeholder="请选择支付方式" options={payMethods} allowClear={false} />
          </FormItem>
        </Form>
        <BillBoard />
        <ProTable
          rowKey="key"
          scroll={{ x: 1000 }}
          search={false}
          options={false}
          columns={columns}
          params={requestParams}
          dataSource={billAccountList}
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
            },
          }}
        />
      </ProCard>
      {/*导出日账单*/}
      {/*<ExportModel*/}
      {/*  showExportModel={showExportModel}*/}
      {/*  setShowExportModel={() => setShowExportModel(false)}*/}
      {/*/>*/}
    </PageContainer>
  );
};

export default BillAccount;
