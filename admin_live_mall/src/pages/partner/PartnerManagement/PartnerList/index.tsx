import { FC, useEffect, useState } from 'react';
import { history } from '@umijs/max';
import dayjs from 'dayjs';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  MenuProps,
  message,
  Popconfirm,
  Row,
} from 'antd';
import {
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { UserOutlined } from '@ant-design/icons';

import EditRemarkModel from '@/pages/partner/PartnerManagement/PartnerList/EditRemarkModel';
import EditLevelModel from '@/pages/partner/PartnerManagement/PartnerList/EditLevelModel';
import ClearPartner from '@/pages/partner/PartnerManagement/PartnerList/ClearPartnerModel';

import {
  disabledPartner,
  exportPartnerList,
  partnerLevelList,
  partnerList,
} from '@/pages/partner/PartnerManagement/PartnerList/services';
import { exportExcelBlob } from '@/pages/utils/export';
import { getFormatDayTime } from '@/pages/utils/getSubtractDayTime';
import styles from './index.module.less';
import { IQueryParams } from '@/pages/Customer/TotalCustomer/data';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';

const formatText = 'YYYY-MM-DD HH:mm:ss';
export const checkIcon = require('@/assets/check.png');
const PartnerList: FC = () => {
  const [form] = Form.useForm();
  const [partnerLevelOption, setPartnerLevel] = useState<IOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [requestParams, setRequestParams] = useState<IPartnerRequestParams>({
    pageNo: 1,
    pageSize: 10,
  });
  const [total, setTotal] = useState<number>(0);
  const [partnerData, setPartnerData] = useState<IPartnerList[]>([]);
  const [columnsData, setColumnsData] = useState<IPartnerList>({
    level: 0,
    settleTime: '',
    status: false,
    createTime: '',
    customerNum: 0,
    id: '',
    image: '',
    isDefault: false,
    levelName: '',
    name: '',
    phone: '',
    remarkName: '',
    settledCommission: '',
    toBeSettledCommission: '',
  });
  const [refresh, setRefresh] = useState<boolean>(false); // 刷新列表
  const [showRemark, setShowRemark] = useState<boolean>(false); // 开启修改备注名弹窗
  const [showLevel, setShowLevel] = useState<boolean>(false); // 开启修改等级弹窗
  const [showClearPartner, setShowClearPartner] = useState<boolean>(false); // 显示清退弹窗
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
  const getFormValues = (): IQueryParams => {
    const { timeData = [], status = -1 } = form.getFieldsValue();
    const params = {
      ...form.getFieldsValue(),
      startTime: getFormatDayTime(timeData?.[0], formatText),
      endTime: getFormatDayTime(timeData?.[1], formatText),
      status: status === -1 ? undefined : Boolean(status),
    };
    delete params.timeData;
    return params;
  };

  const getPartnerList = async (): Promise<any> => {
    try {
      setLoading(true);
      const {
        data: { records = [], total = 0 },
      } = await partnerList(requestParams);
      // const defaultPartner = records?.find((partner: IPartnerList) => partner.isDefault);
      // if (defaultPartner) {
      //   const otherPartner = records?.filter(
      //     (partner: IPartnerList) => partner?.id !== defaultPartner?.id,
      //   );
      //   // 置顶系统默认合伙人
      //   setPartnerData([defaultPartner, ...otherPartner]);
      // } else {
      //   setPartnerData(records);
      // }
      setPartnerData(records);
      setTotal(total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
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

  // 重置刷新列表
  const onReset = (): void => {
    form.resetFields();
    setRequestParams({
      pageSize: requestParams.pageSize,
      pageNo: 1,
    });
    setRefresh(!refresh);
  };
  const onChangePage = (pageNo: number, pageSize: number): void => {
    setRequestParams({
      ...requestParams,
      pageNo,
      pageSize,
    });
    setRefresh(!refresh);
  };

  // 导出列表
  const onExportList = async (excludeColumnFieldNames: string[]) => {
    // const endTime = form.getFieldValue('timeData')?.[1];
    // if (!endTime) {
    //   message.error('请选择加入时间！');
    //   return;
    // }
    setRefresh(!refresh);
    exportExcelBlob(
      `合伙人列表-${dayjs().format('YYYY-MM-DD HH_mm')}`,
      await exportPartnerList({
        ...getFormValues(),
        excludeColumnFieldNames,
      }),
    );
    message.success('导出成功');
  };

  // 启用禁用合伙人
  const onChangePartnerStatus = async (id: string = '', status: boolean) => {
    await disabledPartner({ id });
    message.success(!status ? '已禁用' : '启用成功');
    setRefresh(!refresh);
  };
  const columns: ProColumns[] = [
    {
      title: '合伙人',
      dataIndex: 'partnerInfo',
      align: 'center',
      width: 300,
      render: (text, record) => {
        const {
          image = '',
          name = '',
          phone = '',
          id = '',
          remarkName = '',
          isDefault = false,
        } = record || {};
        return (
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <Avatar
                size={48}
                icon={<UserOutlined />}
                src={image}
                className={styles[isDefault ? 'defaultAvatarImg' : 'avatarImg']}
              />
              {isDefault ? <span className={styles.userTag}>系统</span> : null}
            </div>
            <div className={styles.flexColumn}>
              <span>昵称：{remarkName ?? name}</span>
              <span>ID：{id || '-'}</span>
              <span>手机号：{phone || '-'}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '加入时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 200,
    },
    {
      title: '团队成员',
      dataIndex: 'customerNum',
      align: 'center',
      render: (text, record) => {
        return (
          <div
            onClick={() => {
              history.push('/partner/PartnerManagement/TeamMember', {
                parentId: record?.id,
                parentName: record?.name,
              });
            }}
          >
            <span style={{ color: '#2e75f5' }}>{text || 0}</span>
            {record?.customerNum !== null ? (
              // <SearchOutlined className={styles.solutionOutlined} />
              <img src={checkIcon} alt="" className={styles.solutionOutlined} />
            ) : null}
          </div>
        );
      },
    },
    {
      title: '收益',
      search: false,
      align: 'center',
      width: 150,
      render: (_, { toBeSettledCommission = '0.00', settledCommission = '0.00', id = '' }) =>
        toBeSettledCommission && settledCommission ? (
          <div className={styles.expenditure}>
            <div className={styles.expenditureContent}>
              <span>已结算：</span>
              {/*<span>¥{settledCommission}</span>*/}
              <div
                className={styles.amount}
                onClick={() =>
                  history.push('/partner/PartnerManagement/PartnerDetail', {
                    parentId: id,
                    tabKey: 'SETTLED',
                    settleFlag: true,
                  })
                }
              >
                <span>¥{settledCommission}</span>
                <img src={checkIcon} alt="" className={styles.solutionOutlined} />
              </div>
            </div>
            <div className={styles.expenditureContent}>
              <span>待结算：</span>
              {/*<span>¥{toBeSettledCommission}</span>*/}
              <div
                className={styles.pendingAmount}
                onClick={() =>
                  history.push('/partner/PartnerManagement/PartnerDetail', {
                    parentId: id,
                    tabKey: 'TOBESETTLED',
                    settleFlag: false,
                  })
                }
              >
                <span>¥{toBeSettledCommission}</span>
                {/*<span className={styles.checkText}>查看</span>*/}
                <img src={checkIcon} alt="" className={styles.solutionOutlined} />
              </div>
            </div>
          </div>
        ) : (
          '-'
        ),
    },
    // {
    //   title: '客户经理',
    //   dataIndex: 'consumptionTime',
    //   search: false,
    //   ellipsis: true,
    //   align: 'center',
    // },
    {
      title: '合伙人等级',
      dataIndex: 'levelName',
      search: false,
      // width: 140,
      // ellipsis: true,
      align: 'center',
      render: (_, record) => {
        const levelStatus = partnerLevelOption.find(
          (partnerLevel) => partnerLevel.value === record?.level,
        )?.status;
        return (
          <div>
            {record?.levelName || '-'}
            <span className={styles.levelStatusText}>{levelStatus ? '' : '（已禁用）'}</span>
          </div>
        );
      },
    },
    {
      title: '合伙人状态',
      dataIndex: 'status',
      align: 'center',
      render: (text) => (
        <span style={{ color: !text ? 'green' : 'red' }}>{!text ? '启用' : '禁用'}</span>
      ),
    },
    {
      title: '操作',
      width: 140,
      fixed: 'right',
      align: 'center',
      render: (text, record: IPartnerList) => {
        const { id = '', status = '', isDefault = false } = record || {};
        const moreBtns: MenuProps['items'] = [
          {
            key: 'EDITLEVEL',
            label: (
              <span
                className={styles.moreItemBtn}
                onClick={() => {
                  setShowLevel(true);
                  setColumnsData(record);
                }}
              >
                修改等级
              </span>
            ),
          },
          {
            key: 'EDITREMARK',
            label: (
              <span
                className={styles.moreItemBtn}
                onClick={() => {
                  setShowRemark(true);
                  setColumnsData(record);
                }}
              >
                修改备注名
              </span>
            ),
          },
        ];
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
            {isDefault ? null : (
              <>
                <Button
                  type="link"
                  onClick={() => {
                    setShowClearPartner(true);
                    setColumnsData(record);
                  }}
                >
                  清退
                </Button>
                <Popconfirm
                  title=""
                  placement="top"
                  description={
                    !status
                      ? '禁用期间不享受合伙人收益，确认禁用吗？'
                      : '启用后恢复合伙人收益，确认启用吗？'
                  }
                  onConfirm={() => onChangePartnerStatus(id, Boolean(status))}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link">
                    <span style={{ color: !status ? 'red' : '#047903' }}>
                      {!status ? '禁用' : '启用'}
                    </span>
                  </Button>
                </Popconfirm>
              </>
            )}
            <Dropdown menu={{ items: moreBtns }} placement="bottom" arrow>
              <Button type="link" style={{ color: '#2e75f5' }}>
                更多
              </Button>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getPartnerLevelList(); // 合伙人等级列表
  }, []);

  useEffect(() => {
    getPartnerList();
  }, [refresh]);

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card className={styles.headerCard}>
        <ProForm form={form} layout="inline" submitter={false}>
          <Row gutter={[20, 20]}>
            <Col span={8}>
              <ProFormText
                label="合伙人信息"
                name="partnerInfo"
                placeholder="备注名/昵称/手机号/ID"
              />
            </Col>
            <Col span={6}>
              <ProFormSelect
                label="状态"
                name="status"
                placeholder="请选择状态"
                options={[
                  {
                    value: 0,
                    label: '启用',
                  },
                  {
                    value: 1,
                    label: '禁用',
                  },
                ]}
              />
            </Col>
            {/*<Col span={8}>*/}
            {/*  <ProFormText label="客户经理" name="tutorInfo" placeholder="备注名/昵称/手机号/ID" />*/}
            {/*</Col>*/}
            <Col span={8}>
              <ProFormSelect
                name="level"
                label="合伙人等级"
                placeholder="请选择合伙人等级"
                options={partnerLevelOption}
              />
            </Col>
            <Col span={12}>
              <ProFormDateTimeRangePicker
                label="加入时间"
                name="timeData"
                allowClear
                placeholder={['起始时间', '结束时间']}
              />
            </Col>
            <Col span={24}>
              <div key="buttons" className={styles.buttons}>
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
      <Card size="small">
        <ProTable
          search={false}
          options={false}
          rowKey="id"
          headerTitle="合伙人列表"
          scroll={{ x: 1200, y: partnerData?.length > 8 ? '60vh' : undefined }}
          loading={loading}
          columns={columns}
          dataSource={partnerData}
          pagination={{
            ...requestParams,
            current: requestParams.pageNo,
            total,
            onChange: onChangePage,
          }}
        />
      </Card>

      <EditRemarkModel
        showRemark={showRemark}
        setShowRemark={setShowRemark}
        setRefresh={() => setRefresh(!refresh)}
        {...columnsData}
      />
      <EditLevelModel
        showLevel={showLevel}
        setShowLevel={setShowLevel}
        partnerLeveList={partnerLevelOption}
        setRefresh={() => setRefresh(!refresh)}
        {...columnsData}
      />
      <ClearPartner
        setShowClearPartner={setShowClearPartner}
        setRefresh={setRefresh}
        showClearPartner={showClearPartner}
        {...columnsData}
      />
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.PartnerToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </PageContainer>
  );
};
export default PartnerList;
