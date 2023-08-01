import { FC, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useLocation } from '@umijs/max';
import {
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDateTimeRangePicker,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import { Avatar, Button, Card, Col, message, Popover, Row } from 'antd';
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';

import { exportMentorDetailList, mentorDetail } from '@/pages/partner/Mentor/MentorDetail/service';
import { getFormatDayTime } from '@/pages/utils/getSubtractDayTime';
import { exportExcelBlob } from '@/pages/utils/export';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';
import styles from './index.module.less';

const walletTabObject = {
  ALL: '全部',
  TOBESETTLED: '待结算',
  SETTLED: '已结算',
};

const statusTabItems = Object.entries(walletTabObject).map((item) => {
  return {
    label: item[1],
    key: item[0],
  };
});

const formatText = 'YYYY-MM-DD HH:mm:ss';

const PartnerDetail: FC = () => {
  const { state }: any = useLocation(); // 客户经理列表跳转的路由参数
  const formRef = useRef<ProFormInstance>();
  const [requestParams, setRequestParams] = useState<any>({
    pageNo: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [parentDetailInfo, setParentDetailInfo] = useState<any>({});
  const [refresh, setRefresh] = useState<boolean>(false); // 刷新列表
  const [activeTabKey, setActiveTabKey] = useState<string>('ALL');
  const [showExportModel, setShowExportModel] = useState(false);
  const columns: ProColumns[] = [
    {
      title: '结算时间',
      dataIndex: 'settleTime',
      align: 'center',
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      align: 'center',
    },
    {
      title: '支付金额/结算金额',
      align: 'center',
      render: (text, record) => {
        const { payPrice = 0, settledAmount = 0 } = record;
        return (
          <span>
            {payPrice || '0.00'} / {settledAmount || '0.00'}
          </span>
        );
      },
    },
    {
      title: '结算类型',
      dataIndex: 'settleType',
      align: 'center',
      valueEnum: {
        TEAM: '团长佣金',
        PARTNER: '合伙人佣金',
        TRAINING: '培训津贴',
      },
    },
    {
      title: '佣金收益（预估/实际）',
      dataIndex: 'remark',
      align: 'center',
      render: (text, record) => {
        const { estimatedCommission = 0, realCommission = 0 } = record;
        return (
          <span>
            {estimatedCommission || '0.00'} / {realCommission || '0.00'}
          </span>
        );
      },
    },
  ];
  const getRevenueDetailList = async () => {
    try {
      setLoading(true);
      const params = {
        ...requestParams,
        id: state?.parentId,
      };
      const {
        data: {
          achievementPage: { records = [], total = 0 },
          info = {},
        },
      } = await mentorDetail(params);
      setRevenueData(records);
      setParentDetailInfo({
        ...info,
      });
      setTotal(total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getFormValues = () => {
    const { time: [startTime, endTime] = [] } = formRef.current?.getFieldsValue();
    return {
      startTime: getFormatDayTime(startTime, formatText),
      endTime: getFormatDayTime(endTime, formatText),
    };
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
      settleFlag: requestParams?.settleFlag,
      pageSize: requestParams.pageSize,
      pageNo: 1,
    });
    setRefresh(!refresh);
  };

  // 导出客户经理详情列表
  const onExportList = async (excludeColumnFieldNames: string[]) => {
    setRefresh(!refresh);
    exportExcelBlob(
      `客户经理列表-${dayjs().format('YYYY-MM-DD HH_mm')}`,
      await exportMentorDetailList({
        ...getFormValues(),
        excludeColumnFieldNames,
        id: state?.parentId,
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
    getRevenueDetailList();
  }, [refresh]);
  useEffect(() => {
    setActiveTabKey(state?.tabKey);
  }, [state?.tabKey]);

  const {
    name = '-',
    remarkName = '-',
    id = '-',
    createTime = '-',
    phone = '-',
    image = '',
    teamNum = '-',
    customerNum = '',
    isDefault = false,
    allowanceRatio = '',
    settledCommission = '',
    toBeSettledCommission,
  } = parentDetailInfo || {};

  return (
    <PageContainer header={{ breadcrumb: undefined, title: '客户经理详情' }}>
      <Card title="基本信息" className={styles.partnerCard}>
        <div className={styles.partnerDetail}>
          <div className={styles.partnerInfo}>
            <div className={styles.avatar}>
              <Avatar
                size={100}
                icon={<UserOutlined />}
                src={image}
                className={styles[isDefault ? 'defaultAvatarImg' : 'avatarImg']}
              />
              {isDefault ? <span className={styles.userTag}>系统</span> : null}
            </div>
            <div className={styles.partnerInfoText}>
              <div>客户经理ID：{id || '-'}</div>
              <div>昵称/备注名：{remarkName ?? (name || '-')}</div>
            </div>
            <div className={styles.partnerInfoText}>
              <div>手机号：{phone ?? '-'}</div>
              <div>加入时间：{createTime ?? '-'}</div>
            </div>
            <div className={styles.partnerInfoText}>
              <div>团队数量：{teamNum ?? '-'}</div>
              <div>培训津贴比例：{allowanceRatio ?? '-'}%</div>
              <div className={styles.opacityNone}>不显示</div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="收益明细" className={styles.partnerCard}>
        <div className={styles.partnerForm}>
          <ProForm formRef={formRef} layout="inline" submitter={false}>
            <Row>
              <Col span={17}>
                <ProFormDateTimeRangePicker
                  labelAlign="left"
                  label="结算时间"
                  name="time"
                  width="lg"
                  placeholder={['开始时间', '结束时间']}
                />
              </Col>
              <Col span={6}>
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
              <span className={styles.mr10}>培训数据</span>
            </div>
            <div>
              <span>团队（个）：</span> <span className={styles.amount}>{teamNum || 0}</span>
            </div>
            <div>
              <span>客户（位）：</span>
              <span className={styles.amount}>{customerNum || 0}</span>
            </div>
          </div>
          <div className={styles.amountItem}>
            <div>
              <span className={styles.mr10}>培训津贴(元)</span>
              <Popover
                content={
                  <div style={{ backgroundColor: '#fff' }}>
                    <div>培训津贴:</div>
                    <div>关联客户经理团队内的所有订单，</div>
                    <div>包括客户经理直推的订单，</div>
                    <div>按照推广 佣金 *培训津贴比例给客户经理的奖励</div>
                  </div>
                }
                title=""
                // className={styles.toolTip}
              >
                <QuestionCircleOutlined />
              </Popover>
            </div>
            <span className={styles.amount}>
              ￥{(settledCommission * 1 + toBeSettledCommission * 1)?.toFixed(2) || '0.00'}
            </span>
            <span>
              ￥{settledCommission || '0.00'} / ￥{toBeSettledCommission || '0.00'}（已结算 /
              待结算）
            </span>
          </div>
        </div>
      </Card>
      <ProTable
        search={false}
        options={false}
        rowKey="id"
        loading={loading}
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
                settleFlag: key === 'ALL' ? undefined : key === 'SETTLED',
              });
              setRefresh(!refresh);
            },
          },
        }}
        dataSource={revenueData}
        pagination={{
          total,
          ...requestParams,
          onChange: onChangePage,
        }}
        scroll={{ x: 1000 }}
        columns={columns}
      />
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.TutorAchievementToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </PageContainer>
  );
};

export default PartnerDetail;
