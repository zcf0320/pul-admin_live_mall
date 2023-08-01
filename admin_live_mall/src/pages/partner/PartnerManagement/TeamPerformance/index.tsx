import { FC, memo, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { history } from '@umijs/max';
import { Avatar, Button, Card, Col, Form, message, Row, Tooltip } from 'antd';
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';

import {
  getFormatDayTime,
  getSubtractDayTime,
  todayEndTime,
} from '@/pages/utils/getSubtractDayTime';

import { partnerLevelList } from '@/pages/partner/PartnerManagement/PartnerList/services';
import { performance, performanceExport } from './service';
import { exportExcelBlob } from '@/pages/utils/export';
import { checkIcon } from '@/pages/partner/PartnerManagement/PartnerList';
import styles from './index.module.less';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';

const formatText = 'YYYY-MM-DD HH:mm:ss';
const timeArr = [
  {
    title: ' 今天',
    dayNum: 0,
  },
  {
    title: ' 昨天',
    dayNum: 1,
  },
  {
    title: ' 近7天',
    dayNum: 7,
  },
  {
    title: ' 近30天',
    dayNum: 30,
  },
];

const TeamPerformance: FC = () => {
  const [form] = Form.useForm();
  const [requestParams, setRequestParams] = useState<any>({
    pageNo: 1,
    pageSize: 10,
  });
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [performanceInfo, setPerformanceInfo] = useState<any>({});
  const [partnerLevelOption, setPartnerLevel] = useState<IOption[]>([]);
  const [activeTimeObj, setActiveTimeObj] = useState<any>({});
  const [refresh, setRefresh] = useState<boolean>(false); // 刷新列表
  const [teamPerformanceList, setTeamPerformanceList] = useState([]);
  const [showExportModel, setShowExportModel] = useState(false);

  // 获取合伙人等级列表
  const getPartnerLevelList = async () => {
    const { data: { records = [] } = {} } = await partnerLevelList({
      pageNo: 1,
      pageSize: 999,
    });
    setPartnerLevel(
      records?.map((item: { level: string | number; name: string; status: boolean }) => ({
        value: item?.level,
        label: item?.name,
        status: item.status,
      })),
    );
  };

  // 获取请求列表的参数
  const getFormValues = () => {
    const { time = [] } = form.getFieldsValue();
    const params = {
      ...form.getFieldsValue(),
      startTime: getFormatDayTime(time?.[0], formatText),
      endTime: getFormatDayTime(time?.[1], formatText),
    };
    delete params.time;
    return params;
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
      if (time.timeArr[0] === entryTime[0] && time.timeArr[1] === entryTime[1]) {
        currentDayNum = time.dayNum;
      }
    });
    return currentDayNum;
  };

  // form表单值改变时触发
  const onFormLayoutChange = (value: any) => {
    if (value.time?.length) {
      setActiveTimeObj({
        time: getDayNumValue(value.time),
      });
    }
  };
  const getTeamPerformanceList = async (): Promise<void> => {
    try {
      setLoading(true);
      const {
        data: {
          statisticsList: { records = [], total = 0 } = {},
          commissionTotal = 0,
          orderAmountTotal = 0,
          orderTotal = 0,
          settledCommissionTotal = 0,
          settledOrderAmount = 0,
          settledOrderTotal = 0,
          toBeSettledCommissionTotal = 0,
          toBeSettledOrderAmount = 0,
          toBeSettledOrderTotal = 0,
        } = {},
      } = await performance(requestParams);
      setTeamPerformanceList(records);
      setPerformanceInfo({
        commissionTotal, // 	总佣金
        orderAmountTotal, // 	订单金额总数
        orderTotal, // orderTotal	订单总数
        settledCommissionTotal, // 	已结算佣金
        settledOrderAmount, // 	已结算订单金额
        settledOrderTotal, // 已结算总数
        toBeSettledCommissionTotal, // 	待结算佣金
        toBeSettledOrderAmount, // 	待结算订单金额
        toBeSettledOrderTotal, //	待结算订单总数
      });
      setTotal(total);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
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
    setActiveTimeObj({});
    setRequestParams({
      pageSize: requestParams.pageSize,
      pageNo: 1,
    });
    setRefresh(!refresh);
  };

  const onExportList = async (excludeColumnFieldNames: string[]) => {
    setRefresh(!refresh);
    exportExcelBlob(
      `团队业绩-${dayjs().format(formatText)}`,
      await performanceExport({
        ...getFormValues(),
        excludeColumnFieldNames,
      }),
    );
    message.success('导出成功');
  };

  const onChangePage = (pageNo: number, pageSize: number) => {
    setRequestParams({
      ...requestParams,
      pageNo,
      pageSize,
    });
    setRefresh(!refresh);
  };

  useEffect(() => {
    getPartnerLevelList(); // 合伙人等级列表
  }, []);
  useEffect(() => {
    getTeamPerformanceList();
  }, [refresh]);

  const columns: ProColumns[] = [
    {
      title: '合伙人',
      dataIndex: 'time',
      align: 'center',
      width: 300,
      render: (text, record) => {
        const {
          image = '',
          id = '',
          name = '',
          remarkName = '',
          phone = '',
          isDefault = false,
        } = record;
        return (
          <div className={styles.teamMemberInfo}>
            <div className={styles.avatar}>
              <Avatar
                size={48}
                icon={<UserOutlined />}
                src={image}
                className={styles[isDefault ? 'defaultAvatarImg' : 'avatarImg']}
              />
              {isDefault ? <span className={styles.userTag}>系统</span> : null}
            </div>
            <div className={styles.tl}>
              <div>昵称：{name ?? (remarkName || '-')}</div>
              <div>ID：{id || '-'}</div>
              <div>手机号：{phone || '-'}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '合伙人等级',
      dataIndex: 'levelName',
      align: 'center',
      width: 200,
    },
    {
      title: '团队人数',
      align: 'center',
      dataIndex: 'customerNum',
      width: 150,
      sorter: (a, b) => a.customerNum - b.customerNum,
      render: (text, record) => (
        <span
          onClick={() => {
            history.push('/partner/PartnerManagement/TeamMember', {
              parentId: record?.id,
              parentName: record?.name,
            });
          }}
        >
          <span style={{ color: '#2e75f5' }}>{text || 0}</span>
          {record?.customerNum !== null ? (
            <img src={checkIcon} alt="" className={styles.solutionOutlined} />
          ) : null}
        </span>
      ),
    },
    // {
    //   title: '加入时间',
    //   dataIndex: 'income',
    //   search: false,
    //   ellipsis: true,
    //   align: 'center',
    // },
    {
      title: '团队订单数',
      dataIndex: 'orderTotal',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.orderTotal - b.orderTotal,
      render: (text: any, record) => (
        <span
          onClick={() =>
            history.push('/partner/PartnerManagement/PartnerDetail', { parentId: record?.id })
          }
        >
          <span style={{ color: '#2e75f5' }}>{text || 0}</span>
          {record?.customerNum !== null ? (
            <img src={checkIcon} alt="" className={styles.solutionOutlined} />
          ) : null}
        </span>
      ),
    },
    {
      title: '团队订单额',
      dataIndex: 'orderAmountTotal',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.orderAmountTotal - b.orderAmountTotal,
      render: (text: any) => {
        return <div>¥{text}</div>;
      },
    },
    // {
    //   title: '下单合伙人数',
    //   dataIndex: 'consumptionTime',
    //   search: false,
    //   ellipsis: true,
    //   align: 'center',
    //   sorter: (a, b) => a - b,
    // },
    {
      title: '合伙人收益',
      dataIndex: 'consumptionTime',
      align: 'center',
      width: 200,
      sorter: (a, b) => a.commissionTotal - b.commissionTotal,
      render: (_: any, record: any) => <div>￥{record?.commissionTotal || 0}</div>,
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'remark',
      search: false,
      ellipsis: true,
      align: 'center',
      width: 200,
      render: (text, record) => {
        return (
          <div className={styles.optionBtn}>
            <Button
              type="link"
              onClick={() =>
                history.push('/partner/PartnerManagement/PartnerDetail', { parentId: record?.id })
              }
            >
              详情
            </Button>
          </div>
        );
      },
    },
  ];
  const TimeSelect: FC<{ timeType: string }> = memo((props: any) => {
    const { timeType = '' } = props || {};
    const setCurrentTime = (dayNum: number, timeType: string) => {
      let currentTime = null;
      currentTime = getSubtractDayTime(dayNum);
      if (dayNum !== 1) {
        currentTime = {
          ...currentTime,
          endTime: todayEndTime,
        };
      }
      // 回显当前的结算时间
      form.setFieldValue(timeType, [dayjs(currentTime.startTime), dayjs(currentTime.endTime)]);
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

  const {
    commissionTotal = '-',
    orderAmountTotal = '-',
    orderTotal = '-',
    settledCommissionTotal = '-',
    settledOrderAmount = '-',
    settledOrderTotal = '-',
    toBeSettledCommissionTotal = '-',
    toBeSettledOrderAmount = '-',
    toBeSettledOrderTotal = '-',
  } = performanceInfo || {};
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card className={styles.teamMemberCard}>
        <ProForm form={form} layout="inline" submitter={false} onValuesChange={onFormLayoutChange}>
          <Row gutter={[20, 20]}>
            <Col span={8}>
              <ProFormSelect
                label="合伙人等级"
                name="level"
                placeholder="请选择合伙人等级"
                options={partnerLevelOption}
              />
            </Col>
            <Col span={10}>
              <ProFormText
                label="合伙人"
                name="partnerInfo"
                placeholder="请输入备注名/昵称/手机号/ID"
              />
            </Col>
            <Col span={12}>
              <div className={styles.timePicker}>
                <ProFormDateTimeRangePicker
                  width="lg"
                  label="起止时间"
                  name="time"
                  allowClear
                  placeholder={['开始时间', '结束时间']}
                />
                <TimeSelect timeType="time" />
              </div>
            </Col>
            <Col span={24}>
              <div className={styles.teamMember}>
                <Button htmlType="button" key="search" type="primary" onClick={onQueryList}>
                  筛选
                </Button>
                <Button htmlType="button" key="reset" onClick={onReset}>
                  重置
                </Button>
                <Button htmlType="button" key="export" onClick={() => setShowExportModel(true)}>
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
      <Card className={styles.performanceCard}>
        <div className={styles.performanceBoard}>
          <div className={styles.boardItem}>
            <div className={styles.boardTitle}>
              <span>订单总数（单）&nbsp;&nbsp;</span>
              <Tooltip
                placement="top"
                title="合伙人自己及团队成员的直推订单，且在统计时间内付款的数量之和(不去除已退款订单)"
                className={styles.toolTip}
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <div className={styles.amount}>{orderTotal}</div>
            <div className={styles.balanceDetail}>
              <span>
                {settledOrderTotal} / {toBeSettledOrderTotal}
              </span>
              <span>（已结算 / 待结算）</span>
            </div>
          </div>
          <div className={styles.boardItem}>
            <div className={styles.boardTitle}>
              <span>订单总金额（元） </span>
              <Tooltip
                placement="top"
                title="合伙人自己及团队成员的直推订单，且在统计时间内付款的金额汇总(不去除已退款订单)"
                className={styles.toolTip}
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <div className={styles.amount}>{orderAmountTotal}</div>
            <div>
              <span>
                {settledOrderAmount} / {toBeSettledOrderAmount}
              </span>
              <span>（已结算 / 待结算）</span>
            </div>
          </div>
          <div className={styles.boardItem}>
            <div className={styles.boardTitle}>
              <span>总佣金（元）</span>
              <Tooltip
                placement="top"
                title="合伙人自己及团队成员的直推订单，且在统计时间内付款的金额汇总(不去除已退款订单)"
                className={styles.toolTip}
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <div className={styles.amount}>{commissionTotal}</div>
            <div>
              <span>
                {settledCommissionTotal} / {toBeSettledCommissionTotal}
              </span>
              <span>（已结算 / 待结算）</span>
            </div>
          </div>
        </div>
      </Card>
      <Card size="small">
        <ProTable
          headerTitle="团队成员列表"
          rowKey="id"
          loading={loading}
          columns={columns}
          scroll={{ x: 1000, y: teamPerformanceList?.length > 5 ? '37vh' : undefined }}
          search={false}
          options={false}
          className={styles.table}
          dataSource={teamPerformanceList}
          pagination={{
            total,
            ...requestParams,
            onChange: onChangePage,
          }}
        />
      </Card>
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.PartnerStatisticsToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </PageContainer>
  );
};

export default TeamPerformance;
