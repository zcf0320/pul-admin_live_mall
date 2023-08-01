import { memo, useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  MenuProps,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
} from 'antd';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { CopyOutlined, ExclamationCircleFilled, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import TagModel from '@/pages/Customer/TotalCustomer/TagModel';
import DetailDrawer from '@/pages/Customer/TotalCustomer/DetailDrawer';
import LevelModel from '@/pages/Customer/TotalCustomer/LevelModel';

import {
  customerStatus,
  exportCustomerList,
  getClients,
  getClientTagList,
  getIdentity,
  setAsPartner,
  setAsTeam,
  setAsTutor,
} from '@/pages/Customer/TotalCustomer/services';
import { getUserLevel } from '@/pages/Customer/LevelSetting/services';
import {
  IOperateBtns,
  IOption,
  IPageParams,
  IQueryParams,
  ITimeData,
  ITotalCustomerTabCom,
} from './data.d';
import { exportExcelBlob } from '@/pages/utils/export';
import styles from './index.module.less';
import { copyToClipboard } from '@/pages/utils';
import AttendanceRecord from '@/pages/Customer/TotalCustomer/AttendanceRecord';
// import ModifyAddress from '@/pages/Customer/TotalCustomer/ModifyAddress';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const userIdentityEnum = [
  {
    value: 'CUSTOMER',
    label: '普通客户',
    color: '',
  },
  {
    value: 'TEAM',
    label: ' 团长 ',
    color: 'orange',
  },
  {
    value: 'PARTNER',
    label: '合伙人',
    color: 'magenta',
  },
  // {
  //   value: 'TUTOR',
  //   label: ' 客户经理 ',
  //   color: 'purple',
  // },
  {
    value: 'TEAM_AND_PARTNER',
    label: '团长和合伙人',
    labels: [
      {
        color: 'orange',
        label: '团长',
      },
      {
        color: 'magenta',
        label: '合伙人',
      },
    ],
    multiple: true,
  },
]; //用户类型枚举

const timeOption = [
  {
    value: 1,
    label: '成为客户时间',
  },
  {
    value: 2,
    label: '最近交易时间',
  },
  // {
  //   value: 3,
  //   label: '成为会员时间',
  // },
];

export default memo(() => {
  const [form] = Form.useForm();
  const [requestParams, setRequestParams] = useState<IPageParams>({
    pageSize: 10,
    pageNo: 1,
  }); // 分页参数
  const [total, setTotal] = useState<number>(0); // 数据总条数
  const [loading, setLoading] = useState<boolean>(false); // 列表loading
  const [clientTagList, setClientTagList] = useState<IOption[]>([]); // 用户标签
  const [levelSource, setLevelSource] = useState<IOption[]>([]); // 会员等级
  const [dataSource, setDataSource] = useState<ITotalCustomerTabCom[]>([]); // 客户数据
  const [timeData, setTimeData] = useState<ITimeData>({
    startTime: '',
    endTime: '',
  });
  const [isDisable, setIsDisable] = useState<boolean>(true); // 是否禁止选取时间
  const [showDetail, setShowDetail] = useState<boolean>(false); // 显示详情抽屉
  const [showAttendance, setShowAttendance] = useState<boolean>(false); // 显示签到日历
  const [columnRecord, setColumnRecord] = useState<ITotalCustomerTabCom | any>(); // 点击当前列的详情数据
  const [showTagModel, setShowTagModel] = useState<boolean>(false); // 是否显示打标签弹窗
  const [showLevelModel, setShowLevelModel] = useState<boolean>(false); // 是否显示调整等级弹窗
  const [showModifyAddress, setShowModifyAddress] = useState<boolean>(false); // 显示修改地址弹窗
  const [refresh, setRefresh] = useState<boolean>(false); // 用于刷新列表
  const [identityEnum, setIdentityEnum] = useState<any>(userIdentityEnum);
  const [signInDays, setSignInDays] = useState(0);
  const [showExportModel, setShowExportModel] = useState(false);
  // const [isCopy, setIsCopy] = useState(false);

  // 获取用户标签列表
  const getClientTagsList = async (): Promise<void> => {
    const { data = [] } = await getClientTagList({ pageSize: 999, pageNo: 1 });
    setClientTagList(
      data?.records?.map(({ id, name }: { id: number; name: string }) => ({
        value: id,
        label: name,
      })),
    );
  };

  // 获取会员等级列表
  const getUserLevelList = async (): Promise<void> => {
    try {
      const { data = [] } = await getUserLevel();
      const levelList = data.map(({ level, name }: { level: string; name: string }) => ({
        value: +level,
        label: name,
      }));
      setLevelSource(levelList);
    } catch (e) {
      console.error(e);
    }
  };

  // 选择时间类型，如果清楚时间类型则禁用时间选择器并重置数据
  const onChangeTimeType = (value: number): void => {
    const isClear = value === undefined;
    setIsDisable(isClear);
    setTimeData({ startTime: '', endTime: '' });
    form.setFieldValue('timeData', null);
  };

  // 获取客户信息列表
  const getClientsList = useCallback(async (): Promise<any> => {
    try {
      setLoading(true);
      const {
        data: { records = [], total },
      } = await getClients(requestParams);

      // setDataSource(records.map((item: any) => ({ ...item, rowKey: crypto.randomUUID() })));
      setDataSource(records.map((item: any) => ({ ...item, rowKey: item.id })));
      setTotal(total);
      //setIsCopy(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  // 查询客户列表
  const onQueryList = async (): Promise<void> => {
    if (!isDisable) await form.validateFields();
    const { startTime = '', endTime = '' } = timeData;
    const params: IQueryParams & IPageParams = {
      ...form.getFieldsValue(),
      startTime,
      endTime,
    };
    delete params.timeData;
    // 设置
    setRequestParams({
      ...requestParams,
      ...params,
      pageNo: 1,
    });
    setRefresh(!refresh);
  };

  // 重置筛选内容
  const onClearQuery = (): void => {
    form.resetFields();
    setRequestParams({
      pageSize: requestParams?.pageSize,
      pageNo: 1,
    });
    setRefresh(!refresh);
  };

  const onExportList = async (excludeColumnFieldNames: string[]) => {
    setRefresh(!refresh);
    if (!isDisable) await form.validateFields();
    const { startTime = '', endTime = '' } = timeData;
    const params: IQueryParams & IPageParams = {
      ...form.getFieldsValue(),
      startTime,
      endTime,
      excludeColumnFieldNames,
    };
    exportExcelBlob(
      `客户列表-${dayjs().format('YYYY-MM-DD HH_mm')}`,
      await exportCustomerList(params),
    );
    message.success('导出成功');
  };
  // 修改分页
  const onChangePage = (pageNo: number, pageSize: number): void => {
    setRequestParams({
      ...requestParams,
      pageSize,
      pageNo,
    });
    setRefresh(!refresh);
  };

  // 修改时间组件
  const onChangeTime = (_: any, timeArr: string[]): void => {
    const [startTime = '', endTime = ''] = timeArr;
    setTimeData({
      startTime,
      endTime,
    });
  };

  // 设置团长/客户经理/合伙人
  const setIdentity = async (record: ITotalCustomerTabCom, identity: string) => {
    let method: any;
    switch (identity) {
      case 'TEAM':
        method = setAsTeam;
        break;
      case 'TUTOR':
        method = setAsTutor;
        break;
      case 'PARTNER':
        method = setAsPartner;
        break;
      default:
    }
    const userIdentity = identityEnum.find(({ value }: any) => value === identity)?.label;
    await method({ id: record?.id });
    message.success(`成功设置为${userIdentity}`);
    setRefresh(!refresh);
  };

  const setCustomerStatus = (record: ITotalCustomerTabCom) => {
    Modal.confirm({
      title: '警告',
      icon: <ExclamationCircleFilled />,
      centered: true,
      content: !record?.status
        ? '确定拉黑当前用户? 账号将被冻结使用！'
        : '当前用户账户将被解除冻结，是否继续?',
      onOk: async () => {
        await customerStatus({ id: record?.id });
        message.success(`${!record?.status ? '客户已拉黑' : '已解冻'}`);
        setRefresh(!refresh);
      },
      okText: !record?.status ? '拉黑' : '解冻',
      onCancel() {},
    });
  };

  // 列表操作项
  const operateBtns = (operateTitle?: string): IOperateBtns[] => [
    {
      operateTitle: '详情',
      clickFc: () => setShowDetail(true),
    },
    // {
    //   operateTitle: '变更上级',
    // },
    {
      operateTitle,
      dynamicTitle: true,
      clickFc: setCustomerStatus,
    },
    {
      operateTitle: '签到',
      clickFc: () => setShowAttendance(true),
    },
    {
      operateTitle: '调整等级',
      clickFc: () => setShowLevelModel(true),
    },
    // {
    //   type: 'SETTEAM',
    //   operateTitle: '设为团长',
    //   clickFc: setTeam,
    // },
  ];

  const columns: ProColumns<ITotalCustomerTabCom>[] = [
    {
      title: '客户信息',
      dataIndex: 'userName',
      search: false,
      width: 320,
      align: 'center',
      render: (_, record: ITotalCustomerTabCom) => {
        const {
          headImage = '',
          userName = '',
          phone = '',
          identity = '',
          registerTime = '',
          id = '',
          levelName = '',
          growthValue = 0,
          isDefault = false,
        } = record || {};
        const userInfo = identityEnum?.find(({ value }: any) => value === identity); // 当前客户身份信息
        // console.log(userInfo);
        // const IdIcon = memo((props: any) => {
        //   const { onClick, customerId, type } = props || {};
        //   return (
        //     <>
        //       {isCopy && customerId === columnRecord?.[type] ? (
        //         <CheckOutlined className={styles.copyIdSuccess} onClick={onClick} />
        //       ) : (
        //         <CopyOutlined className={styles.copyId} onClick={onClick} />
        //       )}
        //     </>
        //   );
        // });
        return (
          <div className={styles.userInfo}>
            <div style={{ position: 'relative' }}>
              <Avatar
                size={48}
                icon={<UserOutlined />}
                src={headImage}
                className={styles[isDefault ? 'defaultAvatarImg' : 'avatarImg']}
              />
              {isDefault ? <span className={styles.userTag}>系统</span> : null}
            </div>
            <div className={styles.userBasicInfo}>
              <span>
                昵称：{userName ?? '-'}
                <CopyOutlined
                  style={{ color: '#16adff' }}
                  onClick={() => {
                    copyToClipboard(userName).then(() => {
                      message.success('复制成功');
                    });
                  }}
                />
              </span>
              <span>
                客户ID：{id ?? '-'}
                <CopyOutlined
                  style={{ color: '#16adff' }}
                  onClick={() => {
                    copyToClipboard(id).then(() => {
                      message.success('复制成功');
                    });
                  }}
                />
              </span>
              <span>
                手机号：{phone ?? '-'}
                <CopyOutlined
                  style={{ color: '#16adff' }}
                  onClick={() => {
                    copyToClipboard(phone).then(() => {
                      message.success('复制成功');
                    });
                  }}
                />
              </span>
              <span>
                身份：
                {userInfo?.multiple ? (
                  userInfo?.labels?.map((item: any) => (
                    <Tag key={item.value} color={item.color} className={styles.tag}>
                      {item.label}
                    </Tag>
                  ))
                ) : (
                  <Tag color={userInfo?.color || ''} className={styles.tag}>
                    {userInfo?.label || '普通用户'}
                  </Tag>
                )}
              </span>
              <span>会员等级：{levelName ?? '-'}</span>
              <span>成长值：{growthValue ?? '-'}</span>
              <span>注册时间：{registerTime ?? '-'}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '标签',
      ellipsis: true,
      search: false,
      width: 250,
      align: 'center',
      render: (_, record: ITotalCustomerTabCom) => {
        return (
          <Tooltip
            title={
              record?.labels?.length ? (
                <>
                  {record?.labels?.map(({ name, id }) => (
                    <Tag color="blue" key={id}>
                      {name}
                    </Tag>
                  ))}
                </>
              ) : null
            }
            color="#fff"
          >
            {record?.labels?.length
              ? record?.labels?.slice(0, 3).map(({ name, id }) => (
                  <Tag color="blue" key={id}>
                    {name}
                  </Tag>
                ))
              : '-'}
          </Tooltip>
        );
      },
    },
    {
      title: '上级信息',
      search: false,
      ellipsis: true,
      align: 'center',
      width: 320,
      render: (_, record: ITotalCustomerTabCom) => {
        const {
          teamOrgName = '',
          teamHeadImage = '',
          teamLevelName = '',
          teamPhone = '',
          teamName = '',
        } = record || {};
        return (
          <div className={styles.userInfo}>
            <Avatar
              size={48}
              icon={<UserOutlined />}
              src={teamHeadImage}
              className={styles.avatar}
            />
            <div className={styles.userBasicInfo}>
              <span>所属团队：{teamOrgName || '-'}</span>
              <span>团长昵称：{teamName || '-'}</span>
              <span>手机号：{teamPhone || '-'}</span>
              <span>团长等级：{teamLevelName || '-'}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '客户来源',
      dataIndex: 'source',
      search: false,
      width: 200,
      align: 'center',
      valueEnum: {
        IMPORT: '后台导入',
        APPLET: '小程序邀请',
      },
    },
    {
      title: '最近交易时间',
      dataIndex: 'consumptionTime',
      search: false,
      width: 200,
      align: 'center',
    },
    {
      title: '累计消费金额',
      dataIndex: 'consumptionAmount',
      search: false,
      width: 180,
      align: 'center',
      render: (_, record: ITotalCustomerTabCom) => (
        <div>{record?.consumptionAmount ? `¥${record?.consumptionAmount}` : '-'}</div>
      ),
    },
    { title: '消费次数', dataIndex: 'consumptionNum', search: false, width: 200, align: 'center' },
    {
      title: '客单价',
      dataIndex: 'consumptionAmount',
      search: false,
      width: 180,
      align: 'center',
      render: (_, record: ITotalCustomerTabCom) => {
        const { consumptionNum = 0, consumptionAmount = '' } = record || {};
        if (consumptionNum === 0) {
          return '¥0';
        }
        return (
          <div>
            {consumptionAmount
              ? `¥${(Number(consumptionAmount) / consumptionNum).toFixed(2)}`
              : '-'}
          </div>
        );
      },
    },
    {
      title: '操作',
      width: 250,
      fixed: 'right',
      align: 'center',
      valueType: 'option',
      render: (_, record: ITotalCustomerTabCom) => {
        const { identity = '' } = record;
        const statusText = record?.isDefault ? null : (
          <span style={{ color: !record?.status ? 'red' : '#047903' }}>
            {!record?.status ? '拉黑' : '解冻'}
          </span>
        );
        const moreBtns: MenuProps['items'] = [
          identity === 'CUSTOMER' || identity === 'PARTNER'
            ? {
                key: 'SETTEAM',
                label: (
                  <Button
                    type="link"
                    onClick={() => setIdentity(record, 'TEAM')}
                    className={styles.identityBtn}
                  >
                    设为团长
                  </Button>
                ),
              }
            : null,
          identity === 'CUSTOMER' || identity === 'TEAM'
            ? {
                key: 'SETPARTNER',
                label: (
                  <Button
                    type="link"
                    onClick={() => setIdentity(record, 'PARTNER')}
                    className={styles.identityBtn}
                  >
                    设为合伙人
                  </Button>
                ),
              }
            : null,
          {
            key: 'SETTAG',
            label: (
              <Button
                type="link"
                onClick={() => {
                  setShowTagModel(true);
                  setColumnRecord(record);
                }}
                className={styles.identityBtn}
              >
                打标签
              </Button>
            ),
          },
          {
            key: 'modifyAddress',
            label: (
              <Button
                type="link"
                onClick={() => {
                  setShowModifyAddress(true);
                }}
                className={styles.identityBtn}
              >
                修改地址
              </Button>
            ),
          },
        ];
        return (
          <div className={styles.operateBtns}>
            {operateBtns()?.map((item, index) => {
              const { identity = '' } = record || {};
              const { type = '', clickFc, dynamicTitle = false, operateTitle = '' } = item || {};
              if (identity === 'TEAM' && type === 'SETTEAM') return null;

              return (
                <Button
                  type="link"
                  key={index}
                  className={styles.operateBtn}
                  onClick={() => {
                    clickFc?.(record);
                    setColumnRecord(record);
                  }}
                >
                  {dynamicTitle ? statusText : operateTitle}
                </Button>
              );
            })}
            <Dropdown menu={{ items: moreBtns }} placement="bottom" arrow>
              <Space>
                <span style={{ color: '#2e75f5' }}>更多</span>
                {/*<DownOutlined style={{ color: '#2e75f5' }} />*/}
              </Space>
            </Dropdown>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    getClientTagsList();
    getUserLevelList();

    // 设置合伙人和团长别名
    getIdentity({ keys: ['TEAM_ALIAS', 'PARTNER_ALIAS'] }).then(
      ({ data: { PARTNER_ALIAS = '', TEAM_ALIAS = '' } }) => {
        setIdentityEnum([
          identityEnum[0],
          {
            ...identityEnum[1],
            label: TEAM_ALIAS,
          },
          {
            ...identityEnum[2],
            label: PARTNER_ALIAS,
          },
          {
            ...identityEnum[3],
            label: `${TEAM_ALIAS}和${PARTNER_ALIAS}`,
            labels: [
              {
                ...identityEnum[1],
                label: TEAM_ALIAS,
              },
              {
                ...identityEnum[2],
                label: PARTNER_ALIAS,
              },
            ],
          },
        ]);
      },
    );
  }, []);

  useEffect(() => {
    getClientsList();
  }, [refresh]);

  const SearchForm = () => {
    return (
      <Card style={{ marginBottom: 20 }}>
        <Form layout="inline" form={form}>
          <Row gutter={[18, 20]} wrap={true}>
            <Col span={6}>
              <FormItem label="客户昵称" name="userName">
                <Input placeholder="请输入客户昵称" />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="手机号码" name="phone">
                <Input placeholder="请输入手机号码" />
              </FormItem>
            </Col>
            {/*<Col span={6}>*/}
            {/*  <FormItem label="客户来源" name="source">*/}
            {/*    <Select placeholder="请选择客户来源" />*/}
            {/*  </FormItem>*/}
            {/*</Col>*/}
            {/*<Col span={8}>*/}
            {/*  <FormItem label="成为客户时间" name="customerTime">*/}
            {/*    <RangePicker showTime />*/}
            {/*  </FormItem>*/}
            {/*</Col>*/}
            <Col span={6}>
              <FormItem label="客户身份" name="identity">
                <Select placeholder="请选择客户身份" options={identityEnum} allowClear />
              </FormItem>
            </Col>
            {/*<Col span={8}>*/}
            {/*  <FormItem label="最近消费时间" name="dissipateTime">*/}
            {/*    <RangePicker showTime />*/}
            {/*  </FormItem>*/}
            {/*</Col>*/}
            <Col span={6}>
              <FormItem label="会员等级" name="level">
                <Select placeholder="请选择会员等级" options={levelSource} allowClear />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="客户标签" name="labelIds">
                <Select
                  placeholder="请选择客户标签"
                  options={clientTagList}
                  mode="multiple"
                  allowClear
                />
              </FormItem>
            </Col>
            <Col span={16}>
              <div style={{ display: 'flex' }}>
                <FormItem label="选择时间类型" name="timeType" className={styles.selectWidth}>
                  <Select
                    allowClear
                    placeholder="时间类型"
                    options={timeOption}
                    onChange={onChangeTimeType}
                    className={styles.select}
                  />
                </FormItem>
                <FormItem
                  name="timeData"
                  rules={[
                    {
                      required: !isDisable,
                      message: `请选择${
                        timeOption.find(
                          ({ value }: { value: number }) =>
                            value === form.getFieldValue('timeType'),
                        )?.label
                      }时间`,
                    },
                  ]}
                >
                  <RangePicker showTime onChange={onChangeTime} disabled={isDisable} />
                </FormItem>
              </div>
            </Col>
            <Col span={10}>
              <div className={styles.searchButton}>
                <Button type="primary" onClick={onQueryList}>
                  筛选
                </Button>
                <Button onClick={onClearQuery}>重置</Button>
                <Button type="default" onClick={() => setShowExportModel(true)}>
                  导出
                </Button>
                {/*<Button>查询导出历史</Button>*/}
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  };

  return (
    <>
      <PageContainer header={{ breadcrumb: undefined }}>
        <SearchForm />
        <ProTable<ITotalCustomerTabCom>
          loading={loading}
          columns={columns}
          headerTitle="客户列表"
          scroll={{ x: 1000, y: dataSource?.length >= 5 ? '54vh' : undefined }}
          search={false}
          options={{
            reload: onQueryList,
          }}
          rowKey="rowKey"
          pagination={{
            pageSize: requestParams?.pageSize,
            current: requestParams?.pageNo,
            total,
            onChange: onChangePage,
          }}
          dataSource={dataSource}
        />
      </PageContainer>
      <DetailDrawer
        showDetail={showDetail}
        setShowDetail={() => setShowDetail(false)}
        {...columnRecord}
      />

      <TagModel
        showTagModel={showTagModel}
        setShowTagModel={() => setShowTagModel(false)}
        tagsList={clientTagList}
        setRefresh={() => setRefresh(!refresh)}
        {...columnRecord}
      />
      <LevelModel
        showLevelModel={showLevelModel}
        setShowLevelModel={() => setShowLevelModel(false)}
        levelSource={levelSource}
        setRefresh={() => setRefresh(!refresh)}
        {...columnRecord}
      />
      <Modal
        title="客户签到记录"
        className={styles.calenderdate}
        open={showAttendance}
        width={1000}
        footer={[]}
        destroyOnClose
        onCancel={() => setShowAttendance(false)}
      >
        <div className={styles.attendanceModel}>
          <span className={styles.userName}>昵称：{columnRecord?.userName ?? '-'}</span>
          <span className={styles.registerTime}>注册时间：{columnRecord?.registerTime ?? '-'}</span>
          <span>本月签到/补签：{signInDays ?? 0} 天</span>
        </div>
        {showAttendance && (
          <AttendanceRecord
            customerId={columnRecord?.id}
            registerTime={columnRecord?.registerTime}
            setSignInDays={setSignInDays}
          />
        )}
      </Modal>
      {/* <ModifyAddress
        showModifyAddress={showModifyAddress}
        setShowModifyAddress={setShowModifyAddress}
        setRefresh={() => setRefresh(!refresh)}
      /> */}
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.UserInfoToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </>
  );
});
