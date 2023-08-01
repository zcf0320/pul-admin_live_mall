import { FC, memo, useEffect, useRef, useState } from 'react';
import { useLocation } from '@@/exports';
import dayjs from 'dayjs';
import {
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDateTimeRangePicker,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Col, message, Popover, Row } from 'antd';

import { exportExcelBlob } from '@/pages/utils/export';
import {
  getDetails,
  teamPerformanceExport,
} from '@/pages/distribution/popularize/PopularizeDetail/services';
import { getFormatDayTime } from '@/pages/utils/getSubtractDayTime';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';
import styles from './index.module.less';

const formatText = 'YYYY-MM-DD HH:mm:ss';
const tabList = [
  {
    key: 'ALL',
    label: '全部',
  },
  {
    key: 'TOBESETTLED',
    label: '待结算',
    color: 'red',
    status: false,
  },
  {
    key: 'SETTLED',
    label: '已结算',
    color: 'green',
    status: true,
  },
];
const PopularizeDetail: FC = () => {
  const { state }: any = useLocation(); // 合伙人列表跳转的路由参数
  const formRef = useRef<ProFormInstance>();
  const [requestParams, setRequestParams] = useState<IPopularRequestParams>({
    id: state?.parentId,
    settleFlag: state?.settleFlag,
    pageNo: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false); // 刷新列表
  const [activeKey, setActiveKey] = useState<string>('ALL');
  const [popularizeInfo, setPopularizeInfo] = useState<IPopularizeInfo>();
  const [tableData, setTableData] = useState<ITableDataList[]>([]);
  const [showExportModel, setShowExportModel] = useState(false);

  const handClickTab = (key: string) => {
    setActiveKey(key);
    setRequestParams({
      ...requestParams,
      settleFlag: key === 'ALL' ? undefined : key === 'SETTLED',
      pageNo: 1,
    });
    setRefresh(!refresh);
  };

  const getFormValues = () => {
    const [startTime, endTime] = formRef.current?.getFieldValue('time') || [];
    return {
      startTime: getFormatDayTime(startTime, 'YYYY-MM-DD HH:mm:ss'),
      endTime: getFormatDayTime(endTime, 'YYYY-MM-DD HH:mm:ss'),
    };
  };
  const getPopularizeInfo = async () => {
    // return;
    try {
      setLoading(true);
      const { data } = await getDetails({
        ...requestParams,
        id: state?.parentId,
      });
      setPopularizeInfo({ ...data.basicInfo, ...data.summary });
      setTotal(data.achievementPage?.total);
      setTableData(data.achievementPage?.records);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onQueryList = () => {
    setRequestParams({
      ...requestParams,
      ...getFormValues(),
    });
    setRefresh(!refresh);
  };

  const onReset = () => {
    formRef.current?.resetFields();
    setRequestParams({
      settleFlag: requestParams.settleFlag,
      pageSize: requestParams.pageSize,
      pageNo: 1,
    });
    setRefresh(!refresh);
  };

  const onExportList = async (excludeColumnFieldNames: string[]) => {
    setRefresh(!refresh);
    exportExcelBlob(
      `团长业绩列表-${dayjs().format(formatText)}`,
      await teamPerformanceExport({
        ...getFormValues(),
        excludeColumnFieldNames,
        id: state?.parentId,
      }),
    );
    message.success('导出成功');
  };
  const onChangePage = (pageNo: number, pageSize: number) => {
    setRequestParams({
      ...getFormValues(),
      pageNo,
      pageSize,
    });
    setRefresh(!refresh);
  };

  useEffect(() => {
    getPopularizeInfo();
  }, [refresh]);

  useEffect(() => {
    setActiveKey(state?.tabKey);
    setRequestParams({
      ...requestParams,
      settleFlag: state?.settleFlag,
    });
  }, [state?.tabKey]);

  // const columns: ProColumns[] = [
  //   // {
  //   //   title: '付款时间',
  //   //   dataIndex: 'settleTime',
  //   //   align: 'center',
  //   //   ellipsis: true,
  //   // },
  //   {
  //     title: '订单号',
  //     dataIndex: 'orderNo',
  //     align: 'center',
  //     ellipsis: true,
  //   },
  //   {
  //     title: '支付金额',
  //     dataIndex: 'payPrice',
  //     align: 'center',
  //     render: (text) => <span> ¥{text}</span>,
  //   },
  //   // {
  //   //   title: '买家信息',
  //   //   dataIndex: 'createTime',
  //   //   align: 'center',
  //   //   render: (text, record) => {
  //   //     return (
  //   //       <div className={styles.flexColumn}>
  //   //         <span>昵称：{record?.name || '-'}</span>
  //   //         <span>ID：{record?.id || '-'}</span>
  //   //         <span>手机号：{record?.phone || '-'}</span>
  //   //       </div>
  //   //     );
  //   //   },
  //   // },
  //   {
  //     title: '结算状态',
  //     dataIndex: 'settleFlag',
  //     align: 'center',
  //     render: (text, record) => {
  //       const currentStatus: any = tabList.find((item) => item.status === text);
  //       return (
  //         <>
  //           <Badge color={currentStatus?.color} className={styles.mr10} />
  //           <span>{record.settleFlag ? '已结算' : '待结算' || ''}</span>
  //         </>
  //       );
  //     },
  //   },
  //   {
  //     title: '结算时间',
  //     search: false,
  //     align: 'center',
  //     dataIndex: 'settleTime',
  //   },
  //   {
  //     title: '佣金比例',
  //     search: false,
  //     align: 'center',
  //     dataIndex: 'commissionRate',
  //     render: (text: any) => <span>{text * 100} %</span>,
  //   },
  //   {
  //     title: '预估佣金/实际佣金',
  //     dataIndex: 'realCommission',
  //     search: false,
  //     align: 'center',
  //
  //     render: (text: any, record) => (
  //       <span>
  //         ¥{record?.estimatedCommission || '0.00'} / ¥{record?.realCommission || '0.00'}
  //       </span>
  //     ),
  //   },
  //   // {
  //   //   title: '佣金层级',
  //   //   search: false,
  //   //   align: 'center',
  //   //   dataIndex: 'expenditures',
  //   //   ellipsis: true,
  //   // },
  // ];
  const columns: ProColumns[] = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      align: 'center',
      width: 200,
    },
    {
      title: '结算状态',
      dataIndex: 'settleFlag',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return (
          <>
            <Badge color={record.settleFlag ? 'green' : 'red'} className={styles.mr10} />
            <span>{record.settleFlag ? '已结算' : '待结算' || ''}</span>
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
      title: '金额明细',
      dataIndex: 'payPrice',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return (
          <div className={styles.flexColumn}>
            <span>支付金额：¥{record?.payPrice}</span>
            <span>结算金额：¥{record?.settledAmount}</span>
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
          <div className={styles.flexColumn}>
            <span>预估佣金：¥{record?.estimatedCommission || 0}</span>
            <span>实际佣金：¥{record?.realCommission || 0}</span>
            <span>佣金比例：{record?.commissionRate * 100 || 0}%</span>
          </div>
        );
      },
    },
    {
      title: '结算时间',
      width: 200,
      dataIndex: 'settleTime',
      align: 'center',
    },
  ];
  const {
    image = '-',
    orderTotal = 0,
    phone = '',
    levelName = '',
    createTime = '',
    customerCount = 0,
    name = '',
    supName = '',
    settledOrder = '-',
    toBeSettledOrder = '-',
    totalAmount = 0,
    settledAmount = '-',
    toBeSettledAmount = '-',
    tutorId = '-',
    orgName = '',
  } = popularizeInfo || {};
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card title="基本信息" className={styles.mb20}>
        <div className={styles.partnerDetail}>
          <div className={styles.partnerInfo}>
            <div className={styles.avatar}>
              <Avatar
                src={image}
                size={100}
                icon={<UserOutlined />}
                className={styles[state?.isDefault ? 'defaultAvatarImg' : 'avatarImg']}
              />
              {state?.isDefault ? <span className={styles.userTag}>系统</span> : null}
            </div>
            <div className={styles.partnerInfoText}>
              <div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;团长ID：
                {state?.parentId || '-'}
              </div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;团长等级：{levelName || '-'}</div>
              <div>
                <span>下级客户数</span>
                <span>：{customerCount ?? '-'}</span>
              </div>
            </div>
            <div className={styles.partnerInfoText}>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;昵称：{name ?? '-'}</div>
              <div>上级名称：{supName ?? '-'}</div>
              <div>绑定客户经理：{tutorId ?? '-'}</div>
            </div>
            <div className={styles.partnerInfoText}>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;手机号：{phone ?? '-'}</div>
              <div>加入时间：{createTime ?? '-'}</div>
              <div>所属团队：{orgName ?? '-'}</div>
            </div>
          </div>
        </div>
      </Card>
      <Card title="团长业绩" className={styles.mb20}>
        <div className={styles.partnerForm}>
          <ProForm formRef={formRef} layout="inline" submitter={false}>
            <Row>
              <Col span={16}>
                <ProFormDateTimeRangePicker
                  labelAlign="left"
                  label="结算时间"
                  name="time"
                  width="lg"
                  placeholder={['开始时间', '结束时间']}
                />
              </Col>
              <Col span={8}>
                <div className={styles.partnerBtns}>
                  <Button htmlType="button" key="search" type="primary" onClick={onQueryList}>
                    筛选
                  </Button>
                  <Button htmlType="button" key="reset" onClick={onReset}>
                    重置
                  </Button>
                  <Button
                    htmlType="button"
                    key="export"
                    // onClick={onExportList}
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
        </div>
        <div className={styles.amountInfo}>
          <div className={styles.amountItem}>
            <div>
              <span className={styles.mr10}>分佣订单</span>
              <Popover
                content={
                  <div style={{ backgroundColor: '#fff' }}>
                    统计时间内付款，且团长参与分佣的订单数(不去除已退款订单)
                  </div>
                }
                title=""
              >
                <QuestionCircleOutlined />
              </Popover>
            </div>
            <span className={styles.amount}>{orderTotal ?? '-'}</span>
            <span>
              {settledOrder} / {toBeSettledOrder}（已结算 / 待结算）
            </span>
          </div>
          <div className={styles.amountItem}>
            <div>
              <span className={styles.mr10}>总佣金(元)</span>
              <Popover
                content={
                  <div style={{ backgroundColor: '#fff' }}>
                    <div>统计时间内付款，且可结算给团长的佣金总额(含已结算和待结算)，</div>
                    <div>结算前发生退款的订 单，会重新核算佣金</div>
                  </div>
                }
                title=""
              >
                <QuestionCircleOutlined />
              </Popover>
            </div>
            <span className={styles.amount}>{totalAmount ?? '-'}</span>
            <span>
              {settledAmount} / {toBeSettledAmount}（已结算 / 待结算）
            </span>
          </div>
        </div>
      </Card>
      <ProTable
        search={false}
        options={false}
        rowKey="orderNo"
        dataSource={tableData}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey,
            items: tabList,
            onChange: (key) => handClickTab(key as string),
          },
        }}
        columns={columns}
        loading={loading}
        pagination={{
          total,
          ...requestParams,
          onChange: onChangePage,
        }}
      />
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.TeamAchievementToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </PageContainer>
  );
};

export default memo(PopularizeDetail);
