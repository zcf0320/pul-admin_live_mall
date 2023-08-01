import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useLocation } from '@umijs/max';
import {
  PageContainer,
  ProCard,
  ProColumns,
  ProForm,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { Avatar, Button, Col, Form, message, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
  exportCustomerWalletDetail,
  walletDetails,
} from '@/pages/capital/billManagement/WalletDetail/service';
import { getFormatDayTime } from '@/pages/utils/getSubtractDayTime';
import { exportExcelBlob } from '@/pages/utils/export';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';
import styles from './index.module.less';

const formatText: string = 'YYYY-MM-DD HH:mm:ss';
const walletTabObject = {
  ALL: '全部',
  INCOME: '收入',
  EXPENDITURE: '支出',
};
// 10-佣金 20-消费 30-提现 40-提现失败 50-管理员后台扣减 60-管理员后台添加
//COMMISSION,CONSUMPTION,WITHDRAWAL,WITHDRAWAL_FAILED,SYSTEM_SUB,SYSTEM_ADD

const walletRecordTypeEnum: { value: string; label: string }[] = [
  {
    value: 'COMMISSION',
    label: '佣金',
  },
  {
    value: 'CONSUMPTION',
    label: '消费',
  },
  {
    value: 'WITHDRAWAL',
    label: '提现',
  },
  {
    value: 'WITHDRAWAL_FAILED',
    label: '提现失败',
  },
  {
    value: 'SYSTEM_ADD',
    label: '管理员后台添加',
  },
  {
    value: 'SYSTEM_SUB',
    label: '管理员后台扣减',
  },
];

const statusTabItems: { label: string; key: string }[] = Object.entries(walletTabObject).map(
  (item) => {
    return {
      label: item[1],
      key: item[0],
    };
  },
);

const WalletDetail: FC = () => {
  const { state }: any = useLocation(); // 路由参数,用户ID
  const [form] = Form.useForm();
  const [customerInfo, setCustomerInfo] = useState<ICustomerInfo>();
  const [walletDetailList, setWalletDetailList] = useState<IWalletDetailList[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [requestParams, setRequestParams] = useState<IWalletDetailRequestParam>({
    pageNo: 1,
    pageSize: 10,
  });
  const [total, setTotal] = useState<number>(0);
  const [activeTabKey, setActiveTabKey] = useState<string>('ALL');
  const [showExportModel, setShowExportModel] = useState(false);
  const columns: ProColumns[] = [
    {
      title: '时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '业务类型',
      dataIndex: 'type',
      align: 'center',
      render: (text) => {
        const typeText = walletRecordTypeEnum.find((type) => type.value === text)?.label;
        return <span>{typeText}</span>;
      },
    },
    // {
    //   title: '收支金额',
    //   dataIndex: 'income',
    //   search: false,
    //   ellipsis: true,
    //   render: (_: any, record: any) => (
    //     <div style={{ color: record?.income.type === 'income' ? 'green' : 'red' }}>
    //       {record?.income.type === 'income' ? '+' : '-'}¥{record?.income.amount}
    //     </div>
    //   ),
    // },
    {
      title: '账户余额',
      dataIndex: 'balance',
      align: 'center',
      render: (_: any, record: IWalletDetailList) => <div>¥{record?.balance}</div>,
    },
    {
      title: '交易类型',
      dataIndex: 'operation',
      valueEnum: {
        1: '收入',
        2: '支出',
      },
      align: 'center',
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remarks',
    },
  ];
  // 获取用户钱包信息
  const getCustomerWalletInfo = useCallback(
    async (userId: string): Promise<void> => {
      try {
        setLoading(true);
        const {
          data: {
            customerInfo = {},
            record: { records = [], total },
            summary = {},
          },
        } = await walletDetails({
          ...requestParams,
          userId,
        });
        setWalletDetailList(records);
        setTotal(total);
        setCustomerInfo({
          ...customerInfo,
          ...summary,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [state.parentId, refresh],
  );

  // 获取表单参数
  const getFormValues = (): IWalletDetailFormValues => {
    const { time = [] } = form.getFieldsValue() || {};
    const params = {
      ...form.getFieldsValue(),
      startTime: getFormatDayTime(time?.[0], formatText),
      endTime: getFormatDayTime(time?.[1], formatText),
    };
    delete params?.time;
    return params;
  };
  // 查询列表
  const onQueryList = () => {
    setRequestParams({
      ...requestParams,
      ...getFormValues(),
      pageNo: 1,
    });
    setRefresh(!refresh);
  };

  const onReset = () => {
    form.resetFields();
    setRequestParams({
      pageSize: requestParams.pageSize,
      pageNo: 1,
    });
    setRefresh(!refresh);
  };

  // 导出客户钱包详情列表
  const onExportList = async (excludeColumnFieldNames: string[]) => {
    setRefresh(!refresh);
    try {
      exportExcelBlob(
        `客户钱包详情列表-${dayjs().format('YYYY-MM-DD HH_mm')}`,
        await exportCustomerWalletDetail({
          ...getFormValues(),
          excludeColumnFieldNames,
          userId: state?.parentId,
        }),
      );
      message.success('导出成功');
    } catch (e) {
      console.error(e);
    }
  };

  const onValidatorMinValue = (
    _: any,
    value: string,
    callback: (message?: string) => void,
  ): void => {
    const maxValue = requestParams.maxValue;
    if (!maxValue && !value) {
      callback();
    }
    if (+value < 0) {
      callback('余额需要大于0');
    }
    if (maxValue && !value) {
      callback('请填写初始余额');
    }
    if (maxValue && value >= maxValue) {
      callback('初始余额应小于截止余额');
    } else {
      callback();
    }
  };
  const onValidatorMaxValue = (_: any, value: string, callback: (message?: string) => void) => {
    const minValue = requestParams.minValue;
    if (!minValue && !value) {
      callback();
    }
    if (+value < 0) {
      callback('余额需要大于0');
    }
    if (minValue && !value) {
      callback('请填写截止余额');
    }
    if (minValue && value <= minValue) {
      callback('截止余额应大于初始余额');
    } else {
      callback();
    }
  };

  useEffect(() => {
    form.validateFields().then(async () => {
      await getCustomerWalletInfo(state.parentId);
    });
  }, [state.parentId, refresh]);

  const {
    headImage = '',
    userName = '',
    phone = '',
    userId = '',
    registerTime = '',
    balanceMoney = 0, //总余额
    expenditureAmount = 0, // 支出金额
    expenditureCount = 0, // 支出笔数
    incomeAmount = 0, //  收入金额
    incomeCount = 0, // 收入笔数
  } = customerInfo || {};
  return (
    <PageContainer header={{ breadcrumb: undefined, title: '客户钱包详情' }}>
      <ProCard className={styles.headerCard}>
        <div className={styles.user}>
          <div className={styles.userInfo}>
            <Avatar
              size={100}
              icon={<UserOutlined />}
              src={headImage || state.headImage}
              className={styles.avatar}
            />
            <div className={styles.userDetail}>
              <span>昵称：{userName || state.userName || '-'}</span>
              <span>余额：{balanceMoney || state.balanceMoney}</span>
            </div>
          </div>
          <div className={styles.idCard}>
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ID：{userId || state.userId || '-'}
            </span>
            <span>
              手机号：{phone || state.phone || '-'}
              {/*<Button type="link">查看</Button>*/}
            </span>
          </div>
          <div className={styles.time}>
            <span>注册时间：{registerTime || state.registerTime || '-'}</span>
          </div>
        </div>
      </ProCard>
      <ProCard className={styles.bodyCard}>
        <div className={styles.incomeDetailText}>收支明细</div>
        <div className={styles.form}>
          <ProForm
            layout="inline"
            className={styles.ml20}
            form={form}
            submitter={{
              render: () => {
                return [
                  <div key="buttons" className={styles.buttons}>
                    <Button htmlType="button" key="search" type="primary" onClick={onQueryList}>
                      筛选
                    </Button>
                    <Button htmlType="button" key="search1" onClick={onReset}>
                      重置
                    </Button>
                    <Button
                      htmlType="button"
                      key="search2"
                      // onClick={onExportWallet}
                      onClick={() => setShowExportModel(true)}
                    >
                      导出
                    </Button>
                    {/*<Button htmlType="button" key="search3">*/}
                    {/*  查看已导出列表*/}
                    {/*</Button>*/}
                  </div>,
                ];
              },
            }}
            onValuesChange={async (changedValues, values) => {
              setRequestParams({
                ...requestParams,
                ...values,
              });
              await form.validateFields();
            }}
          >
            <Row gutter={[10, 10]}>
              <Col span={10}>
                <ProFormSelect
                  label="业务类型"
                  name="type"
                  placeholder="请选择业务类型"
                  options={walletRecordTypeEnum}
                />
              </Col>
              <Col span={10}>
                <div className={styles.amountFormItem}>
                  <ProFormText
                    label="金额范围"
                    name="minValue"
                    required={false}
                    placeholder="请填写初始余额"
                    rules={[{ required: true, validator: onValidatorMinValue }]}
                  />
                  <span className={styles.mr10}>- </span>
                  <ProFormText
                    name="maxValue"
                    placeholder="请填写截止余额"
                    required={false}
                    rules={[{ required: true, validator: onValidatorMaxValue }]}
                  />
                </div>
              </Col>
              <Col span={16}>
                <ProFormDateTimeRangePicker
                  label="起止时间"
                  width="lg"
                  name="time"
                  placeholder={['起始时间', '结束时间']}
                />
              </Col>
            </Row>
          </ProForm>
        </div>
      </ProCard>
      <ProCard className={styles.boardCard}>
        <div className={styles.amountDetail}>
          <div className={styles.incomeAmount}>
            <p>总收入（元）</p>
            <p className={styles.amount}>¥{incomeAmount || '-'}</p>
            <p>交易笔数：{incomeCount || '-'}</p>
          </div>
          <div className={styles.expenditureAmount}>
            <p>总支出（元）</p>
            <p className={styles.amount}>¥{expenditureAmount || '-'}</p>
            <p>交易笔数：{expenditureCount || '-'}</p>
          </div>
        </div>
      </ProCard>
      <ProCard size="small" className={styles.tableCard}>
        <ProTable
          search={false}
          options={false}
          rowKey="id"
          headerTitle="钱包详情列表"
          toolbar={{
            menu: {
              type: 'tab',
              activeKey: activeTabKey,
              items: statusTabItems,
              onChange: (key) => {
                setActiveTabKey(key as string);
                setRequestParams({
                  ...requestParams,
                  pageNo: 1,
                  operation: key === 'ALL' ? undefined : key === 'INCOME' ? 1 : 0,
                });
                setRefresh(!refresh);
              },
            },
          }}
          loading={loading}
          scroll={{ x: 1000, y: walletDetailList?.length > 5 ? '25vh' : undefined }}
          columns={columns}
          dataSource={walletDetailList}
          pagination={{
            pageSize: requestParams.pageSize,
            current: requestParams.pageNo,
            total,
            onChange: (pageNo: number, pageSize: number) => {
              setRequestParams({ ...requestParams, pageNo, pageSize });
              setRefresh(!refresh);
            },
          }}
        />
      </ProCard>
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.UserWalletRecordToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </PageContainer>
  );
};

export default memo(WalletDetail);
