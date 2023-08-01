import { useLocation } from '@umijs/max';
import { Avatar, Button, Card, Image, Space, Tooltip, Modal, message } from 'antd';
import { TableListItem } from '../PopularizeList/data';
import {
  ActionType,
  FooterToolbar,
  ProColumns,
  ProDescriptions,
  ProTable,
  ModalForm,
  ProFormDateTimeRangePicker,
} from '@ant-design/pro-components';
import { TableRequest } from '@/pages/utils/tableRequest';
import {
  getPage,
  // postUserBatchUpdateTeam,
  postUserBatchDel,
  postUserBatchCheckIn,
  // postUserBatchCheckIn,
} from './service';
import { SubUserInfo } from './data';
import { useState, useRef } from 'react';
import OperModel from './OperModel';
import { tutorList, changeTutor } from './service';
import type { ProFormInstance } from '@ant-design/pro-components';

// 获取团长列表
// import { getPage as getTeam } from '../PopularizeList/service';
import AttendanceRecord from '@/pages/Customer/TotalCustomer/AttendanceRecord';
import styles from './index.module.less';
const modelTexts = [
  // {
  //   type: 'CHANGE_PARTNER',
  //   identity: '合伙人',
  //   title: '变更合伙人',
  //   secondText: '当前合伙人',
  //   optionName: 'partnerName',
  //   currentIdName: 'teamId',
  //   paramText: 'partnerInfo',
  //   method: partnerList,
  //   setMethod: changePartner,
  // },
  {
    type: 'CHANGE_TUTOR',
    title: '变更团长',
    identity: '团长',
    // secondText: '当前客户经理',
    optionName: 'tutorName',
    currentIdName: 'userIdList',
    paramText: 'teamInfo',
    method: tutorList,
    setMethod: changeTutor,
  },
];
export default () => {
  const ref = useRef<ActionType>();
  let { state }: any = useLocation();

  const [recordItem, setRecordItem] = useState<any>({
    isDefaultTeam: state?.isDefault,
    parentId: state?.id,
  });

  const reloadTable = () => ref.current?.reload();

  const [selectRowKeys, setSelectRowKeys] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [mode, setMode] = useState<'single' | 'multiple'>('single');

  const [deleteTipModalOpen, setDeleteTipModalOpen] = useState(false);

  const [operateType, setOperateType] = useState<string>('');
  const [showOperate, setShowOperate] = useState<boolean>(false); // 点击操作，显示弹窗
  const [showAttendance, setShowAttendance] = useState<boolean>(false); // 显示签到日历
  const [columnRecord, setColumnRecord] = useState<any>(); // 点击当前列的详情数据
  const [signInDays, setSignInDays] = useState(0);
  const [signature, setSignature] = useState('');

  const formRef = useRef<ProFormInstance>();
  // 获取团长列表数据
  // const getTeamOptions = async () => {
  //   const result = await getTeam({
  //     pageNo: 1,
  //     pageSize: 10000,
  //   });
  // };

  // useEffect(() => {
  //   getTeamOptions();
  // }, []);
  // 批量删除
  const onClickBtn = (type: string): void => {
    setOperateType(type);
    //  setColumnRecord(record);
    setShowOperate(true);
  };
  const renderChange = (record: TableListItem) => {
    return (
      <a
        key="subordinate"
        onClick={() => {
          // setModalOpen(true);
          onClickBtn('CHANGE_TUTOR');
          setRecordItem({ ...recordItem, ...record });

          // setMode('single');
        }}
      >
        变更
      </a>
    );
  };

  const renderDelete = (record: TableListItem) => {
    return (
      <a
        key="deleteLabel"
        onClick={() => {
          setDeleteTipModalOpen(true);
          setRecordItem(record);
          setMode('single');
        }}
      >
        删除
      </a>
    );
  };

  const renderPatch = (record: TableListItem) => {
    return (
      <a
        key="补签"
        onClick={() => {
          setShowAttendance(true);
          setColumnRecord(record);
          setSignature('补签');

          // setRecordItem(record);
          // setSwitch1(record.divideTeam);
          // setSwitch2(record.dividePartner);
          // setModalOpen(true);
          // setMode('single');
        }}
      >
        补签
      </a>
    );
  };

  const deleteModalHandle = () => {
    setDeleteTipModalOpen(false);
  };
  // 批量补签
  const batchSigning = () => {
    formRef.current?.resetFields();
    setModalOpen(true);
  };
  const columns: ProColumns<SubUserInfo>[] = [
    {
      title: '客户信息',
      width: 160,
      search: false,
      render: (node, record) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: '50%' }}
              src={record.headImage}
              preview={false}
            />

            <div style={{ marginLeft: 8, color: 'rgba(0, 0, 0, 0.65)' }}>
              <div>{record.userName}</div>
              <div>{record.phone}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '消费次数',
      dataIndex: 'consumptionNum',
      width: 90,
      ellipsis: true,
    },
    {
      title: '消费额',
      dataIndex: 'consumptionAmount',
      width: 90,
      ellipsis: true,
      valueType: 'money',
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      width: 90,
      ellipsis: true,
    },
    {
      title: '操作',
      width: 60,
      fixed: 'right',
      valueType: 'option',
      align: 'center',
      render: (_, record: any) => (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {renderChange(record)}
          {renderDelete(record)}
          {renderPatch(record)}
        </div>
      ),
    },
    // {
    //   title: '关系绑定时间',
    //   dataIndex: '',
    //   width: 90,
    //   ellipsis: true,
    // },
  ];
  return (
    <>
      <Card title="当前团长">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <Avatar
              src={state.image}
              draggable={false}
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            />
          </div>
          <div style={{ marginTop: 16, marginLeft: 16 }}>
            <ProDescriptions
              dataSource={state}
              columns={[
                {
                  title: '团长昵称',
                  dataIndex: 'name',
                  ellipsis: true,
                  copyable: true,
                },
                {
                  title: '团长等级',
                  dataIndex: 'levelName',
                  ellipsis: true,
                },
                {
                  title: '客户ID',
                  dataIndex: 'id',
                  ellipsis: true,
                  copyable: true,
                },
                {
                  title: '上级',
                  hide: true,
                  render(dom, entity) {
                    if (!entity.supId) {
                      return '-';
                    }
                    return (
                      <Tooltip
                        color="#fff"
                        title={() => {
                          return (
                            <div style={{ color: '#666', padding: 10 }}>
                              <div> {entity.supName}</div>
                              <div> {entity.supPhone}</div>
                            </div>
                          );
                        }}
                      >
                        微信用户（ID：{entity.supId}）
                      </Tooltip>
                    );
                  },
                },
                {
                  title: '手机号',
                  dataIndex: 'phone',
                  ellipsis: true,
                  copyable: true,
                },
                {
                  title: '加入时间',
                  dataIndex: 'createTime',
                  ellipsis: true,
                },
              ]}
            />
          </div>
        </div>
      </Card>

      <br />

      <div
        style={{ paddingTop: 12, background: '#fff', border: '1px solid #f0f0f0', borderRadius: 8 }}
      >
        <ProTable<SubUserInfo>
          actionRef={ref}
          rowKey="id"
          columns={columns}
          search={false}
          options={false}
          toolBarRender={() => []}
          params={{ id: state.id }}
          // tableAlertRender={false}
          headerTitle={
            <div
              key={'key'}
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              下级客户：
              <Button
                type="primary"
                // onClick={async () => {
                //   setMode('multiple');
                //   setModalOpen(true);
                // }}
                onClick={() => onClickBtn('CHANGE_TUTOR')}
                disabled={selectRowKeys.length === 0}
              >
                批量变更
              </Button>
              {state.isDefault ? (
                <div style={{ margin: '0 5px' }}></div>
              ) : (
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    setDeleteTipModalOpen(true);
                  }}
                  disabled={selectRowKeys.length === 0}
                  style={{ margin: '0 5px' }}
                >
                  批量删除
                </Button>
              )}
              <Button
                type="primary"
                // onClick={async () => {
                //   // const res = await postUserBatchCheckIn({ userIdList: selectRowKeys });
                //   // if (res.code === 0) {
                //   //   message.success('补签成功！');
                //   //   reloadTable();
                //   // } else {
                //   //   message.error('补签失败！');
                //   // }
                // }}
                onClick={() => batchSigning()}
                disabled={selectRowKeys.length === 0}
              >
                批量补签
              </Button>
            </div>
          }
          rowSelection={{
            selectedRowKeys: selectRowKeys,
            onChange(selectedRowKeys, selectedRows, info) {
              setSelectRowKeys(selectedRowKeys as string[]);
            },
          }}
          tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
            return (
              <Space size={24}>
                <span>
                  已选 {selectedRowKeys.length} 项
                  <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                    取消选择
                  </a>
                </span>
              </Space>
            );
          }}
          request={(params) => TableRequest(params, getPage)}
        />
      </div>
      <ModalForm
        title="批量补签"
        open={modalOpen}
        formRef={formRef}
        layout="inline"
        onOpenChange={(visible) => {
          setModalOpen(visible);
        }}
        onFinish={async (values: any) => {
          postUserBatchCheckIn({
            date: `${values.datetimeRange}`,
            userIdList: selectRowKeys,
          }).then(() => {
            message.success('设置成功');
            ref.current?.reload();
            setModalOpen(false);
            setSelectRowKeys([]);
          });
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            已选: <span style={{ color: '#2e74ff', margin: '0 10px' }}>{selectRowKeys.length}</span>
            人
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ProFormDateTimeRangePicker name="datetimeRange" label="选择补签日期" />
          </div>
        </div>
      </ModalForm>

      <Modal
        title="确定要批量删除吗？"
        open={deleteTipModalOpen}
        onCancel={deleteModalHandle}
        onOk={async () => {
          // console.log(selectRowKeys);
          const res = await postUserBatchDel({
            userIdList: mode === 'multiple' ? selectRowKeys : [recordItem?.id ?? ''],
          });
          if (res.code === 0) {
            message.success('删除成功！');
            reloadTable();
          } else {
            message.error('删除失败！');
          }
          setDeleteTipModalOpen(false);
        }}
      ></Modal>
      <OperModel
        modelTexts={modelTexts}
        operateType={operateType}
        showOperate={showOperate}
        setShowOperate={setShowOperate}
        selectRowKeys={selectRowKeys}
        setRefresh={() => ref.current?.reload()}
        {...recordItem}
      ></OperModel>
      <FooterToolbar
        style={{
          left: 0,
          zIndex: 999,
          marginLeft: '110px',
          width: 'calc(100% - 110px)',
        }}
        extra={
          <div
            style={{
              width: '100%',
              paddingBlock: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
            }}
          >
            <Button type="default" onClick={() => history.back()}>
              返回
            </Button>
          </div>
        }
      />
      <Modal
        title={signature}
        // className={styles.calenderdate}
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
    </>
  );
};
