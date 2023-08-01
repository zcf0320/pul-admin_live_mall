import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import { history, useLocation } from '@umijs/max';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Popover, Tabs, TabsProps } from 'antd';

import RepayingList from '../RepayingList';
import OperateModel from './OperateModel';
import EditRemarkModel from './EditRemarkModel';

import type { TableListItem } from './data';
import { ITemplateParams } from './data';
import { TableRequest } from '@/pages/utils/tableRequest';
import { getlevelList } from '../../settings/LevelSetting/service';
import {
  changePartner,
  changeTutor,
  clearTeam,
  getPage,
  partnerList,
  postExport,
  tutorList,
} from './service';
import { exportExcelBlob } from '@/pages/utils/export';
import styles from './index.less';
import LevelModel from '@/pages/distribution/popularize/PopularizeList/LevelModel';
import { IOption } from '@/pages/Customer/TotalCustomer/data';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';

export const checkIcon = require('@/assets/check.png');

const modelTexts = [
  {
    type: 'CLEAR',
    identity: '团长',
    title: '清退团长',
    alertText: '清退合伙人后，已产生团队订单会继续结算',
    optionName: 'clearName',
    paramText: 'teamInfo',
    currentIdName: 'teamId',
    method: getPage,
    setMethod: clearTeam,
  },
  {
    type: 'CHANGE_PARTNER',
    identity: '合伙人',
    title: '变更合伙人',
    secondText: '当前合伙人',
    optionName: 'partnerName',
    currentIdName: 'teamId',
    paramText: 'partnerInfo',
    method: partnerList,
    setMethod: changePartner,
  },
  {
    type: 'CHANGE_TUTOR',
    title: '变更客户经理',
    identity: '客户经理',
    secondText: '当前客户经理',
    optionName: 'tutorName',
    currentIdName: 'teamId',
    paramText: 'mentorInfo',
    method: tutorList,
    setMethod: changeTutor,
  },
];
const items: TabsProps['items'] = [
  {
    key: '1',
    label: '团长管理',
  },
  {
    key: '2',
    label: '清退记录',
  },
];
export default () => {
  const ref = useRef<ActionType>();
  const { state }: any = useLocation();
  const [key, setKey] = useState<string>('1');
  const [templateParams, setTemplateParams] = useState<ITemplateParams>({
    pageSize: 10,
    startTime: state?.startTime,
    endTime: state?.endTime,
  });
  const [showOperate, setShowOperate] = useState<boolean>(false); // 点击操作，显示弹窗
  const [columnRecord, setColumnRecord] = useState<TableListItem | any>();
  const [operateType, setOperateType] = useState<string>('');
  const [showRemark, setShowRemark] = useState<boolean>(false); // 开启修改备注名弹窗
  const [showLevelModel, setShowLevelModel] = useState<boolean>(false); // 是否显示调整等级弹窗
  const [levelSource, setLevelSource] = useState<IOption[]>([]); // 会员等级
  const [showExportModel, setShowExportModel] = useState(false);
  const onChangeTabKey = (key: string) => {
    setKey(key);
  };
  // 导出列表
  const onExportList = async (excludeColumnFieldNames: string[]) => {
    postExport({ ...templateParams, excludeColumnFieldNames }).then((res) => {
      exportExcelBlob(`团长 ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`, res);
    });
  };
  const detail = (record: TableListItem) => {
    return (
      <a
        onClick={() => {
          // setDrawerShow(true);
          // setCurrentDetails(record);
          // console.log(currentDetails);
          history.push('/distribution/popularize/PopularizeDetail', {
            tabKey: record?.type || 'ALL',
            parentId: record?.id,
            isDefault: record?.isDefault,
            customerNum: record?.customerNum,
          });
        }}
        key="detail"
      >
        详情
      </a>
    );
  };

  const subordinate = (record: TableListItem) => {
    return (
      <a
        onClick={() => {
          history.push('/distribution/popularize/Subordinate', record);
        }}
      >
        下级
      </a>
    );
  };

  // const repaying = (record: TableListItem) => {
  //   return (
  //     <a
  //       key="subordinate"
  //       // onClick={() => {
  //       //   Modal.confirm({
  //       //     title: '取消',
  //       //     content: '确定清退该团长吗？',
  //       //     onOk: () => {
  //       //       clear({ teamId: record.id }).then(() => {
  //       //         message.success('已清退');
  //       //       });
  //       //     },
  //       //   });
  //       // }}
  //     >
  //       变更
  //     </a>
  //   );
  // };

  const more = (record: TableListItem) => {
    const onClickBtn = (type: string): void => {
      setOperateType(type);
      setColumnRecord(record);
      setShowOperate(true);
    };

    return (
      <Popover
        placement="bottomRight"
        content={() => (
          <div className={styles.flexCloumn}>
            {record?.isDefault ? null : (
              <>
                <Button type="link" onClick={() => onClickBtn('CLEAR')}>
                  清退
                </Button>
                <Button type="link" onClick={() => onClickBtn('CHANGE_TUTOR')}>
                  变更客户经理
                </Button>
                <Button type="link" onClick={() => onClickBtn('CHANGE_PARTNER')}>
                  变更合伙人
                </Button>
              </>
            )}
            <Button
              type="link"
              onClick={() => {
                setShowLevelModel(true);
                setColumnRecord(record);
              }}
            >
              调整等级
            </Button>
            <Button
              type="link"
              onClick={() => {
                setShowRemark(true);
                setColumnRecord(record);
              }}
            >
              修改备注名
            </Button>
          </div>
        )}
      >
        <a key="more">
          更多 <DownOutlined style={{ color: '#2e75f5' }} />
        </a>
      </Popover>
    );
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '加入时间',
      dataIndex: 'time',
      valueType: 'dateTimeRange',
      hideInTable: true,
      initialValue: [state?.startTime, state?.endTime],
      search: {
        transform: (record) => {
          return {
            startTime: record[0],
            endTime: record[1],
          };
        },
      },
    },
    {
      title: '团长信息',
      dataIndex: 'teamInfo',
      hideInTable: true,
      fieldProps: {
        placeholder: '备注名/昵称/手机号/ID',
      },
    },
    {
      title: '团长等级',
      dataIndex: 'level',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择团长等级',
      },
      request: async () => {
        const msg = await getlevelList({ pageNo: 1, pageSize: 10000 });
        const options = msg?.data?.records?.map((item) => ({
          value: item.level,
          label: item.name,
        }));
        setLevelSource(options);
        return options;
      },
    },
    {
      title: '上级信息',
      dataIndex: 'supInfo',
      hideInTable: true,
      width: 200,
      fieldProps: {
        placeholder: '备注名/昵称/手机号/ID',
      },
    },
    {
      title: '团长状态',
      dataIndex: 'isClear',
      hideInTable: true,
      valueType: 'select',
      valueEnum: new Map([
        [false, '正常'],
        [true, '已清退'],
      ]),
      fieldProps: {
        defaultValue: null,
        placeholder: '请选择团长状态',
      },
    },
    // {
    //   title: 'ID',
    //   width: 90,
    //   dataIndex: 'id',
    //   search: false,
    //   align: 'center',
    //   ellipsis: true,
    //   copyable: true,
    // },
    {
      title: '团长信息',
      align: 'center',
      // ellipsis: true,
      search: false,
      width: 200,
      render: (node, record) => {
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
            <div className={styles.flexCloumn}>
              <span>昵称：{remarkName ?? name}</span>
              <span>ID：{id || '-'}</span>
              <span>手机号：{phone || '-'}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '团长等级',
      dataIndex: 'levelName',
      align: 'center',
      width: 150,
      search: false,
      ellipsis: true,
    },
    {
      title: '所属团队',
      dataIndex: 'orgName',
      align: 'center',
      width: 150,
      search: false,
      ellipsis: true,
    },
    {
      title: '上级信息',
      align: 'center',
      width: 200,
      search: false,
      ellipsis: true,
      render: (node, record) => {
        return (
          <div
            style={{
              textAlign: 'left',
              marginLeft: 8,
              whiteSpace: 'nowrap',
              width: '50%',
              margin: '0 auto',
            }}
          >
            <div>昵称：{record?.supRemarkName ?? (record.supName || '-')}</div>
            <div>ID：{record?.supId || '-'}</div>
            <div>手机号：{record.supPhone || '-'}</div>
          </div>
        );
      },
    },
    {
      title: '下级客户数',
      dataIndex: 'customerNum',
      width: 100,
      align: 'center',
      search: false,
      ellipsis: true,
    },
    {
      title: '总佣金',
      align: 'center',
      search: false,
      width: 150,
      render: (
        _,
        { settledCommission = '0.00', toBeSettledCommission = '0.00', id = '', isDefault = false },
      ) =>
        toBeSettledCommission && settledCommission ? (
          <div className={styles.expenditure}>
            <div className={styles.expenditureContent}>
              <span>已结算：</span>
              {/*<span>¥{settledCommission}</span>*/}
              <div
                className={styles.amount}
                onClick={() =>
                  history.push('/distribution/popularize/PopularizeDetail', {
                    parentId: id,
                    tabKey: 'SETTLED',
                    settleFlag: true,
                    isDefault,
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
                  history.push('/distribution/popularize/PopularizeDetail', {
                    parentId: id,
                    tabKey: 'TOBESETTLED',
                    settleFlag: false,
                    isDefault,
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
    {
      title: '加入时间',
      dataIndex: 'createTime',
      search: false,
      align: 'center',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'isClear',
      width: 100,
      search: false,
      align: 'center',
      render: (text) => (
        <span style={{ color: text ? 'red' : 'green' }}>{text ? '已清退' : '正常'}</span>
      ),
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      valueType: 'option',
      align: 'center',
      render: (_, record: TableListItem) => {
        return (
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              flexWrap: 'nowrap',
              whiteSpace: 'nowrap',
            }}
          >
            {detail(record)}
            {!record?.isClear && subordinate(record)}
            {/*{!record?.isDefault && repaying(record)} */}
            {!record?.isClear && more(record)}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Tabs
        defaultActiveKey={key}
        items={items}
        onChange={onChangeTabKey}
        className={styles.tabs}
      />
      {key === '1' ? (
        <ProTable<TableListItem>
          columns={columns}
          actionRef={ref}
          rowKey="id"
          scroll={{ x: 1400 }}
          headerTitle="团长列表"
          search={{
            labelWidth: 'auto',
            span: 8,
            collapsed: false,
            collapseRender: () => null,
            optionRender: (searchConfig, { form }, dom) => [
              ...dom,
              <Button
                key="exportTeam"
                // onClick={() => {
                //   postExport(templateParams).then((res) => {
                //     exportExcelBlob(`团长 ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`, res);
                //   });
                // }}
                onClick={() => {
                  setShowExportModel(true);
                  form?.submit();
                }}
              >
                导出
              </Button>,
            ],
            showHiddenNum: true,
          }}
          request={(params) => {
            setTemplateParams(params as ITemplateParams);
            return TableRequest(params, getPage);
          }}
          pagination={{
            pageSize: templateParams?.pageSize,
          }}
        />
      ) : (
        <RepayingList />
      )}
      <OperateModel
        modelTexts={modelTexts}
        operateType={operateType}
        showOperate={showOperate}
        setShowOperate={setShowOperate}
        setRefresh={() => ref.current?.reload()}
        {...columnRecord}
      />
      <EditRemarkModel
        showRemark={showRemark}
        setShowRemark={setShowRemark}
        setRefresh={() => ref.current?.reload()}
        {...columnRecord}
      />
      <LevelModel
        levelSource={levelSource}
        showLevelModel={showLevelModel}
        setShowLevelModel={() => {
          setShowLevelModel(false);
          ref.current?.reload();
        }}
        {...columnRecord}
      />
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.TeamToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </>
  );
};
