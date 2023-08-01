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
import { Avatar, Badge, Button, Card, Col, message, Popover, Row } from 'antd';
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';

import {
  exportPartnerDetailList,
  revenueDetail,
} from '@/pages/partner/PartnerManagement/PartnerList/services';
import { getFormatDayTime } from '@/pages/utils/getSubtractDayTime';
import { exportExcelBlob } from '@/pages/utils/export';

import styles from './index.module.less';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';

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
  const { state }: any = useLocation(); // 合伙人列表跳转的路由参数
  const formRef = useRef<ProFormInstance>();
  const [requestParams, setRequestParams] = useState<any>({
    pageNo: 1,
    pageSize: 10,
    id: state?.parentId,
    settleFlag: state?.settleFlag,
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
      title: '订单号',
      dataIndex: 'orderNo',
      align: 'center',
      width: 200,
    },
    {
      title: '团长信息',
      dataIndex: 'income',
      align: 'center',
      width: 300,
      render: (text, record) => {
        const { teamImage = '', teamName = '', teamPhone = '' } = record || {};
        return (
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <Avatar size={48} icon={<UserOutlined />} src={teamImage} />
            </div>
            <div className={styles.flexColumn}>
              <span>昵称：{teamName || '-'}</span>
              <span>手机号：{teamPhone || '-'}</span>
            </div>
          </div>
        );
      },
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
          partner = {},
          summary = {},
        },
      } = await revenueDetail(params);
      setRevenueData(records);
      setParentDetailInfo({
        ...partner,
        ...summary,
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
      pageSize: requestParams.pageSize,
      pageNo: 1,
    });
    setRefresh(!refresh);
  };

  // 导出合伙人详情列表
  const onExportList = async (excludeColumnFieldNames: string[]) => {
    setRefresh(!refresh);
    exportExcelBlob(
      `合伙人收益列表-${dayjs().format('YYYY-MM-DD HH_mm')}`,
      await exportPartnerDetailList({
        ...getFormValues(),
        id: state?.parentId,
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
    getRevenueDetailList();
  }, [refresh]);
  useEffect(() => {
    setActiveTabKey(state?.tabKey);
  }, [state?.tabKey]);

  const {
    settledAmount = 0,
    toBeSettledAmount = 0,
    totalAmount = 0,
    name = '-',
    remarkName = '-',
    levelName = '-',
    id = '-',
    createTime = '-',
    phone = '-',
    image = '',
    isClear = '-',
    customerNum = '-',
    status = '',
    isDefault = false,
  } = parentDetailInfo || {};

  return (
    <PageContainer header={{ breadcrumb: undefined, title: '合伙人详情' }}>
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
              <div>合伙人ID：{id || '-'}</div>
              <div>昵称/备注名：{remarkName ?? (name || '-')}</div>
              <div>合伙人等级：{levelName ?? '-'}</div>
            </div>
            <div className={styles.partnerInfoText}>
              <div>团队数量：{customerNum ?? '-'}</div>
              <div>加入时间：{createTime ?? '-'}</div>
              <div>
                状态：
                <span style={{ color: !status ? 'green' : 'red' }}>
                  {!status ? '启用' : '禁用'}
                </span>
              </div>
            </div>
            <div className={styles.partnerInfoText}>
              <div>手机号：{phone ?? '-'}</div>
              <div>
                清除状态：{' '}
                <span style={{ color: isClear ? 'red' : 'green' }}>
                  {isClear ? '已清除' : '正常'}
                </span>
              </div>
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
        </div>
        <div className={styles.amountInfo}>
          <div className={styles.amountItem}>
            <div>
              <span className={styles.mr10}>佣金</span>
              <Popover
                content={
                  <div style={{ backgroundColor: '#fff' }}>
                    <div>合伙人佣金收益</div>
                  </div>
                }
                title=""
                className={styles.toolTip}
              >
                <QuestionCircleOutlined />
              </Popover>
            </div>
            <span className={styles.amount}>￥{totalAmount || '0.00'}</span>
            <span>
              ￥{settledAmount || '0.00'} / ￥{toBeSettledAmount || '0.00'}（已结算 / 待结算）
            </span>
          </div>
        </div>
      </Card>
      <ProTable
        search={false}
        options={false}
        rowKey="orderNo"
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
                pageSize: requestParams.pageSize,
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
        scroll={{ x: 1200, y: revenueData?.length > 4 ? '20vh' : undefined }}
        columns={columns}
      />
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.PartnerAchievementToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </PageContainer>
  );
};

export default PartnerDetail;
