import { FC, useEffect, useState } from 'react';
import { history } from '@@/core/history';
import dayjs from 'dayjs';
import { useLocation } from '@@/exports';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import OperateModel from '@/pages/distribution/popularize/PopularizeList/OperateModel';

import {
  partnerList,
  teamMemberList,
} from '@/pages/partner/PartnerManagement/PartnerList/services';
import {
  exportMemberList,
  moveSubordinates,
} from '@/pages/partner/PartnerManagement/TeamMember/service';
import { exportExcelBlob } from '@/pages/utils/export';

import styles from './index.module.less';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';

// const formatText = 'YYYY-MM-DD HH:mm:ss';
const modelTexts = [
  {
    type: 'CHANGE_PARTNER',
    identity: '合伙人',
    title: '变更合伙人',
    secondText: '当前合伙人',
    optionName: 'partnerName',
    currentIdName: 'memberId',
    paramText: 'partnerInfo',
    method: partnerList,
    setMethod: moveSubordinates,
  },
];
const TeamMember: FC = () => {
  const { state }: any = useLocation(); // 合伙人列表跳转的路由参数
  // const [form] = Form.useForm();
  const [requestParams, setRequestParams] = useState<any>({
    pageNo: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [teamMemberData, setTeamMemberData] = useState([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  //const [partnerLevelOption, setPartnerLevel] = useState<Map<number, string>>();
  const [columnRecord, setColumnRecord] = useState<any>({});
  const [showMoveTeamMember, setShowMoveTeamMember] = useState<boolean>(false);
  const [showExportModel, setShowExportModel] = useState(false);
  // 获取合伙人等级列表
  // const getPartnerLevelList = async (): Promise<void> => {
  //   const { data: { records = [] } = {} } = await partnerLevelList({
  //     pageNo: 1,
  //     pageSize: 999,
  //   });
  //   const arr = records?.map((item: { level: number; name: string }) => [item?.level, item?.name]);
  //   setPartnerLevel(arr);
  // };

  // const getFormValues = () => {
  //   const { time } = form.getFieldsValue();
  //   const params = {
  //     ...form.getFieldsValue(),
  //     startTime: getFormatDayTime(time?.[0], formatText),
  //     endTime: getFormatDayTime(time?.[1], formatText),
  //   };
  //   delete params.time;
  //   return params;
  // };
  const getTeamMemberList = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data: { records = [], total = 0 } = {} } = await teamMemberList({
        ...requestParams,
        id: state?.parentId || '',
      });
      setTeamMemberData(records);
      setTotal(total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  // const onQueryList = (): void => {
  //   setRequestParams({
  //     ...requestParams,
  //     ...getFormValues(),
  //     pageNo: 1,
  //   });
  //   setRefresh(!refresh);
  // };
  //
  // const onReset = () => {
  //   setRequestParams({
  //     pageSize: requestParams.pageSize,
  //     pageNo: 1,
  //   });
  //   form.resetFields();
  //   setRefresh(!refresh);
  // };
  //
  const onExportList = async (excludeColumnFieldNames: string[]): Promise<void> => {
    exportExcelBlob(
      `合伙人${state?.parentName || ''}-团队成员列表-${dayjs().format('YYYY-MM-DD HH_mm')}`,
      await exportMemberList({ id: state?.parentId, excludeColumnFieldNames, ...requestParams }),
    );
  };

  const onChangePage = (pageNo: number, pageSize: number) => {
    setRequestParams({
      ...requestParams,
      pageNo,
      pageSize,
    });
    setRefresh(!refresh);
  };

  // useEffect(() => {
  //   getPartnerLevelList(); // 合伙人等级列表
  // }, []);

  useEffect(() => {
    getTeamMemberList();
  }, [state?.parentId, refresh]);

  const columns: ProColumns[] = [
    {
      title: '团队成员',
      dataIndex: 'time',
      search: false,
      width: 300,
      align: 'center',
      // tooltip: {
      //   icon: <QuestionCircleOutlined />,
      //   title: (
      //     <>
      //       <div>团队成员 - 直属</div>
      //       <div>合伙人直属发展的下级团长，进入团队后，为 直属团队成员</div>
      //       <div>团队成员 - 非直属</div>
      //       <div>除直属团长外的所有下级团长，成为团队成员 后，即为非直属团队成员</div>
      //     </>
      //   ),
      // },
      render: (text, record) => {
        const { id = '', image = '', name = '', phone = '', remarkName = '' } = record;
        return (
          <div className={styles.teamMemberInfo}>
            <div className={styles.avatar}>
              <Avatar
                size={52}
                src={image || ''}
                icon={<UserOutlined />}
                className={styles.avatarImg}
                // style={{ borderColor: record?.type === '1' ? '#2e75f5' : '#FF9800FF' }}
              />
              {/*<span*/}
              {/*  className={styles.avatarDescribe}*/}
              {/*  style={{ backgroundColor: record?.type === '1' ? '#2e75f5' : '#FF9800FF' }}*/}
              {/*>*/}
              {/*  {record?.type === '1' ? '直属' : '非直属'}*/}
              {/*</span>*/}
            </div>
            <div>
              <div>昵称：{remarkName ?? (name || '-')}</div>
              <div>ID：{id || '-'}</div>
              <div>手机号：{phone || '-'}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '所属合伙人',
      dataIndex: 'type',
      search: false,
      width: 300,
      align: 'center',
      render: (text, record) => {
        const { supId = '', supName = '', supPhone = '', supRemarkName = '' } = record;
        return (
          <div className={styles.teamMemberInfo}>
            <div>
              <div>昵称：{supRemarkName ?? (supName || '-')}</div>
              <div>ID：{supId || '-'}</div>
              <div>手机号：{supPhone || '-'}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '加入时间',
      dataIndex: 'createTime',
      search: false,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '团长等级',
      dataIndex: 'levelName',
      search: false,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '已结算佣金',
      dataIndex: 'settledCommission',
      search: false,
      ellipsis: true,
      align: 'center',
      render: (_: any, record: any) => (
        <div className={styles.settled}>¥ {record?.settledCommission || '-'}</div>
      ),
    },
    {
      title: '待结算佣金',
      dataIndex: 'consumptionTime',
      search: false,
      ellipsis: true,
      align: 'center',
      render: (_: any, record: any) => (
        <div className={styles.pendingSettled}>¥ {record?.toBeSettledCommission || '-'}</div>
      ),
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'remark',
      search: false,
      align: 'center',
      render: (text, record) => {
        return (
          <div className={styles.optionBtn}>
            <Button
              type="link"
              onClick={() =>
                history.push('/distribution/popularize/PopularizeDetail', { parentId: record?.id })
              }
            >
              详情
            </Button>
            <Button
              type="link"
              onClick={() => {
                setShowMoveTeamMember(true);
                setColumnRecord(record);
              }}
            >
              变更合伙人
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      {/*<Card className={styles.teamMemberCard}>*/}
      {/*<ProForm form={form} layout="inline" submitter={false}>*/}
      {/*  <Row gutter={[10, 20]}>*/}
      {/*    <Col span={10}>*/}
      {/*      <ProFormDateTimeRangePicker*/}
      {/*        label="加入时间"*/}
      {/*        name="time"*/}
      {/*        width="lg"*/}
      {/*        placeholder={['起始时间', '结束时间']}*/}
      {/*      />*/}
      {/*    </Col>*/}
      {/*    <Col span={7}>*/}
      {/*      <ProFormText label="团队成员" name="member" />*/}
      {/*    </Col>*/}
      {/*    <Col span={7}>*/}
      {/*      <ProFormText label="所属合伙人" name="name" initialValue={state?.parentName || ''} />*/}
      {/*    </Col>*/}
      {/*    <Col span={24}>*/}
      {/*      <div className={styles.teamMember}>*/}
      {/*        <Button htmlType="button" key="search" type="primary" onClick={onQueryList}>*/}
      {/*          筛选*/}
      {/*        </Button>*/}
      {/*        <Button htmlType="button" key="reset" onClick={onReset}>*/}
      {/*          重置*/}
      {/*        </Button>*/}

      {/*        /!*<Button htmlType="button" key="search3">*!/*/}
      {/*        /!*  查看已导出列表*!/*/}
      {/*        /!*</Button>*!/*/}
      {/*      </div>*/}
      {/*    </Col>*/}
      {/*  </Row>*/}
      {/*</ProForm>*/}
      {/*</Card>*/}
      <ProTable
        headerTitle="团队成员列表"
        rowKey="id"
        loading={loading}
        columns={columns}
        scroll={{ x: 1200 }}
        search={false}
        options={false}
        className={styles.table}
        dataSource={teamMemberData}
        toolBarRender={() => [
          <Button key="export" type="primary" onClick={() => setShowExportModel(true)}>
            导出
          </Button>,
        ]}
        pagination={{
          total,
          ...requestParams,
          onChange: onChangePage,
        }}
      />
      <OperateModel
        modelTexts={modelTexts}
        operateType="CHANGE_PARTNER"
        showOperate={showMoveTeamMember}
        setShowOperate={setShowMoveTeamMember}
        setRefresh={() => setRefresh(!refresh)}
        {...columnRecord}
      />
      {/*<MoveTeamMemberModel*/}
      {/*  showMoveTeamMember={showMoveTeamMember}*/}
      {/*  setShowMoveTeamMember={setShowMoveTeamMember}*/}
      {/*/>*/}
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.MembersToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </PageContainer>
  );
};

export default TeamMember;
